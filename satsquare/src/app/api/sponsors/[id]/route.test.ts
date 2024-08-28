/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { PUT, DELETE } from "./route"; // Adjust the import path as needed
import prisma from "@/db/prisma";

jest.mock("@/db/prisma", () => ({
  sponsor: {
    update: jest.fn(),
    delete: jest.fn(),
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

describe("API Routes: Sponsor Management", () => {
  describe("PUT", () => {
    it("should update a sponsor and return status 200", async () => {
      const mockSponsor = { id: 1, nom: "Updated Sponsor" };
      (prisma.sponsor.update as jest.Mock).mockResolvedValueOnce(mockSponsor);

      const req = createMockRequest("http://localhost/api/sponsor/1", "PUT", {
        nom: "Updated Sponsor",
      });
      const response = await PUT(req, { params: { id: "1" } });

      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse).toEqual(mockSponsor);
    });

    it("should return a 500 error if updating sponsor fails", async () => {
      (prisma.sponsor.update as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const req = createMockRequest("http://localhost/api/sponsor/1", "PUT", {
        nom: "Updated Sponsor",
      });
      const response = await PUT(req, { params: { id: "1" } });

      const jsonResponse = await response.json();

      expect(response.status).toBe(500);
      expect(jsonResponse.error).toBe(
        "An error occurred while updating the sponsor"
      );
    });
  });

  describe("DELETE", () => {
    it("should delete a sponsor and return status 200", async () => {
      (prisma.sponsor.delete as jest.Mock).mockResolvedValueOnce({});

      const req = createMockRequest("http://localhost/api/sponsor/1", "DELETE");
      const response = await DELETE(req, { params: { id: "1" } });

      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse.message).toBe("Sponsor deleted successfully");
    });

    it("should return a 500 error if deleting sponsor fails", async () => {
      (prisma.sponsor.delete as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const req = createMockRequest("http://localhost/api/sponsor/1", "DELETE");
      const response = await DELETE(req, { params: { id: "1" } });

      const jsonResponse = await response.json();

      expect(response.status).toBe(500);
      expect(jsonResponse.error).toBe(
        "An error occurred while deleting the sponsor"
      );
    });
  });
});
