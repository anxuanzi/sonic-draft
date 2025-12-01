/**
 * Global Settings Store
 *
 * Manages application-wide settings and preferences.
 */

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export type UnitSystem = 'metric' | 'imperial'
export type ViewMode = 'topDown' | 'sideElevation' | 'split'

export const useSettingsStore = defineStore('settings', () => {
  // ============================================
  // State
  // ============================================

  /** Measurement unit system */
  const unitSystem = ref<UnitSystem>('metric')

  /** Current visualization view mode */
  const viewMode = ref<ViewMode>('split')

  /** Show grid on canvas */
  const showGrid = ref(true)

  /** Show SPL legend on canvas */
  const showLegend = ref(true)

  /** Show SPL visualizations (heatmap/legend). Default off to emphasize coverage. */
  const showSPL = ref(false)

  /** Show measurement probe on hover */
  const showProbe = ref(true)

  /** Show reflection warnings */
  const showReflectionWarnings = ref(true)

  /** Canvas resolution multiplier (1 = standard, 2 = high DPI) */
  const canvasResolution = ref(1)

  /** Animation enabled */
  const animationsEnabled = ref(true)

  /** Sidebar collapsed state */
  const sidebarCollapsed = ref(false)

  /** SPL color scheme */
  const splColorScheme = ref<'thermal' | 'neon' | 'mono'>('neon')

  // ============================================
  // Getters
  // ============================================

  /** Length unit label */
  const lengthUnit = computed(() =>
    unitSystem.value === 'metric' ? 'm' : 'ft'
  )

  /** Weight unit label */
  const weightUnit = computed(() =>
    unitSystem.value === 'metric' ? 'kg' : 'lb'
  )

  /** Conversion factor for lengths */
  const lengthFactor = computed(() =>
    unitSystem.value === 'metric' ? 1 : 3.28084
  )

  /** Conversion factor for weights */
  const weightFactor = computed(() =>
    unitSystem.value === 'metric' ? 1 : 2.20462
  )

  // ============================================
  // Actions
  // ============================================

  /**
   * Toggle unit system between metric and imperial.
   */
  function toggleUnitSystem() {
    unitSystem.value = unitSystem.value === 'metric' ? 'imperial' : 'metric'
  }

  /**
   * Set the unit system.
   */
  function setUnitSystem(system: UnitSystem) {
    unitSystem.value = system
  }

  /**
   * Set the view mode.
   */
  function setViewMode(mode: ViewMode) {
    viewMode.value = mode
  }

  /**
   * Toggle grid visibility.
   */
  function toggleGrid() {
    showGrid.value = !showGrid.value
  }

  /**
   * Toggle legend visibility.
   */
  function toggleLegend() {
    showLegend.value = !showLegend.value
  }

  /** Toggle SPL visualization (heatmap + legend). */
  function toggleSPL() {
    showSPL.value = !showSPL.value
  }

  /**
   * Toggle probe visibility.
   */
  function toggleProbe() {
    showProbe.value = !showProbe.value
  }

  /**
   * Toggle reflection warnings.
   */
  function toggleReflectionWarnings() {
    showReflectionWarnings.value = !showReflectionWarnings.value
  }

  /**
   * Toggle sidebar collapsed state.
   */
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  /**
   * Set SPL color scheme.
   */
  function setSPLColorScheme(scheme: 'thermal' | 'neon' | 'mono') {
    splColorScheme.value = scheme
  }

  /**
   * Convert a length from meters to current unit.
   */
  function formatLength(meters: number, precision: number = 1): string {
    const value = meters * lengthFactor.value
    return `${value.toFixed(precision)} ${lengthUnit.value}`
  }

  /**
   * Convert a weight from kg to current unit.
   */
  function formatWeight(kg: number, precision: number = 1): string {
    const value = kg * weightFactor.value
    return `${value.toFixed(precision)} ${weightUnit.value}`
  }

  /**
   * Reset all settings to defaults.
   */
  function resetToDefaults() {
    unitSystem.value = 'metric'
    viewMode.value = 'split'
    showGrid.value = true
    showLegend.value = true
    showSPL.value = false
    showProbe.value = true
    showReflectionWarnings.value = true
    canvasResolution.value = 1
    animationsEnabled.value = true
    sidebarCollapsed.value = false
    splColorScheme.value = 'neon'
  }

  // Persist settings to localStorage
  const STORAGE_KEY = 'sonicdraft-settings'

  function saveToStorage() {
    const settings = {
      unitSystem: unitSystem.value,
      viewMode: viewMode.value,
      showGrid: showGrid.value,
      showLegend: showLegend.value,
      showSPL: showSPL.value,
      showProbe: showProbe.value,
      showReflectionWarnings: showReflectionWarnings.value,
      canvasResolution: canvasResolution.value,
      animationsEnabled: animationsEnabled.value,
      splColorScheme: splColorScheme.value,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }

  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const settings = JSON.parse(stored)
        if (settings.unitSystem) unitSystem.value = settings.unitSystem
        if (settings.viewMode) viewMode.value = settings.viewMode
        if (settings.showGrid !== undefined) showGrid.value = settings.showGrid
        if (settings.showLegend !== undefined) showLegend.value = settings.showLegend
        if (settings.showSPL !== undefined) showSPL.value = settings.showSPL
        if (settings.showProbe !== undefined) showProbe.value = settings.showProbe
        if (settings.showReflectionWarnings !== undefined)
          showReflectionWarnings.value = settings.showReflectionWarnings
        if (settings.canvasResolution)
          canvasResolution.value = settings.canvasResolution
        if (settings.animationsEnabled !== undefined)
          animationsEnabled.value = settings.animationsEnabled
        if (settings.splColorScheme)
          splColorScheme.value = settings.splColorScheme
      }
    } catch (e) {
      console.warn('Failed to load settings from storage:', e)
    }
  }

  // Auto-save settings when they change
  watch(
    [
      unitSystem,
      viewMode,
      showGrid,
      showLegend,
      showProbe,
      showReflectionWarnings,
      canvasResolution,
      animationsEnabled,
      splColorScheme,
    ],
    () => {
      saveToStorage()
    },
    { deep: true }
  )

  // Load settings on initialization
  loadFromStorage()

  return {
    // State
    unitSystem,
    viewMode,
    showGrid,
    showLegend,
    showSPL,
    showProbe,
    showReflectionWarnings,
    canvasResolution,
    animationsEnabled,
    sidebarCollapsed,
    splColorScheme,

    // Getters
    lengthUnit,
    weightUnit,
    lengthFactor,
    weightFactor,

    // Actions
    toggleUnitSystem,
    setUnitSystem,
    setViewMode,
    toggleGrid,
    toggleLegend,
    toggleSPL,
    toggleProbe,
    toggleReflectionWarnings,
    toggleSidebar,
    setSPLColorScheme,
    formatLength,
    formatWeight,
    resetToDefaults,
    saveToStorage,
    loadFromStorage,
  }
})
