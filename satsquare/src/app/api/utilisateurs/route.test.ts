/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { GET, POST } from "./route"; // Adjust the import path as needed
import prisma from "@/db/prisma";
import bcrypt from "bcrypt";
import { exclude } from "@/utils/utils";

jest.mock("@/db/prisma", () => ({
  utilisateur: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

jest.mock("@/utils/utils", () => ({
  exclude: jest.fn(),
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

describe("API Routes: Utilisateurs", () => {
  describe("GET", () => {
    it("should return all utilisateurs with status 200", async () => {
      const mockUtilisateurs = [
        {
          id: 1,
          pseudo: "User1",
          email: "user1@example.com",
          role: { id: 1, nom: "Admin" },
        },
        {
          id: 2,
          pseudo: "User2",
          email: "user2@example.com",
          role: { id: 2, nom: "User" },
        },
      ];

      const mockExclusion = [
        {
          id: 1,
          pseudo: "User1",
          email: "user1@example.com",
          role: { id: 1, nom: "Admin" },
        },
        {
          id: 2,
          pseudo: "User2",
          email: "user2@example.com",
          role: { id: 2, nom: "User" },
        },
      ];

      (prisma.utilisateur.findMany as jest.Mock).mockResolvedValueOnce(
        mockUtilisateurs
      );
      (exclude as jest.Mock).mockImplementation((utilisateur, keys) => {
        const { mot_de_passe, ...rest } = utilisateur;
        return rest;
      });

      const req = createMockRequest("http://localhost/api/utilisateurs", "GET");
      const response = await GET(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse).toEqual(mockExclusion);
    });

    it("should return utilisateurs filtered by name with status 200", async () => {
      const mockUtilisateurs = [
        {
          id: 1,
          pseudo: "User1",
          email: "user1@example.com",
          role: { id: 1, nom: "Admin" },
        },
      ];

      const mockExclusion = [
        {
          id: 1,
          pseudo: "User1",
          email: "user1@example.com",
          role: { id: 1, nom: "Admin" },
        },
      ];

      (prisma.utilisateur.findMany as jest.Mock).mockResolvedValueOnce(
        mockUtilisateurs
      );
      (exclude as jest.Mock).mockImplementation((utilisateur, keys) => {
        const { mot_de_passe, ...rest } = utilisateur;
        return rest;
      });

      const req = createMockRequest(
        "http://localhost/api/utilisateurs?name=User1",
        "GET"
      );
      const response = await GET(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse).toEqual(mockExclusion);
    });

    it("should return a 500 error if fetching utilisateurs fails", async () => {
      (prisma.utilisateur.findMany as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const req = createMockRequest("http://localhost/api/utilisateurs", "GET");
      const response = await GET(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(500);
      expect(jsonResponse.error).toBe(
        "An error occurred while fetching utilisateurs"
      );
    });
  });

  describe("POST", () => {
    it("should create a new utilisateur and return status 201", async () => {
      const mockUtilisateur = {
        id: 1,
        pseudo: "User1",
        email: "user1@example.com",
        roleId: 1,
      };

      const mockExclusion = {
        id: 1,
        pseudo: "User1",
        email: "user1@example.com",
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");
      (prisma.utilisateur.create as jest.Mock).mockResolvedValueOnce(
        mockUtilisateur
      );
      (exclude as jest.Mock).mockReturnValue(mockExclusion);

      const req = createMockRequest(
        "http://localhost/api/utilisateurs",
        "POST",
        {
          pseudo: "User1",
          email: "user1@example.com",
          mot_de_passe: "password",
          statut_compte: "active",
          roleId: 1,
        }
      );
      const response = await POST(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(201);
      expect(jsonResponse).toEqual(mockExclusion);
      expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
      expect(prisma.utilisateur.create).toHaveBeenCalledWith({
        data: {
          pseudo: "User1",
          email: "user1@example.com",
          mot_de_passe: "hashedpassword",
          statutCompte: "active",
          role: { connect: { id: 1 } },
        },
      });
    });

    it("should return a 500 error if creating utilisateur fails", async () => {
      (prisma.utilisateur.create as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const req = createMockRequest(
        "http://localhost/api/utilisateurs",
        "POST",
        {
          pseudo: "User1",
          email: "user1@example.com",
          mot_de_passe: "password",
          statut_compte: "active",
          roleId: 1,
        }
      );
      const response = await POST(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(500);
      expect(jsonResponse.error).toBe(
        "An error occurred while creating the utilisateur"
      );
    });
  });
});
