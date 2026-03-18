// Mock Supabase client for development. Wire up the real client when SUPABASE_URL is set.
import { db, type Measurements } from './db';

type Ok<T> = { data: T; error: null };
type Err = { data: null; error: string };
type Result<T> = Ok<T> | Err;

function ok<T>(data: T): Ok<T> {
  return { data, error: null };
}
function err(message: string): Err {
  return { data: null, error: message };
}

export const supabase = {
  from: (tableName: string) => {
    if (tableName === 'users') {
      return {
        select: (_columns: string) => ({
          eq: (column: string, value: string) => {
            if (column === 'email') {
              const user = db.users.find(value);
              const arr = user ? [user] : [];
              return {
                ...ok(arr.length > 0 ? arr : null),
                single(): Result<(typeof arr)[number]> {
                  return user ? ok(user) : err('Not found');
                },
              };
            }
            return {
              ...err('Not implemented'),
              single: () => err('Not implemented'),
            };
          },
        }),
      };
    }

    if (tableName === 'measurements') {
      return {
        select: (_columns: string) => ({
          eq: (column: string, value: string) => {
            if (column === 'user_id') {
              const m = db.measurements.get(value);
              return {
                ...ok(m ? [m] : null),
                single(): Result<Measurements> {
                  return m ? ok(m) : err('Not found');
                },
              };
            }
            return {
              ...err('Not implemented'),
              single: () => err('Not implemented'),
            };
          },
        }),
        update: (newData: Measurements) => ({
          eq: (column: string, value: string) => {
            if (column === 'user_id') {
              db.measurements.update(value, newData);
              return ok([newData]);
            }
            return err('Not implemented');
          },
        }),
      };
    }

    return {
      select: () => ({
        eq: () => ({ ...err('Table not found'), single: () => err('Table not found') }),
      }),
      update: () => ({ eq: () => err('Table not found') }),
    };
  },
};
