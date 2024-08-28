/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { PUT, DELETE } from "./route"; // Adjust the import path as needed
import prisma from "@/db/prisma";

jest.mock("@/db/prisma", () => ({
  role: {
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

describe("API Routes: Roles", () => {
  describe("PUT", () => {
    it("should update a role and return status 200", async () => {
      const mockRole = { id: 1, name: "Admin" };
      (prisma.role.update as jest.Mock).mockResolvedValueOnce(mockRole);

      const req = createMockRequest("http://localhost/api/roles/1", "PUT", {
        name: "Admin",
      });
      const params = { id: "1" };
      const response = await PUT(req, { params });

      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse).toEqual(mockRole);
    });

    it("should return a 500 error if updating the role fails", async () => {
      (prisma.role.update as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const req = createMockRequest("http://localhost/api/roles/1", "PUT", {
        name: "Admin",
      });
      const params = { id: "1" };
      const response = await PUT(req, { params });

      const jsonResponse = await response.json();

      expect(response.status).toBe(500);
      expect(jsonResponse.error).toBe(
        "An error occurred while updating the role"
      );
    });
  });

  describe("DELETE", () => {
    it("should delete a role and return status 200", async () => {
      (prisma.role.delete as jest.Mock).mockResolvedValueOnce({});

      const req = createMockRequest("http://localhost/api/roles/1", "DELETE");
      const params = { id: "1" };
      const response = await DELETE(req, { params });

      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse.message).toBe("Role deleted successfully");
    });

    it("should return a 500 error if deleting the role fails", async () => {
      (prisma.role.delete as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const req = createMockRequest("http://localhost/api/roles/1", "DELETE");
      const params = { id: "1" };
      const response = await DELETE(req, { params });

      const jsonResponse = await response.json();

      expect(response.status).toBe(500);
      expect(jsonResponse.error).toBe(
        "An error occurred while deleting the role"
      );
    });
  });
});
