/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { GET } from "./route"; // Adjust the import path as needed
import prisma from "@/db/prisma";

jest.mock("@/db/prisma", () => ({
  topScore: {
    findMany: jest.fn(),
  },
}));

// Helper function to create a mock request
const createMockRequest = (url: string) => {
  return new NextRequest(new Request(url));
};

describe("API Routes: User Rankings", () => {
  describe("GET", () => {
    it("should return user rankings with status 200", async () => {
      const mockScores = [
        {
          id: 1,
          userId: 1,
          score: 100,
          wins: 5,
        },
        {
          id: 2,
          userId: 2,
          score: 150,
          wins: 8,
        },
      ];
      (prisma.topScore.findMany as jest.Mock).mockResolvedValueOnce(mockScores);

      const req = createMockRequest("http://localhost/api/user-rankings");
      const response = await GET(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse).toEqual(mockScores);
    });

    it("should return a 500 error if fetching user rankings fails", async () => {
      (prisma.topScore.findMany as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const req = createMockRequest("http://localhost/api/user-rankings");
      const response = await GET(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(500);
      expect(jsonResponse.error).toBe(
        "An error occurred while fetching user rankings"
      );
    });
  });
});
