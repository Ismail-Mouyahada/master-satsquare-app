/**
 * @jest-environment node
 */
import prisma from "@/db/prisma";
import { NextRequest } from "next/server";
import "whatwg-fetch";
import { GET, POST } from "./route";

jest.mock("@/db/prisma", () => ({
  __esModule: true,
  default: {
    evenement: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe("API Routes: Evenements", () => {
  describe("GET /api/evenements", () => {
    it("should return all events with status 200", async () => {
      const mockEvents = [
        {
          id: 1,
          nom: "Event 1",
          description: "Description 1",
          est_public: true,
          est_gratuit: true,
          commence_a: new Date(),
          termine_a: new Date(),
          sat_minimum: 10,
          recompense_joueurs: 100,
          don_association: 50,
          don_plateforme: 20,
          cree_le: new Date(),
          mis_a_jour_le: new Date(),
        },
      ];

      (prisma.evenement.findMany as jest.Mock).mockResolvedValue(mockEvents);

      const requestObj = new NextRequest("http://localhost/api/evenements");
      const response = await GET(requestObj);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(
        mockEvents.map((event) => ({
          ...event,
          commence_a: event.commence_a.toISOString(),
          termine_a: event.termine_a.toISOString(),
          cree_le: event.cree_le.toISOString(),
          mis_a_jour_le: event.mis_a_jour_le.toISOString(),
        }))
      );
    });

    it("should return events by name with status 200", async () => {
      const mockEvents = [
        {
          id: 1,
          nom: "Test Event",
          description: "Description 1",
          est_public: true,
          est_gratuit: true,
          commence_a: new Date(),
          termine_a: new Date(),
          sat_minimum: 10,
          recompense_joueurs: 100,
          don_association: 50,
          don_plateforme: 20,
          cree_le: new Date(),
          mis_a_jour_le: new Date(),
        },
      ];

      (prisma.evenement.findMany as jest.Mock).mockResolvedValue(mockEvents);

      const requestObj = new NextRequest(
        "http://localhost/api/evenements?name=Test"
      );
      const response = await GET(requestObj);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(
        mockEvents.map((event) => ({
          ...event,
          commence_a: event.commence_a.toISOString(),
          termine_a: event.termine_a.toISOString(),
          cree_le: event.cree_le.toISOString(),
          mis_a_jour_le: event.mis_a_jour_le.toISOString(),
        }))
      );
    });

    it("should return status 500 when prisma query rejects", async () => {
      (prisma.evenement.findMany as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const requestObj = new NextRequest("http://localhost/api/evenements");
      const response = await GET(requestObj);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toEqual(expect.any(String));
    });
  });

  describe("POST /api/evenements", () => {
    it("should create a new event with status 201", async () => {
      const requestData = {
        nom: "New Event",
        description: "This is a new event",
        est_public: true,
        est_gratuit: true,
        commence_a: "2023-07-01T10:00:00.000Z",
        termine_a: "2023-07-01T12:00:00.000Z",
        sat_minimum: 10,
        recompense_joueurs: 100,
        don_association: 50,
        don_plateforme: 20,
      };

      const requestObj = new NextRequest("http://localhost/api/evenements", {
        method: "POST",
        body: JSON.stringify(requestData),
      });

      const mockNewEvent = {
        id: 1,
        ...requestData,
        commence_a: new Date(requestData.commence_a),
        termine_a: new Date(requestData.termine_a),
        cree_le: new Date(),
        mis_a_jour_le: new Date(),
      };

      (prisma.evenement.create as jest.Mock).mockResolvedValue(mockNewEvent);

      const response = await POST(requestObj);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body).toEqual({
        ...mockNewEvent,
        commence_a: mockNewEvent.commence_a.toISOString(),
        termine_a: mockNewEvent.termine_a.toISOString(),
        cree_le: mockNewEvent.cree_le.toISOString(),
        mis_a_jour_le: mockNewEvent.mis_a_jour_le.toISOString(),
      });
      expect(prisma.evenement.create).toHaveBeenCalledTimes(1);
    });

    it("should return status 400 when no body is received", async () => {
      const requestObj = new NextRequest("http://localhost/api/evenements", {
        method: "POST",
      });

      const response = await POST(requestObj);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toEqual("No body received.");
      expect(prisma.evenement.create).not.toHaveBeenCalled();
    });

    it("should return status 500 when prisma query rejects", async () => {
      const requestData = {
        nom: "New Event",
        description: "This is a new event",
        est_public: true,
        est_gratuit: true,
        commence_a: "2023-07-01T10:00:00.000Z",
        termine_a: "2023-07-01T12:00:00.000Z",
        sat_minimum: 10,
        recompense_joueurs: 100,
        don_association: 50,
        don_plateforme: 20,
      };

      const requestObj = new NextRequest("http://localhost/api/evenements", {
        method: "POST",
        body: JSON.stringify(requestData),
      });

      (prisma.evenement.create as jest.Mock).mockRejectedValue(
        new Error("Failed to create event")
      );

      const response = await POST(requestObj);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toEqual(expect.any(String));
    });
  });
});
