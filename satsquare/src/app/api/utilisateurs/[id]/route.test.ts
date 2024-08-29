/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { PUT, DELETE } from "./route"; // Adjust the import path as needed
import prisma from "@/db/prisma";
import bcrypt from "bcrypt";
import { exclude } from "@/utils/utils";

jest.mock("@/db/prisma", () => ({
  utilisateur: {
    update: jest.fn(),
    delete: jest.fn(),
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

describe("API Routes: Utilisateur", () => {
  describe("PUT", () => {
    it("should update a utilisateur and return status 200", async () => {
      const mockUtilisateur = {
        id: 1,
        pseudo: "UpdatedPseudo",
        email: "updated@example.com",
        statutCompte: "active",
        mot_de_passe: "hashedpassword",
      };

      const mockExclusion = {
        id: 1,
        pseudo: "UpdatedPseudo",
        email: "updated@example.com",
        statutCompte: "active",
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");
      (prisma.utilisateur.update as jest.Mock).mockResolvedValue(
        mockUtilisateur
      );
      (exclude as jest.Mock).mockReturnValue(mockExclusion);

      const req = createMockRequest(
        "http://localhost/api/utilisateur/1",
        "PUT",
        {
          pseudo: "UpdatedPseudo",
          email: "updated@example.com",
          statut_compte: "active",
          mot_de_passe: "newpassword",
        }
      );
      const response = await PUT(req, { params: { id: "1" } });

      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse).toEqual(mockExclusion);
      expect(bcrypt.hash).toHaveBeenCalledWith("newpassword", 10);
      expect(prisma.utilisateur.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          pseudo: "UpdatedPseudo",
          email: "updated@example.com",
          statutCompte: "active",
          mot_de_passe: "hashedpassword",
        }),
      });
    });

    it("should update a utilisateur without changing the password if not provided", async () => {
      const mockUtilisateur = {
        id: 1,
        pseudo: "UpdatedPseudo",
        email: "updated@example.com",
        statutCompte: "active",
        mot_de_passe: "existinghashedpassword",
      };

      const mockExclusion = {
        id: 1,
        pseudo: "UpdatedPseudo",
        email: "updated@example.com",
        statutCompte: "active",
      };

      (prisma.utilisateur.update as jest.Mock).mockResolvedValue(
        mockUtilisateur
      );
      (exclude as jest.Mock).mockReturnValue(mockExclusion);

      const req = createMockRequest(
        "http://localhost/api/utilisateur/1",
        "PUT",
        {
          pseudo: "UpdatedPseudo",
          email: "updated@example.com",
          statut_compte: "active",
          mot_de_passe: "",
        }
      );
      const response = await PUT(req, { params: { id: "1" } });

      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse).toEqual(mockExclusion);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prisma.utilisateur.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          pseudo: "UpdatedPseudo",
          email: "updated@example.com",
          statutCompte: "active",
          mot_de_passe: undefined,
        }),
      });
    });

    it("should return a 500 error if updating utilisateur fails", async () => {
      (prisma.utilisateur.update as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const req = createMockRequest(
        "http://localhost/api/utilisateur/1",
        "PUT",
        {
          pseudo: "UpdatedPseudo",
          email: "updated@example.com",
          statut_compte: "active",
        }
      );
      const response = await PUT(req, { params: { id: "1" } });

      const jsonResponse = await response.json();

      expect(response.status).toBe(500);
      expect(jsonResponse.error).toBe(
        "An error occurred while updating the utilisateur"
      );
    });
  });

  describe("DELETE", () => {
    it("should delete a utilisateur and return status 200", async () => {
      (prisma.utilisateur.delete as jest.Mock).mockResolvedValue({});

      const req = createMockRequest(
        "http://localhost/api/utilisateur/1",
        "DELETE"
      );
      const response = await DELETE(req, { params: { id: "1" } });

      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse.message).toBe("Utilisateur deleted successfully");
      expect(prisma.utilisateur.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should return a 500 error if deleting utilisateur fails", async () => {
      (prisma.utilisateur.delete as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const req = createMockRequest(
        "http://localhost/api/utilisateur/1",
        "DELETE"
      );
      const response = await DELETE(req, { params: { id: "1" } });

      const jsonResponse = await response.json();

      expect(response.status).toBe(500);
      expect(jsonResponse.error).toBe(
        "An error occurred while deleting the utilisateur"
      );
    });
  });
});
