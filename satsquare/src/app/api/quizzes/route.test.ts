/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { GET, POST } from "./route"; // Adjust the import path as needed
import prisma from "@/db/prisma";

jest.mock("@/db/prisma", () => ({
  quiz: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
}));

// Helper function to create a mock request
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

describe("API Routes: Quizzes", () => {
  describe("GET", () => {
    it("should return all quizzes when no subject is provided", async () => {
      const mockQuizzes = [
        {
          id: 1,
          subject: "Sample Quiz",
          utilisateur: { id: 1, name: "User 1" },
          questions: [
            {
              id: 1,
              question: "Sample Question",
              playersAnswers: [],
            },
          ],
        },
      ];
      (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce(mockQuizzes);

      const req = createMockRequest("http://localhost/api/quizzes");
      const response = await GET(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse).toEqual(mockQuizzes);
    });

    it("should return quizzes filtered by subject", async () => {
      const mockQuizzes = [
        {
          id: 1,
          subject: "Filtered Quiz",
          utilisateur: { id: 1, name: "User 1" },
          questions: [
            {
              id: 1,
              question: "Sample Question",
              playersAnswers: [],
            },
          ],
        },
      ];
      (prisma.quiz.findMany as jest.Mock).mockResolvedValueOnce(mockQuizzes);

      const req = createMockRequest(
        "http://localhost/api/quizzes?subject=Filtered"
      );
      const response = await GET(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse).toEqual(mockQuizzes);
    });

    it("should return a 500 error if fetching quizzes fails", async () => {
      (prisma.quiz.findMany as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const req = createMockRequest("http://localhost/api/quizzes");
      const response = await GET(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(500);
      expect(jsonResponse.error).toBe(
        "An error occurred while fetching quizzes. Please try again later."
      );
    });
  });

  describe("POST", () => {
    it("should create a new quiz when valid data is provided", async () => {
      const mockQuiz = {
        id: 1,
        subject: "New Quiz",
        utilisateurId: 1,
        questions: [
          {
            id: 1,
            question: "New Question",
            playersAnswers: [],
          },
        ],
      };
      (prisma.quiz.create as jest.Mock).mockResolvedValueOnce(mockQuiz);

      const req = createMockRequest("http://localhost/api/quizzes", "POST", {
        subject: "New Quiz",
        utilisateurId: 1,
        password: "securepassword",
        questions: [
          {
            question: "New Question",
            answers: [{ answer: "Answer 1", isCorrect: true }],
          },
        ],
      });

      const response = await POST(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(201);
      expect(jsonResponse).toEqual(mockQuiz);
    });

    it("should return a 500 error if creating quiz fails", async () => {
      (prisma.quiz.create as jest.Mock).mockRejectedValueOnce(
        new Error("Database error")
      );

      const req = createMockRequest("http://localhost/api/quizzes", "POST", {
        subject: "New Quiz",
        utilisateurId: 1,
        password: "securepassword",
        questions: [
          {
            question: "New Question",
            answers: [{ answer: "Answer 1", isCorrect: true }],
          },
        ],
      });

      const response = await POST(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(500);
      expect(jsonResponse.error).toBe(
        "An error occurred while creating the quiz. Please check your input and try again."
      );
    });
  });
});
