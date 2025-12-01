# Speaker Database (Brand‑based)

Welcome! This folder contains the curated list of speaker models used by SonicDraft. To make editing easy for both developers and non‑coders, the database is split into one simple file per brand in `./brands/`. The app automatically combines those files into a single database.

What you edit most of the time:
- Edit a brand file in `./brands/` (for example `jbl.ts`, `meyer.ts`, `rcf.ts`).
- Each file exports a simple array of models. You can add, remove, or tweak items in that array.


## How the database works

- Each brand file exports a default array of items using the same fields: `id`, `brand`, `model`, `type`, `specs`, `pricing`, `meta`, `compatibleSubs`, and array flags.
- The file `database.ts` is an aggregator. It imports all brand arrays and concatenates them into the single `speakerDatabase` that the rest of the app uses.
- Types live in `types.ts` and keep the data consistent. If unsure about a field, copy an existing item and edit only the values you understand.


## Edit a brand file (non‑coders welcome)

1) Open a brand file under `./brands/`, for example `./brands/jbl.ts`.
2) Find the array named after the brand (e.g. `const jbl = [ ... ]`).
3) Copy an existing item, paste it below, and edit these fields:
   - `id`: a unique machine‑readable id like `brand-model-name` (lowercase, dashes)
   - `brand`: the brand name as shown on the website
   - `model`: the product model name (e.g. “SRX910LA”)
   - `type`: one of `SpeakerType.LineArray`, `SpeakerType.PointSource`, `SpeakerType.Column`, or `SpeakerType.Subwoofer`
   - `specs`:
     - `horzDispersion` (degrees)
     - `vertDispersion` (degrees)
     - `maxSPL` (dB @1m)
     - `couplingCoefficient` (0–1; line arrays/columns usually 0.85–0.98)
     - `frequencyRange.low` and `frequencyRange.high` (Hz)
     - `impedance` (ohms; use 0 for self‑powered/active)
     - `powerHandling` (watts; program/nominal)
   - `pricing`:
     - `perUnit` (price per speaker)
     - `perSub` (price per matching sub; 0 if N/A)
     - `currency` (e.g. "USD")
   - `meta`:
     - `description` (short plain sentence)
     - `weight` (kg)
     - `dimensions` (mm: width, height, depth)
     - `link` (official product page)
   - `compatibleSubs`: array of subwoofer ids that pair well with this speaker
   - `arrayable` and `maxArraySize` for line arrays/sub arrays

That’s it. Save the file. The app will pick it up automatically.


## Add a new brand

1) Duplicate any file in `./brands/` (for example copy `jbl.ts` to `newbrand.ts`).
2) Rename the `const` name and the exported default to match the file (e.g. `const newbrand = [...]` then `export default newbrand`).
3) Fill the array with your models.
4) Developer step (one line): open `./database.ts` and import your new brand file, then add it to the combined array.


## Gotchas and tips

- If a `compatibleSubs` id doesn’t exist in the database, it’s okay — the app will skip unknown ids gracefully.
- Use official datasheets for specs. If a number is unclear, leave it as is or add a TODO comment.
- Keep descriptions short and neutral.


## AI deep‑research prompt example

Use this prompt with your favorite AI (ChatGPT, Claude, etc.) to find and format models from a specific brand. Replace the placeholders in ALL CAPS.

```
You are an expert pro‑audio research assistant helping maintain a speaker database.

Goal: Find CURRENTLY AVAILABLE speaker models from BRAND_NAME (optionally: within SERIES_OR_FAMILY) suitable for live sound reinforcement.

Instructions:
1) Use only authoritative sources: the brand’s official website, current datasheets, and trusted pro‑audio references. Avoid outdated brochures.
2) For each model, provide: model name, type (line_array | point_source | column | subwoofer), horizontal/vertical dispersion (deg), max SPL (dB @1m), frequency range (Hz, low–high), nominal impedance (ohms, use 0 if self‑powered), program/nominal power handling (W), typical compatible subs (if any), weight (kg), dimensions (mm W×H×D), street/MSRP price in CURRENCY (if available), and the official product page link.
3) Verify numbers against official datasheets where possible (note any assumptions as comments).
4) Output ONLY valid JSON in this exact shape (no markdown, no code fences):
{
  "brand": "BRAND_NAME",
  "models": [
    {
      "id": "kebab-case-unique-id",
      "model": "MODEL_NAME",
      "type": "line_array | point_source | column | subwoofer",
      "specs": {
        "horzDispersion": NUMBER,
        "vertDispersion": NUMBER,
        "maxSPL": NUMBER,
        "couplingCoefficient": NUMBER_BETWEEN_0_AND_1,
        "frequencyRange": { "low": NUMBER, "high": NUMBER },
        "impedance": NUMBER,
        "powerHandling": NUMBER
      },
      "pricing": { "perUnit": NUMBER, "perSub": NUMBER, "currency": "CURRENCY" },
      "meta": {
        "description": "SHORT SENTENCE",
        "weight": NUMBER,
        "dimensions": { "width": NUMBER, "height": NUMBER, "depth": NUMBER },
        "link": "OFFICIAL_URL"
      },
      "compatibleSubs": ["optional-sub-id-1", "optional-sub-id-2"],
      "arrayable": BOOLEAN,
      "maxArraySize": NUMBER
    }
  ],
  "notes": ["Any brief assumptions/verification notes"]
}

Constraints & best practices:
- Prefer current models; exclude discontinued ones unless explicitly requested.
- If dispersion varies (e.g., variable horns or Panflex), choose the typical default and note variations in "notes".
- If price is unknown, set perUnit to null and explain in "notes".
- Keep descriptions vendor‑neutral.

Examples:
- BRAND_NAME: "RCF"; SERIES_OR_FAMILY: "HDL"; CURRENCY: "USD".
```


## Need help?

- Non‑coders: just edit the brand file you need. If you want to add a brand, ask a developer to add a one‑line import in `database.ts`.
- Developers: keep the types in `types.ts` the single source of truth.
