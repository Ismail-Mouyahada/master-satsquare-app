/**
 * @jest-environment node
 */
import prisma from "@/db/prisma";
import { NextRequest } from "next/server";
import { DELETE, PUT } from "./route";
import "whatwg-fetch";

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
      };

      const requestObj = new NextRequest("http://localhost/api/evenements/1", {
        method: "PUT",
        body: JSON.stringify(requestData),
      });

      const mockUpdatedEvent = {
        id: 1,
        ...requestData,
        commence_a: new Date(),
        termine_a: new Date(),
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
      });
    });

    it("should return status 500 when prisma query rejects", async () => {
      (prisma.evenement.update as jest.Mock).mockRejectedValue(
        new Error("Failed to update event")
      );

      const requestObj = new NextRequest("http://localhost/api/evenements/1", {
        method: "PUT",
        body: JSON.stringify({ nom: "Updated Event" }),
      });

      const response = await PUT(requestObj, { params: { id: "1" } });
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toEqual("An error occurred while updating the event");
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
    });

    it("should return status 500 when prisma query rejects", async () => {
      (prisma.evenement.delete as jest.Mock).mockRejectedValue(
        new Error("Failed to delete event")
      );

      const requestObj = new NextRequest("http://localhost/api/evenements/1", {
        method: "DELETE",
      });

      const response = await DELETE(requestObj, { params: { id: "1" } });
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toEqual("An error occurred while deleting the event");
    });
  });
});
