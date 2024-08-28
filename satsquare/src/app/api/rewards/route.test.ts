/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { GET } from "./route"; // Adjust the import path as needed
import prisma from "@/db/prisma";

jest.mock("@/db/prisma", () => ({
  don: {
    findMany: jest.fn(),
  },
}));

// Helper function to create a mock request
const createMockRequest = (url: string) => {
  return new NextRequest(new Request(url));
};

describe("API Routes: Rewards", () => {
  describe("GET", () => {
    it("should return rewards with status 200", async () => {
      const mockDons = [
        {
          montant: 100,
          sponsor: {
            nom: "Sponsor 1",
            adresseEclairage: "Address 1",
          },
        },
        {
          montant: 200,
          sponsor: {
            nom: "Sponsor 2",
            adresseEclairage: "Address 2",
          },
        },
      ];
      (prisma.don.findMany as jest.Mock).mockResolvedValueOnce(mockDons);

      const expectedRewards = [
        {
          sponsor: "Sponsor 1",
          montant: 100,
          portefeuille: "Address 1",
        },
        {
          sponsor: "Sponsor 2",
          montant: 200,
          portefeuille: "Address 2",
        },
      ];

      const req = createMockRequest("http://localhost/api/rewards");
      const response = await GET(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse).toEqual(expectedRewards);
    });

    it("should return a 500 error if fetching rewards fails", async () => {
      (prisma.don.findMany as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const req = createMockRequest("http://localhost/api/rewards");
      const response = await GET(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(500);
      expect(jsonResponse.error).toBe(
        "An error occurred while fetching rewards"
      );
    });
  });
});
