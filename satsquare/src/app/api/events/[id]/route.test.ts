/**
 * @jest-environment node
 */
import prisma from "@/db/prisma";
import { NextRequest } from "next/server";
import "whatwg-fetch";
import { DELETE, PUT } from "./route";

jest.mock("@/db/prisma", () => ({
  __esModule: true,
  default: {
    evenement: {
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("API Routes: Evenements", () => {
  describe("PUT /api/evenements/:id", () => {
    it("should update event with status 200", async () => {
      const requestData = {
        nom: "Updated Event",
        description: "Updated description",
        est_public: true,
        est_gratuit: false,
        commence_a: "2023-07-01T10:00:00.000Z",
        termine_a: "2023-07-01T12:00:00.000Z",
        sat_minimum: 20,
        recompense_joueurs: 150,
        don_association: 75,
        don_plateforme: 30,
      };

      const requestObj = new NextRequest("http://localhost/api/evenements/1", {
        method: "PUT",
        body: JSON.stringify(requestData),
      });

      const mockUpdatedEvent = {
        id: 1,
        ...requestData,
        commence_a: new Date(requestData.commence_a),
        termine_a: new Date(requestData.termine_a),
        cree_le: new Date(),
        mis_a_jour_le: new Date(),
      };

      (prisma.evenement.update as jest.Mock).mockResolvedValue(
        mockUpdatedEvent
      );

      const response = await PUT(requestObj, { params: { id: "1" } });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual({
        ...mockUpdatedEvent,
        commence_a: mockUpdatedEvent.commence_a.toISOString(),
        termine_a: mockUpdatedEvent.termine_a.toISOString(),
        cree_le: mockUpdatedEvent.cree_le.toISOString(),
        mis_a_jour_le: mockUpdatedEvent.mis_a_jour_le.toISOString(),
      });
      expect(prisma.evenement.update).toHaveBeenCalledTimes(1);
    });

    it("should return status 500 when prisma query rejects", async () => {
      const requestData = {
        nom: "Updated Event",
        description: "Updated description",
      };

      const requestObj = new NextRequest("http://localhost/api/evenements/1", {
        method: "PUT",
        body: JSON.stringify(requestData),
      });

      (prisma.evenement.update as jest.Mock).mockRejectedValue(
        new Error("Failed to update event")
      );

      const response = await PUT(requestObj, { params: { id: "1" } });
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toEqual(expect.any(String));
    });
  });

  describe("DELETE /api/evenements/:id", () => {
    it("should delete event with status 200", async () => {
      const requestObj = new NextRequest("http://localhost/api/evenements/1", {
        method: "DELETE",
      });

      (prisma.evenement.delete as jest.Mock).mockResolvedValue({});

      const response = await DELETE(requestObj, { params: { id: "1" } });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.message).toEqual("Event deleted successfully");
      expect(prisma.evenement.delete).toHaveBeenCalledTimes(1);
    });

    it("should return status 500 when prisma query rejects", async () => {
      const requestObj = new NextRequest("http://localhost/api/evenements/1", {
        method: "DELETE",
      });

      (prisma.evenement.delete as jest.Mock).mockRejectedValue(
        new Error("Failed to delete event")
      );

      const response = await DELETE(requestObj, { params: { id: "1" } });
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toEqual(expect.any(String));
    });
  });
});
