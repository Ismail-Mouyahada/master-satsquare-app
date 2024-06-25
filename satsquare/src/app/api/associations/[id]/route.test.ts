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
  describe("PUT /api/associations/:id", () => {
    it("should update association with status 200", async () => {
      const requestObj = new NextRequest(
        "http://localhost/api/associations/1",
        {
          method: "PUT",
          body: JSON.stringify({
            nom: "Updated Association",
          }),
        }
      );

      const mockUpdatedAssociation = {
        id: 1,
        nom: "Updated Association",
        adresse_eclairage: "123 Street",
        valide: 1,
        est_confirme: true,
        logo_url: "http://example.com/logo.png",
        cree_le: new Date(),
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
        cree_le: mockUpdatedAssociation.cree_le.toISOString(),
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
        }
      );

      (prisma.association.update as jest.Mock).mockRejectedValue(
        new Error("Failed to update association")
      );

      const response = await PUT(requestObj, { params: { id: "1" } });
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toEqual(expect.any(String));
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
      expect(body.error).toEqual(expect.any(String));
    });
  });
});
