import { Pool } from 'pg';

export const pool = new Pool({
  host: 'postgres',
  port: 5432,
  user: 'finance',
  password: 'finance',
  database: 'finance',
});
