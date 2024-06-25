/**
 * @jest-environment node
 */
import { GET, POST } from "@/app/api/associations/route";
import prisma from "@/db/prisma";
import { NextRequest } from "next/server";
import "whatwg-fetch";

jest.mock("@/db/prisma", () => ({
  __esModule: true,
  default: {
    association: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe("API Routes: Associations", () => {
  describe("GET /api/associations", () => {
    it("should return all associations with status 200", async () => {
      const mockAssociations = [
        {
          id: 1,
          nom: "Association 1",
          adresse_eclairage: "123 Street",
          valide: 1,
          est_confirme: true,
          logo_url: "http://example.com/logo.png",
          cree_le: new Date(),
          mis_a_jour_le: new Date(),
        },
      ];

      (prisma.association.findMany as jest.Mock).mockResolvedValue(
        mockAssociations
      );

      const requestObj = new NextRequest("http://localhost/api/associations");
      const response = await GET(requestObj);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(
        mockAssociations.map((association) => ({
          ...association,
          cree_le: association.cree_le.toISOString(),
          mis_a_jour_le: association.mis_a_jour_le.toISOString(),
        }))
      );
    });

    it("should return associations by name with status 200", async () => {
      const mockAssociations = [
        {
          id: 1,
          nom: "Test Association",
          adresse_eclairage: "123 Street",
          valide: 1,
          est_confirme: true,
          logo_url: "http://example.com/logo.png",
          cree_le: new Date(),
          mis_a_jour_le: new Date(),
        },
      ];

      (prisma.association.findMany as jest.Mock).mockResolvedValue(
        mockAssociations
      );

      const requestObj = new NextRequest(
        "http://localhost/api/associations?name=Test"
      );
      const response = await GET(requestObj);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(
        mockAssociations.map((association) => ({
          ...association,
          cree_le: association.cree_le.toISOString(),
          mis_a_jour_le: association.mis_a_jour_le.toISOString(),
        }))
      );
    });

    it("should return status 500 when prisma query rejects", async () => {
      (prisma.association.findMany as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const requestObj = new NextRequest("http://localhost/api/associations");
      const response = await GET(requestObj);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toEqual(expect.any(String));
    });
  });

  describe("POST /api/associations", () => {
    it("should return added data with status 201", async () => {
      const requestObj = new NextRequest("http://localhost/api/associations", {
        method: "POST",
        body: JSON.stringify({
          nom: "Association Test",
          adresse_eclairage: "123 Test Street",
          valide: 1,
          est_confirme: true,
          logo_url: "http://example.com/logo.png",
        }),
      });

      const mockAssociation = {
        id: 1,
        nom: "Association Test",
        adresse_eclairage: "123 Test Street",
        valide: 1,
        est_confirme: true,
        logo_url: "http://example.com/logo.png",
        cree_le: new Date(),
        mis_a_jour_le: new Date(),
      };

      (prisma.association.create as jest.Mock).mockResolvedValue(
        mockAssociation
      );

      const response = await POST(requestObj);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body).toEqual({
        ...mockAssociation,
        cree_le: mockAssociation.cree_le.toISOString(),
        mis_a_jour_le: mockAssociation.mis_a_jour_le.toISOString(),
      });
      expect(prisma.association.create).toHaveBeenCalledTimes(1);
    });

    it("should return status 400 when no body is received", async () => {
      const requestObj = new NextRequest("http://localhost/api/associations", {
        method: "POST",
        body: null,
      });

      const response = await POST(requestObj);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toEqual("No body received.");
      expect(prisma.association.create).not.toHaveBeenCalled();
    });

    it("should return status 500 when prisma query rejects", async () => {
      const requestObj = new NextRequest("http://localhost/api/associations", {
        method: "POST",
        body: JSON.stringify({
          nom: "Association Test",
        }),
      });

      (prisma.association.create as jest.Mock).mockRejectedValue(
        new Error("Failed to create association")
      );

      const response = await POST(requestObj);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toEqual(expect.any(String));
    });
  });
});
