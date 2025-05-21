import { z } from 'zod';

/**
 * Runtime schema – validates & TYPEs all env-vars.
 * Use .coerce.* to convert strings → numbers/booleans.
 * Give safe defaults where local dev needs them.
 */
export const EnvSchema = z.object({
  /** Node / process */
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.coerce.number().int().positive().default(3000),

  /** Public-facing URL (sent to Shopify & rendered in <script>) */
  PUBLIC_APP_URL: z.string().url(),
  PUBLIC_APP_NAME: z.string().min(2).max(100),

  /** Shopify credentials */
  SHOPIFY_API_KEY: z.string().min(1),
  SHOPIFY_API_SECRET: z.string().min(1),
  SHOPIFY_API_SCOPES: z.string().min(1),                 // comma-separated list
  SHOPIFY_API_VERSION: z.string().regex(/^\d{4}-\d{2}$/), // e.g. 2024-10

  /** Postgres */
  DATABASE_URL: z.string().url(),
  PGSSLMODE: z
    .enum(['disable', 'allow', 'prefer', 'require', 'verify-ca', 'verify-full', 'no-verify'])
    .optional()
    .default('disable'),
  DATABASE_USE_SSL: z.coerce.boolean().default(false),

  /** Sessions / cookies */
  SESSION_SECRET: z.string().min(32),                     // at least 32 chars
  COOKIE_SECURE: z.coerce.boolean().default(false),

  /** Observability */
  BUGSNAG_KEY: z.string().optional(),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error']).default('info'),
});

/**
 * Parse once – crash early if anything is missing or malformed.
 */
const _env = EnvSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:\n', _env.error.format());
  throw new Error('Invalid environment variables. See log above 👆');
}

export const env = _env.data;

/**
 * Sub-set that is **safe for the client bundle**.
 * Only export keys that start with PUBLIC_ (and anything else you *explicitly* allow).
 */
export const publicEnv = {
  PUBLIC_APP_NAME: env.PUBLIC_APP_NAME,
  PUBLIC_APP_URL: env.PUBLIC_APP_URL,
  SHOPIFY_API_KEY: env.SHOPIFY_API_KEY,   // Shopify App Bridge needs this in the browser
};
