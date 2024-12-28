import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  port: 5432,
  database: "taskmanager",
  password: "7476"
});

export const poolDB = pool;
