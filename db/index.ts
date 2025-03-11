import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '../env';
import * as auth from './authSchema';

export const db = drizzle(env.DATABASE_URL, {
  schema: {
    ...auth,
  },
});
