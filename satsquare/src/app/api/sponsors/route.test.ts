/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { GET, POST } from "./route"; // Adjust the import path as needed
import prisma from "@/db/prisma";

jest.mock("@/db/prisma", () => ({
  sponsor: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
}));

// Helper function to create a mock request
const createMockRequest = (url: string, method: string, body?: any) => {
  return new NextRequest(
    new Request(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
    })
  );
};

describe("API Routes: Sponsors", () => {
  describe("GET", () => {
    it("should return all sponsors with status 200", async () => {
      const mockSponsors = [
        { id: 1, nom: "Sponsor 1" },
        { id: 2, nom: "Sponsor 2" },
      ];
      (prisma.sponsor.findMany as jest.Mock).mockResolvedValueOnce(
        mockSponsors
      );

      const req = createMockRequest("http://localhost/api/sponsors", "GET");
      const response = await GET(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse).toEqual(mockSponsors);
    });

    it("should return sponsors filtered by name with status 200", async () => {
      const mockSponsors = [{ id: 1, nom: "Sponsor 1" }];
      (prisma.sponsor.findMany as jest.Mock).mockResolvedValueOnce(
        mockSponsors
      );

      const req = createMockRequest(
        "http://localhost/api/sponsors?name=Sponsor 1",
        "GET"
      );
      const response = await GET(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse).toEqual(mockSponsors);
    });

    it("should return a 500 error if fetching sponsors fails", async () => {
      (prisma.sponsor.findMany as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const req = createMockRequest("http://localhost/api/sponsors", "GET");
      const response = await GET(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(500);
      expect(jsonResponse.error).toBe(
        "An error occurred while fetching sponsors"
      );
    });
  });

  describe("POST", () => {
    it("should create a new sponsor and return status 201", async () => {
      const mockSponsor = { id: 1, nom: "New Sponsor" };
      (prisma.sponsor.create as jest.Mock).mockResolvedValueOnce(mockSponsor);

      const req = createMockRequest("http://localhost/api/sponsors", "POST", {
        nom: "New Sponsor",
      });
      const response = await POST(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(201);
      expect(jsonResponse).toEqual(mockSponsor);
    });

    it("should return a 500 error if creating sponsor fails", async () => {
      (prisma.sponsor.create as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const req = createMockRequest("http://localhost/api/sponsors", "POST", {
        nom: "New Sponsor",
      });
      const response = await POST(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(500);
      expect(jsonResponse.error).toBe(
        "An error occurred while creating the sponsor"
      );
    });
  });
});
