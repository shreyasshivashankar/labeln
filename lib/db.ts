// A simple in-memory database for demonstration purposes.
// In a real application, you would use a proper database.

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  measurements?: Measurements;
}

export interface Measurements {
  bust: number;
  waist: number;
  hips: number;
  // Add more measurement fields as needed
}

const users: User[] = [
  { 
    id: '1', 
    email: 'user@example.com', 
    password: 'password', 
    name: 'Test User',
    measurements: {
      bust: 34,
      waist: 28,
      hips: 36,
    }
  },
];

// Functions to interact with the database
export const db = {
  users: {
    find: (email: string) => users.find(u => u.email === email),
    findById: (id: string) => users.find(u => u.id === id),
  },
  measurements: {
    get: (userId: string) => {
      const user = db.users.findById(userId);
      return user?.measurements || null;
    },
    update: (userId: string, newMeasurements: Measurements) => {
      const user = db.users.findById(userId);
      if (user) {
        user.measurements = newMeasurements;
      }
    }
  }
};
