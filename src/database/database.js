import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const configDatabase = {
  connectionString: process.env.DATABASE_URL,
};

try {
  export const db = await new Pool(configDatabase);
} catch (err) {
  console.error("Error connecting to database:", err);
  process.exit(1);
}
