/** Workflow status for a custom order */
export type MeasurementStatus =
  | 'pending_measurement'
  | 'measurement_scheduled'
  | 'measured'
  | 'in_production'
  | 'ready_to_ship'
  | 'expired';

export const STATUS_LABELS: Record<MeasurementStatus, string> = {
  pending_measurement: 'Pending Measurement',
  measurement_scheduled: 'Measurement Scheduled',
  measured: 'Measured',
  in_production: 'In Production',
  ready_to_ship: 'Ready to Ship',
  expired: 'Expired',
};

/** Ordered list for the active status workflow (expired is separate) */
export const STATUS_FLOW: MeasurementStatus[] = [
  'pending_measurement',
  'measurement_scheduled',
  'measured',
  'in_production',
  'ready_to_ship',
];

/** A measurement record tied to a Shopify order */
export interface MeasurementRecord {
  id: string;
  /** Shopify order GID (e.g. gid://shopify/Order/123) */
  shopify_order_id: string;
  /** Human-readable order number (e.g. #1001) */
  order_number: string;
  customer_email: string;
  customer_name: string;
  status: MeasurementStatus;
  /** When the measurement session is scheduled */
  scheduled_date: string | null;
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
