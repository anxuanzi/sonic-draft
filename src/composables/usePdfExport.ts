/**
 * PDF Export Composable
 *
 * Handles generation of professional PDF proposals for acoustic designs.
 * Uses jsPDF with html2canvas to create PDF documents with embedded
 * visualization snapshots and cost estimates.
 */

import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { useRoomStore, useSpeakerStore } from '@/stores'
import { useAcoustics } from './useAcoustics'

/**
 * Composable for PDF proposal export functionality.
 */
export function usePdfExport() {
  const roomStore = useRoomStore()
  const speakerStore = useSpeakerStore()
  const acoustics = useAcoustics()

  /**
   * Export canvas element to data URL.
   */
  async function canvasToDataUrl(canvas: HTMLCanvasElement): Promise<string> {
    // Use html2canvas for higher quality export
    const screenshot = await html2canvas(canvas, {
      backgroundColor: '#0a0a0f',
      scale: 2,
    })
    return screenshot.toDataURL('image/png')
  }

  /**
   * Generate and download the PDF proposal.
   *
   * @param topDownCanvas - Reference to the top-down view canvas
   * @param sideElevationCanvas - Reference to the side elevation canvas
   */
  async function exportProposal(
    topDownCanvas?: HTMLCanvasElement | null,
    sideElevationCanvas?: HTMLCanvasElement | null
  ) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 15
    const contentWidth = pageWidth - margin * 2

    let yPos = margin

    // ========================================
    // Header
    // ========================================
    // Logo/Brand
    doc.setFillColor(10, 10, 15)
    doc.rect(0, 0, pageWidth, 35, 'F')

    doc.setTextColor(0, 255, 136)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('SonicDraft', margin, 20)

    doc.setTextColor(150, 150, 170)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Acoustic Design & Proposal Studio', margin, 28)

    // Date
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    doc.setTextColor(100, 100, 120)
    doc.text(date, pageWidth - margin, 20, { align: 'right' })

    yPos = 45

    // ========================================
    // Project Information
    // ========================================
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(roomStore.projectName || 'Untitled Project', margin, yPos)
    yPos += 8

    if (roomStore.venueName) {
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(80, 80, 100)
      doc.text(roomStore.venueName, margin, yPos)
      yPos += 10
    }

    yPos += 5

    // ========================================
    // Room Specifications
    // ========================================
    doc.setFillColor(245, 245, 250)
    doc.roundedRect(margin, yPos, contentWidth, 30, 2, 2, 'F')

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Room Specifications', margin + 5, yPos + 8)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    const specs = [
      `Dimensions: ${roomStore.width}m (W) x ${roomStore.depth}m (D) x ${roomStore.height}m (H)`,
      `Floor Area: ${roomStore.floorArea} m²`,
      `Est. Capacity: ~${roomStore.estimatedCapacity} people`,
    ]

    let specY = yPos + 16
    specs.forEach((spec) => {
      doc.text(spec, margin + 5, specY)
      specY += 5
    })

    yPos += 38

    // ========================================
    // Speaker System Configuration
    // ========================================
    const speaker = speakerStore.selectedSpeaker
    const subwoofer = speakerStore.selectedSubwoofer

    doc.setFillColor(245, 245, 250)
    doc.roundedRect(margin, yPos, contentWidth, speaker && subwoofer ? 50 : 40, 2, 2, 'F')

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Speaker System', margin + 5, yPos + 8)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)

    let sysY = yPos + 16
    if (speaker) {
      doc.text(`Main: ${speaker.brand} ${speaker.model}`, margin + 5, sysY)
      doc.text(`Qty: ${speakerStore.quantity}`, margin + contentWidth - 30, sysY)
      sysY += 6
      doc.text(
        `Coverage: ${speaker.specs.horzDispersion}° H x ${speaker.specs.vertDispersion}° V | Max SPL: ${speaker.specs.maxSPL} dB`,
        margin + 5,
        sysY
      )
      sysY += 6
    }

    if (subwoofer && speakerStore.subQuantity > 0) {
      doc.text(`Subwoofer: ${subwoofer.brand} ${subwoofer.model}`, margin + 5, sysY)
      doc.text(`Qty: ${speakerStore.subQuantity}`, margin + contentWidth - 30, sysY)
      sysY += 6
    }

    // Deployment settings
    doc.text(
      `Trim Height: ${speakerStore.trimHeight}m | Tilt: ${speakerStore.tiltAngle}°`,
      margin + 5,
      sysY
    )

    yPos += speaker && subwoofer ? 58 : 48

    // ========================================
    // Coverage Maps
    // ========================================
    if (topDownCanvas || sideElevationCanvas) {
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Coverage Analysis', margin, yPos)
      yPos += 6

      const imageWidth = contentWidth
      const imageHeight = 50

      if (topDownCanvas) {
        try {
          const topDownDataUrl = await canvasToDataUrl(topDownCanvas)
          doc.addImage(topDownDataUrl, 'PNG', margin, yPos, imageWidth, imageHeight)
          yPos += imageHeight + 3
          doc.setFontSize(8)
          doc.setTextColor(100, 100, 120)
          doc.text('Top-Down Coverage View (Bird\'s Eye)', margin, yPos)
          yPos += 8
        } catch (e) {
          console.error('Failed to capture top-down view:', e)
        }
      }

      if (sideElevationCanvas) {
        try {
          const sideDataUrl = await canvasToDataUrl(sideElevationCanvas)
          doc.addImage(sideDataUrl, 'PNG', margin, yPos, imageWidth, imageHeight)
          yPos += imageHeight + 3
          doc.setFontSize(8)
          doc.setTextColor(100, 100, 120)
          doc.text('Side Elevation View', margin, yPos)
          yPos += 8
        } catch (e) {
          console.error('Failed to capture side elevation view:', e)
        }
      }
    }

    // Coverage stats
    const coverage = speakerStore.coverageAnalysis
    if (coverage) {
      yPos += 5
      doc.setFillColor(240, 255, 245)
      doc.roundedRect(margin, yPos, contentWidth, 25, 2, 2, 'F')

      doc.setTextColor(0, 100, 60)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('Coverage Summary', margin + 5, yPos + 8)

      doc.setFont('helvetica', 'normal')
      doc.text(
        `Center Stage: ${acoustics.formatSPL(coverage.centerStageSPL)} | ` +
          `Front Row: ${acoustics.formatSPL(coverage.frontRowSPL)} | ` +
          `Back Row: ${acoustics.formatSPL(coverage.backRowSPL)}`,
        margin + 5,
        yPos + 16
      )

      if (coverage.hasCeilingReflection) {
        doc.setTextColor(200, 0, 0)
        doc.text('Warning: Potential ceiling reflection detected', margin + 5, yPos + 22)
      }

      yPos += 32
    }

    // ========================================
    // Bill of Materials
    // ========================================
    // Check if we need a new page
    if (yPos > pageHeight - 60) {
      doc.addPage()
      yPos = margin
    }

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Bill of Materials', margin, yPos)
    yPos += 8

    const bom = speakerStore.bom

    // Table header
    doc.setFillColor(230, 230, 240)
    doc.rect(margin, yPos, contentWidth, 8, 'F')
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('Description', margin + 3, yPos + 5.5)
    doc.text('Qty', margin + 100, yPos + 5.5)
    doc.text('Unit Price', margin + 120, yPos + 5.5)
    doc.text('Total', margin + 155, yPos + 5.5, { align: 'right' })
    yPos += 10

    // Table rows
    doc.setFont('helvetica', 'normal')
    bom.items.forEach((item) => {
      doc.text(item.description, margin + 3, yPos + 4)
      doc.text(item.quantity.toString(), margin + 100, yPos + 4)
      doc.text(acoustics.formatCurrency(item.unitPrice, bom.currency), margin + 120, yPos + 4)
      doc.text(
        acoustics.formatCurrency(item.totalPrice, bom.currency),
        margin + 155,
        yPos + 4,
        { align: 'right' }
      )
      yPos += 7
    })

    // Total
    yPos += 3
    doc.setDrawColor(200, 200, 210)
    doc.line(margin, yPos, margin + contentWidth, yPos)
    yPos += 5

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('Estimated Total:', margin + 3, yPos + 4)
    doc.setTextColor(0, 100, 60)
    doc.text(
      acoustics.formatCurrency(bom.subtotal, bom.currency),
      margin + 155,
      yPos + 4,
      { align: 'right' }
    )

    // ========================================
    // Footer
    // ========================================
    const footerY = pageHeight - 10
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 170)
    doc.text(
      'Generated by SonicDraft - The Open-Source Acoustic Design Studio',
      pageWidth / 2,
      footerY,
      { align: 'center' }
    )
    doc.text('https://github.com/anxuanzi/sonic-draft', pageWidth / 2, footerY + 4, {
      align: 'center',
    })

    // ========================================
    // Save PDF
    // ========================================
    const filename = `${roomStore.projectName.replace(/[^a-z0-9]/gi, '_')}_proposal.pdf`
    doc.save(filename)
  }

  return {
    exportProposal,
    canvasToDataUrl,
  }
}
