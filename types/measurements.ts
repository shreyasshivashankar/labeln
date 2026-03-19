/** A single measurement record from the DB */
export interface MeasurementRecord {
  id: string;
  customer_email: string;
  customer_name: string;
  /** Pre-defined measurement values keyed by field key, all in inches */
  values: Record<string, number>;
  /** Custom measurements added by Label N team (dress-type specific) */
  custom_fields: CustomField[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/** A custom measurement field defined per client/dress type */
export interface CustomField {
  key: string;
  label: string;
  value: number | null;
}
