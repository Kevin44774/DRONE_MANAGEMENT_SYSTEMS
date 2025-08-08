import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDroneSchema, insertMissionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Drone routes
  app.get("/api/drones", async (req, res) => {
    try {
      const drones = await storage.getDrones();
      res.json(drones);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch drones" });
    }
  });

  app.get("/api/drones/:id", async (req, res) => {
    try {
      const drone = await storage.getDrone(req.params.id);
      if (!drone) {
        return res.status(404).json({ message: "Drone not found" });
      }
      res.json(drone);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch drone" });
    }
  });

  app.post("/api/drones", async (req, res) => {
    try {
      const validatedData = insertDroneSchema.parse(req.body);
      const drone = await storage.createDrone(validatedData);
      res.status(201).json(drone);
    } catch (error) {
      res.status(400).json({ message: "Invalid drone data" });
    }
  });

  app.patch("/api/drones/:id", async (req, res) => {
    try {
      const drone = await storage.updateDrone(req.params.id, req.body);
      if (!drone) {
        return res.status(404).json({ message: "Drone not found" });
      }
      res.json(drone);
    } catch (error) {
      res.status(500).json({ message: "Failed to update drone" });
    }
  });

  app.delete("/api/drones/:id", async (req, res) => {
    try {
      const success = await storage.deleteDrone(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Drone not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete drone" });
    }
  });

  // Mission routes
  app.get("/api/missions", async (req, res) => {
    try {
      const missions = await storage.getMissions();
      res.json(missions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch missions" });
    }
  });

  app.get("/api/missions/:id", async (req, res) => {
    try {
      const mission = await storage.getMission(req.params.id);
      if (!mission) {
        return res.status(404).json({ message: "Mission not found" });
      }
      res.json(mission);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mission" });
    }
  });

  app.post("/api/missions", async (req, res) => {
    try {
      const validatedData = insertMissionSchema.parse(req.body);
      const mission = await storage.createMission(validatedData);
      res.status(201).json(mission);
    } catch (error) {
      res.status(400).json({ message: "Invalid mission data" });
    }
  });

  app.patch("/api/missions/:id", async (req, res) => {
    try {
      const mission = await storage.updateMission(req.params.id, req.body);
      if (!mission) {
        return res.status(404).json({ message: "Mission not found" });
      }
      res.json(mission);
    } catch (error) {
      res.status(500).json({ message: "Failed to update mission" });
    }
  });

  app.delete("/api/missions/:id", async (req, res) => {
    try {
      const success = await storage.deleteMission(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Mission not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete mission" });
    }
  });

  // Organization stats route
  app.get("/api/organization/stats", async (req, res) => {
    try {
      const stats = await storage.getOrganizationStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch organization stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
