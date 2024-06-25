/**
 * @jest-environment node
 */
import prisma from "@/db/prisma";
import { NextRequest } from "next/server";
import "whatwg-fetch";
import { POST } from "./route";

jest.mock("@/db/prisma", () => ({
  __esModule: true,
  default: {
    evenement: {
      create: jest.fn(),
    },
  },
}));

describe("API Routes: Evenements", () => {
  describe("POST /api/evenements", () => {
    it("should create a new event with status 201", async () => {
      const requestData = {
        nom: "New Event",
        description: "This is a new event",
        est_public: "public",
        participation: "free",
        commence_a: "2023-07-01T10:00:00.000Z",
        termine_a: "2023-07-01T12:00:00.000Z",
        sat_minimum: 10,
        recompense_joueurs: 100,
        don_association: 50,
        don_plateforme: 20,
        quizzes: ["1", "2"],
      };

      const requestObj = new NextRequest("http://localhost/api/evenements", {
        method: "POST",
        body: JSON.stringify(requestData),
      });

      const mockNewEvent = {
        id: 1,
        ...requestData,
        est_public: true,
        est_gratuit: true,
        commence_a: new Date(requestData.commence_a),
        termine_a: new Date(requestData.termine_a),
        EvenementsQuiz: [{ id: 1 }, { id: 2 }],
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
        est_public: "public",
        participation: "free",
        commence_a: "2023-07-01T10:00:00.000Z",
        termine_a: "2023-07-01T12:00:00.000Z",
        sat_minimum: 10,
        recompense_joueurs: 100,
        don_association: 50,
        don_plateforme: 20,
        quizzes: ["1", "2"],
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
