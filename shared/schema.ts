import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const telemetryLogs = pgTable("telemetry_logs", {
  id: serial("id").primaryKey(),
  phase: text("phase").notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertLogSchema = createInsertSchema(telemetryLogs).omit({ id: true, timestamp: true });
export type TelemetryLog = typeof telemetryLogs.$inferSelect;
export type InsertLog = z.infer<typeof insertLogSchema>;
