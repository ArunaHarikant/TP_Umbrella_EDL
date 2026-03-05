import { z } from "zod";
import { insertLogSchema, telemetryLogs } from "./schema";

export const api = {
  logs: {
    list: {
      method: "GET" as const,
      path: "/api/logs" as const,
      responses: {
        200: z.array(z.custom<typeof telemetryLogs.$inferSelect>()),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/logs" as const,
      input: insertLogSchema,
      responses: {
        201: z.custom<typeof telemetryLogs.$inferSelect>(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
