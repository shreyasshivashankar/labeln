/**
 * Pre-defined measurement tabs and fields.
 * Label N team can add/remove fields here — the DB schema (JSONB) accommodates any key.
 * All values are stored in inches.
 */

export interface MeasurementField {
  key: string;
  label: string;
}

export interface MeasurementTab {
  id: string;
  label: string;
  fields: MeasurementField[];
}

/** Pre-defined measurement tabs shown on the profile page */
export const MEASUREMENT_TABS: MeasurementTab[] = [
  {
    id: 'upper_body',
    label: 'Upper Body',
    fields: [
      { key: 'bust', label: 'Bust / Chest' },
      { key: 'waist', label: 'Waist' },
      { key: 'hips', label: 'Hips' },
      { key: 'shoulder', label: 'Shoulder Width' },
      { key: 'sleeve_length', label: 'Sleeve Length' },
      { key: 'arm_circumference', label: 'Arm Circumference' },
      { key: 'neck', label: 'Neck' },
    ],
  },
  {
    id: 'lower_body',
    label: 'Lower Body',
    fields: [
      { key: 'height', label: 'Height' },
      { key: 'inseam', label: 'Inseam' },
      { key: 'outseam', label: 'Outseam' },
      { key: 'thigh', label: 'Thigh' },
      { key: 'calf', label: 'Calf' },
    ],
  },
  {
    id: 'garment_lengths',
    label: 'Garment Lengths',
    fields: [
      { key: 'blouse_length', label: 'Blouse Length' },
      { key: 'lehengga_length', label: 'Lehengga Length' },
      { key: 'anarkali_length', label: 'Anarkali / Suit Length' },
      { key: 'saree_blouse_length', label: 'Saree Blouse Length' },
      { key: 'kurta_length', label: 'Kurta Length' },
      { key: 'sharara_length', label: 'Sharara Length' },
    ],
  },
];

/** All pre-defined keys (for validation / filtering) */
export const PREDEFINED_KEYS = new Set(
  MEASUREMENT_TABS.flatMap((tab) => tab.fields.map((f) => f.key))
);

/** The unit used for all measurements */
export const MEASUREMENT_UNIT = 'in' as const;
