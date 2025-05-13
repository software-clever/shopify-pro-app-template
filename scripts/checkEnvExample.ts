// scripts/check-env-example.ts
import { EnvSchema } from '../app/env.server';
import * as fs from 'node:fs';

const schemaKeys = Object.keys(EnvSchema.shape);
const exampleKeys = fs
  .readFileSync('.env.example', 'utf8')
  .split('\n')
  .map((l) => l.split('=')[0].trim())
  .filter(Boolean);            // drop blanks & comments

const missing = schemaKeys.filter((k) => !exampleKeys.includes(k));
if (missing.length) {
  console.error(`⚠️  .env.example is missing: ${missing.join(', ')}`);
  process.exit(1);
}
