import { Pool } from "pg";

import {
  POSTGRES_USERNAME,
  POSTGRES_HOST,
  POSTGRES_DATABASE,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
} from '../env';

const pool = new Pool({
  user: POSTGRES_USERNAME,
  host: POSTGRES_HOST,
  database: POSTGRES_DATABASE,
  password: POSTGRES_PASSWORD,
  port: POSTGRES_PORT,
});

export default pool;
