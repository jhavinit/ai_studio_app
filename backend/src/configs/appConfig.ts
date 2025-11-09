import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

export const appConfig = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,

  JWT_SECRET: process.env.JWT_SECRET,

  PG_HOST: process.env.PG_HOST,
  PG_PORT: process.env.PG_PORT,
  PG_USER: process.env.PG_USER,
  PG_PASSWORD: process.env.PG_PASSWORD,
  PG_DB: process.env.PG_DB,

  DB_TYPE: process.env.DB_TYPE,
  UPLOADS_DIR: process.env.UPLOADS_DIR,
};
