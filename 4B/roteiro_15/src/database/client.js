// @file: src/database/client.js
import { Pool } from "pg";

const client = new Pool({
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "dw3_roteiro14",
});

export default client;
