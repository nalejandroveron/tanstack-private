import 'dotenv/config';
import { type } from 'arktype';

const envSchema = type({
  DATABASE_URL: type.string.atLeastLength(1),
  BETTER_AUTH_URL: type.string.atLeastLength(1),
  BETTER_AUTH_SECRET: type.string.atLeastLength(1),
});

const out = envSchema(process.env);

if (out instanceof type.errors)
  throw new Error(`Invalid environment variables schema: ${out.summary}`);

export const env = out;
