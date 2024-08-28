/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { GET, PUT, DELETE } from "./route"; // Adjust the import path as needed
import prisma from "@/db/prisma";
import "whatwg-fetch";

// Mock prisma methods
jest.mock("@/db/prisma", () => ({
  quiz: {
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock NextRequest for testing
const createMockRequest = (
  url: string,
  method: string = "GET",
  body: any = null
) => {
  const request = new Request(url, {
    method,
    body: body ? JSON.stringify(body) : null,
  });

  return new NextRequest(request);
};

describe("API Routes: Quiz", () => {
  describe("GET", () => {
    it("should return a specific quiz when id is provided", async () => {
      const mockQuiz = {
        id: 1,
        titre: "Sample Quiz",
        questions: [
          {
            id: 1,
            texte_question: "Sample Question",
            playersAnswers: [],
          },
        ],
      };
      (prisma.quiz.findUnique as jest.Mock).mockResolvedValueOnce(mockQuiz);

      const req = createMockRequest("http://localhost/api/quiz?id=1");
      const response = await GET(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse).toEqual(mockQuiz);
    });

    it("should return a 404 error if quiz is not found", async () => {
      (prisma.quiz.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const req = createMockRequest("http://localhost/api/quiz?id=1");
      const response = await GET(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(404);
      expect(jsonResponse).toEqual({ error: "Quiz not found" });
    });

    it("should return a 400 error if id is not provided", async () => {
      const req = createMockRequest("http://localhost/api/quiz");
      const response = await GET(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(400);
      expect(jsonResponse).toEqual({ error: "ID is required" });
    });
  });

  describe("PUT", () => {
    it("should update a quiz when id and valid data are provided", async () => {
      const mockUpdatedQuiz = {
        id: 1,
        titre: "Updated Quiz",
        questions: [
          {
            id: 1,
            texte_question: "Updated Question",
            playersAnswers: [],
          },
        ],
      };
      (prisma.quiz.update as jest.Mock).mockResolvedValueOnce(mockUpdatedQuiz);

      const req = createMockRequest("http://localhost/api/quiz?id=1", "PUT", {
        titre: "Updated Quiz",
        user_id: 1,
        questions: [
          {
            texte_question: "Updated Question",
            reponses: [{ texte_reponse: "Answer 1", est_correcte: true }],
          },
        ],
      });

      const response = await PUT(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse).toEqual(mockUpdatedQuiz);
    });

    it("should return a 400 error if id is not provided", async () => {
      const req = createMockRequest("http://localhost/api/quiz", "PUT", {
        titre: "Updated Quiz",
      });

      const response = await PUT(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(400);
      expect(jsonResponse).toEqual({ error: "ID is required" });
    });

    it("should return a 500 error if updating quiz fails", async () => {
      (prisma.quiz.update as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const req = createMockRequest("http://localhost/api/quiz?id=1", "PUT", {
        titre: "Updated Quiz",
      });

      const response = await PUT(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(500);
      expect(jsonResponse).toEqual({
        error: "An error occurred while updating the quiz",
      });
    });
  });
});
