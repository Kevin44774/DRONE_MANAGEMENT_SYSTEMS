import { pgTable, text, serial, integer, boolean, real, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Drone schema
export const drones = pgTable("drones", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  model: text("model").notNull(),
  serialNumber: text("serial_number").notNull().unique(),
  status: text("status", { enum: ['available', 'in-mission', 'maintenance', 'charging'] }).notNull().default('available'),
  batteryLevel: integer("battery_level").notNull().default(0),
  location: json("location").$type<{ lat: number; lng: number }>().notNull(),
  flightHours: real("flight_hours").notNull().default(0),
  lastMaintenance: text("last_maintenance").notNull(),
  maxFlightTime: integer("max_flight_time").notNull(),
  sensors: json("sensors").$type<string[]>().notNull(),
});

// Mission schema
export const missions = pgTable("missions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", { enum: ['facility-inspection', 'security-patrol', 'site-mapping', 'perimeter-survey'] }).notNull(),
  status: text("status", { enum: ['planned', 'in-progress', 'completed', 'aborted', 'paused'] }).notNull().default('planned'),
  droneId: text("drone_id").references(() => drones.id),
  area: json("area").$type<{
    name: string;
    bounds: Array<{ lat: number; lng: number }>;
  }>().notNull(),
  flightPath: json("flight_path").$type<Array<{ lat: number; lng: number; altitude: number }>>().notNull(),
  pattern: text("pattern", { enum: ['crosshatch', 'perimeter', 'grid', 'spiral', 'custom'] }).notNull(),
  parameters: json("parameters").$type<{
    altitude: number;
    speed: number;
    overlapPercentage: number;
    captureFrequency: number;
    sensors: string[];
  }>().notNull(),
  progress: integer("progress").notNull().default(0),
  estimatedDuration: integer("estimated_duration").notNull(),
  actualDuration: integer("actual_duration"),
  priority: text("priority", { enum: ['low', 'medium', 'high', 'emergency'] }).notNull().default('medium'),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  scheduledAt: timestamp("scheduled_at"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  stats: json("stats").$type<{
    distanceCovered: number;
    areasCovered: number;
    dataPointsCollected: number;
    averageSpeed?: number;
    batteryUsed?: number;
  }>(),
});

// Create insert schemas
export const insertDroneSchema = createInsertSchema(drones).omit({
  id: true,
});

export const insertMissionSchema = createInsertSchema(missions).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type InsertDrone = z.infer<typeof insertDroneSchema>;
export type Drone = typeof drones.$inferSelect;
export type InsertMission = z.infer<typeof insertMissionSchema>;
export type Mission = typeof missions.$inferSelect;

// Organization data type (not stored in DB, calculated)
export type Organization = {
  totalSurveys: number;
  totalFlightHours: number;
  activeDrones: number;
  completedMissions: number;
};
