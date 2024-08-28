/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { GET, POST } from "./route"; // Adjust the import path as needed
import prisma from "@/db/prisma";

jest.mock("@/db/prisma", () => ({
  role: {
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

describe("API Routes: Roles", () => {
  describe("GET", () => {
    it("should return all roles with status 200", async () => {
      const mockRoles = [
        { id: 1, nom: "Admin" },
        { id: 2, nom: "User" },
      ];
      (prisma.role.findMany as jest.Mock).mockResolvedValueOnce(mockRoles);

      const req = createMockRequest("http://localhost/api/roles", "GET");
      const response = await GET(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse).toEqual(mockRoles);
    });

    it("should return roles filtered by name with status 200", async () => {
      const mockRoles = [{ id: 1, nom: "Admin" }];
      (prisma.role.findMany as jest.Mock).mockResolvedValueOnce(mockRoles);

      const req = createMockRequest(
        "http://localhost/api/roles?name=Admin",
        "GET"
      );
      const response = await GET(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse).toEqual(mockRoles);
    });

    it("should return a 500 error if fetching roles fails", async () => {
      (prisma.role.findMany as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const req = createMockRequest("http://localhost/api/roles", "GET");
      const response = await GET(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(500);
      expect(jsonResponse.error).toBe("An error occurred while fetching roles");
    });
  });

  describe("POST", () => {
    it("should create a new role and return status 201", async () => {
      const mockRole = { id: 1, nom: "Admin" };
      (prisma.role.create as jest.Mock).mockResolvedValueOnce(mockRole);

      const req = createMockRequest("http://localhost/api/roles", "POST", {
        nom: "Admin",
      });
      const response = await POST(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(201);
      expect(jsonResponse).toEqual(mockRole);
    });

    it("should return a 500 error if creating role fails", async () => {
      (prisma.role.create as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const req = createMockRequest("http://localhost/api/roles", "POST", {
        nom: "Admin",
      });
      const response = await POST(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(500);
      expect(jsonResponse.error).toBe(
        "An error occurred while creating the role"
      );
    });
  });
});
