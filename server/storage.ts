import { db } from "./db";
import {
  telemetryLogs,
  type InsertLog,
  type TelemetryLog
} from "@shared/schema";

export interface IStorage {
  getLogs(): Promise<TelemetryLog[]>;
  createLog(log: InsertLog): Promise<TelemetryLog>;
}

export class DatabaseStorage implements IStorage {
  async getLogs(): Promise<TelemetryLog[]> {
    return await db.select().from(telemetryLogs);
  }

  async createLog(log: InsertLog): Promise<TelemetryLog> {
    const [inserted] = await db.insert(telemetryLogs)
      .values(log)
      .returning();
    return inserted;
  }
}

export const storage = new DatabaseStorage();
