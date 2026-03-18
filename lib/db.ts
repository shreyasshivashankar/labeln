// In-memory database for development. In production, use Supabase (see supabase/migrations/).

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  shopify_customer_id?: string | null;
  measurements?: Measurements;
}

export interface Measurements {
  // Upper body
  bust?: number;
  waist?: number;
  hips?: number;
  shoulder?: number;
  sleeveLength?: number;
  // Lower body
  height?: number;
  inseam?: number;
  // Garment-specific lengths
  blouseLength?: number;
  lehenggaLength?: number;
  anarkaliLength?: number;
  // Freeform notes set by team
  notes?: string;
}

const users: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password',
    name: 'Test User',
    shopify_customer_id: null,
    measurements: {
      bust: 34,
      waist: 28,
      hips: 36,
      shoulder: 14,
      sleeveLength: 24,
      height: 64,
      blouseLength: 15,
    },
  },
];

export const db = {
  users: {
    find: (email: string) => users.find((u) => u.email === email),
    findById: (id: string) => users.find((u) => u.id === id),
  },
  measurements: {
    get: (userId: string) => {
      const user = db.users.findById(userId);
      return user?.measurements ?? null;
    },
    update: (userId: string, newMeasurements: Measurements) => {
      const user = db.users.findById(userId);
      if (user) {
        user.measurements = newMeasurements;
      }
    },
  },
};
