// This is a mock Supabase client for demonstration purposes.
// In a real application, you would use the official Supabase client.
import { db, Measurements } from './db';

// This mock client mimics the Supabase API.
export const supabase = {
  from: (tableName: string) => {
    if (tableName === 'users') {
      return {
        select: (_columns: string) => ({
          eq: (column: string, value: string) => {
            if (column === 'email') {
              const user = db.users.find(value);
              return { data: user ? [user] : null, error: null };
            }
            return { data: null, error: 'Not implemented' };
          }
        })
      };
    }
    if (tableName === 'measurements') {
      return {
        select: (_columns: string) => ({
          eq: (column: string, value: string) => {
            if (column === 'user_id') {
              const measurements = db.measurements.get(value);
              return { data: measurements ? [measurements] : null, error: null };
            }
            return { data: null, error: 'Not implemented' };
          }
        }),
        update: (newData: Measurements) => ({
          eq: (column: string, value: string) => {
            if (column === 'user_id') {
              db.measurements.update(value, newData);
              return { data: [newData], error: null };
            }
            return { data: null, error: 'Not implemented' };
          }
        })
      };
    }
    return {
        select: () => ({ eq: () => ({ data: null, error: 'Table not found' }) }),
        update: () => ({ eq: () => ({ data: null, error: 'Table not found' }) }),
    };
  }
};
