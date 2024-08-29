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
    association: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("API Routes: Associations", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("PUT /api/associations/:id", () => {
    it("should update association with status 200", async () => {
      const requestObj = new NextRequest(
        "http://localhost/api/associations/1",
        {
          method: "PUT",
          body: JSON.stringify({
            nom: "Updated Association",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const mockUpdatedAssociation = {
        id: 1,
        nom: "Updated Association",
        adresseEclairage: "123 Street",
        valide: 1,
        estConfirme: true,
        logo_url: "http://example.com/logo.png",
        creeLe: new Date(),
        mis_a_jour_le: new Date(),
      };

      (prisma.association.update as jest.Mock).mockResolvedValue(
        mockUpdatedAssociation
      );

      const response = await PUT(requestObj, { params: { id: "1" } });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual({
        ...mockUpdatedAssociation,
        creeLe: mockUpdatedAssociation.creeLe.toISOString(),
        mis_a_jour_le: mockUpdatedAssociation.mis_a_jour_le.toISOString(),
      });
      expect(prisma.association.update).toHaveBeenCalledTimes(1);
    });

    it("should return status 500 when prisma query rejects", async () => {
      const requestObj = new NextRequest(
        "http://localhost/api/associations/1",
        {
          method: "PUT",
          body: JSON.stringify({
            nom: "Updated Association",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      (prisma.association.update as jest.Mock).mockRejectedValue(
        new Error("Failed to update association")
      );

      const response = await PUT(requestObj, { params: { id: "1" } });
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toEqual(
        "An error occurred while updating the association"
      );
    });
  });

  describe("DELETE /api/associations/:id", () => {
    it("should delete association with status 200", async () => {
      const requestObj = new NextRequest(
        "http://localhost/api/associations/1",
        {
          method: "DELETE",
        }
      );

      (prisma.association.delete as jest.Mock).mockResolvedValue({});

      const response = await DELETE(requestObj, { params: { id: "1" } });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.message).toEqual("Association deleted successfully");
      expect(prisma.association.delete).toHaveBeenCalledTimes(1);
    });

    it("should return status 500 when prisma query rejects", async () => {
      const requestObj = new NextRequest(
        "http://localhost/api/associations/1",
        {
          method: "DELETE",
        }
      );

      (prisma.association.delete as jest.Mock).mockRejectedValue(
        new Error("Failed to delete association")
      );

      const response = await DELETE(requestObj, { params: { id: "1" } });
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toEqual(
        "An error occurred while deleting the association"
      );
    });
  });
});
