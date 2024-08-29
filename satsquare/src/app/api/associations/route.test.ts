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
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/associations", () => {
    it("should return all associations with status 200", async () => {
      const mockAssociations = [
        {
          id: 1,
          nom: "Association 1",
          adresseEclairage: "123 Street",
          valide: 1,
          estConfirme: true,
          logo_url: "http://example.com/logo.png",
          creeLe: new Date(),
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
          creeLe: association.creeLe.toISOString(),
          mis_a_jour_le: association.mis_a_jour_le.toISOString(),
        }))
      );
    });

    it("should return associations by name with status 200", async () => {
      const mockAssociations = [
        {
          id: 1,
          nom: "Test Association",
          adresseEclairage: "123 Street",
          valide: 1,
          estConfirme: true,
          logo_url: "http://example.com/logo.png",
          creeLe: new Date(),
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
          creeLe: association.creeLe.toISOString(),
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
      expect(body.error).toEqual(
        "An error occurred while fetching associations"
      );
    });
  });

  describe("POST /api/associations", () => {
    it("should return added data with status 201", async () => {
      const requestObj = new NextRequest("http://localhost/api/associations", {
        method: "POST",
        body: JSON.stringify({
          nom: "Association Test",
          adresseEclairage: "123 Test Street",
          valide: 1,
          estConfirme: true,
          logo_url: "http://example.com/logo.png",
        }),
        headers: { "Content-Type": "application/json" },
      });

      const mockAssociation = {
        id: 1,
        nom: "Association Test",
        adresseEclairage: "123 Test Street",
        valide: 1,
        estConfirme: true,
        logo_url: "http://example.com/logo.png",
        creeLe: new Date(),
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
        creeLe: mockAssociation.creeLe.toISOString(),
        mis_a_jour_le: mockAssociation.mis_a_jour_le.toISOString(),
      });
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
        headers: { "Content-Type": "application/json" },
      });

      (prisma.association.create as jest.Mock).mockRejectedValue(
        new Error("Failed to create association")
      );

      const response = await POST(requestObj);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toEqual(
        "An error occurred while creating the association"
      );
    });
  });
});
