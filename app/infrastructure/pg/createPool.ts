import pg from "pg";
const { Pool } = pg;
let _pool: InstanceType<typeof Pool> | null = null;
function createPool() {
  const connectionString = process.env.DATABASE_URL;
  const useSSL = process.env.DATABASE_USE_SSL || true;
  return new Pool({
    connectionString,
    ssl: useSSL ? { rejectUnauthorized: false } : false,
  });
}
// reusable pool
export function getPool() {
  if (!_pool) {
    _pool = createPool();
  }
  return _pool;
}
