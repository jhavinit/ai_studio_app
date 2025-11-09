import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Generation } from "../entities/Generation";
import { appConfig } from "../configs/appConfig";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: appConfig.PG_HOST || "localhost",
  port: Number(appConfig.PG_PORT) || 5432,
  username: appConfig.PG_USER || "aistudio_user",
  password: appConfig.PG_PASSWORD || "aistudio_pass",
  database: appConfig.PG_DB || "aistudio_db",
  synchronize: true, // Auto-create tables (turn off in prod, use migrations instead)
  logging: false,
  entities: [User, Generation],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("✅ PostgreSQL connected via TypeORM");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};
