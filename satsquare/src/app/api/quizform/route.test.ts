/**
 * @jest-environment node
 */
import prisma from "@/db/prisma";
import { NextRequest } from "next/server";
import "whatwg-fetch";
import { GET, POST } from "./route";

jest.mock("@/db/prisma", () => ({
  __esModule: true,
  default: {
    quiz: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe("API Routes: Quizzes", () => {
  describe("GET /api/quizzes", () => {
    it("should return all quizzes with status 200", async () => {
      const mockQuizzes = [
        {
          id: 1,
          titre: "Quiz 1",
          user_id: 1,
          categorie: "General",
          Questions: [
            {
              id: 1,
              texte_question: "What is the capital of France?",
              Reponses: [
                { id: 1, texte_reponse: "Paris", est_correcte: true },
                { id: 2, texte_reponse: "London", est_correcte: false },
              ],
            },
          ],
        },
      ];

      (prisma.quiz.findMany as jest.Mock).mockResolvedValue(mockQuizzes);

      const requestObj = new NextRequest("http://localhost/api/quizzes");
      const response = await GET(requestObj);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(
        mockQuizzes.map((quiz) => ({
          ...quiz,
          Questions: quiz.Questions.map((question) => ({
            ...question,
            Reponses: question.Reponses.map((reponse) => ({
              ...reponse,
            })),
          })),
        }))
      );
    });

    it("should return quizzes by name with status 200", async () => {
      const mockQuizzes = [
        {
          id: 1,
          titre: "Test Quiz",
          user_id: 1,
          categorie: "General",
          Questions: [
            {
              id: 1,
              texte_question: "What is the capital of France?",
              Reponses: [
                { id: 1, texte_reponse: "Paris", est_correcte: true },
                { id: 2, texte_reponse: "London", est_correcte: false },
              ],
            },
          ],
        },
      ];

      (prisma.quiz.findMany as jest.Mock).mockResolvedValue(mockQuizzes);

      const requestObj = new NextRequest(
        "http://localhost/api/quizzes?name=Test"
      );
      const response = await GET(requestObj);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(
        mockQuizzes.map((quiz) => ({
          ...quiz,
          Questions: quiz.Questions.map((question) => ({
            ...question,
            Reponses: question.Reponses.map((reponse) => ({
              ...reponse,
            })),
          })),
        }))
      );
    });

    it("should return status 500 when prisma query rejects", async () => {
      (prisma.quiz.findMany as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      const requestObj = new NextRequest("http://localhost/api/quizzes");
      const response = await GET(requestObj);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toEqual(expect.any(String));
    });
  });

  describe("POST /api/quizzes", () => {
    it("should create a new quiz with status 201", async () => {
      const requestData = {
        titre: "New Quiz",
        user_id: 1,
        categorie: "General",
        questions: [
          {
            texte_question: "What is the capital of Spain?",
            reponses: [
              { texte_reponse: "Madrid", est_correcte: true },
              { texte_reponse: "Barcelona", est_correcte: false },
            ],
          },
        ],
      };

      const mockQuiz = {
        id: 1,
        ...requestData,
        Questions: [
          {
            id: 1,
            texte_question: "What is the capital of Spain?",
            Reponses: [
              { id: 1, texte_reponse: "Madrid", est_correcte: true },
              { id: 2, texte_reponse: "Barcelona", est_correcte: false },
            ],
          },
        ],
      };

      (prisma.quiz.create as jest.Mock).mockResolvedValue(mockQuiz);

      const requestObj = new NextRequest("http://localhost/api/quizzes", {
        method: "POST",
        body: JSON.stringify(requestData),
      });

      const response = await POST(requestObj);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body).toEqual({
        ...mockQuiz,
        Questions: mockQuiz.Questions.map((question) => ({
          ...question,
          Reponses: question.Reponses.map((reponse) => ({
            ...reponse,
          })),
        })),
      });
      expect(prisma.quiz.create).toHaveBeenCalledTimes(1);
    });

    it("should return status 500 when prisma query rejects", async () => {
      const requestData = {
        titre: "New Quiz",
        user_id: 1,
        categorie: "General",
        questions: [
          {
            texte_question: "What is the capital of Spain?",
            reponses: [
              { texte_reponse: "Madrid", est_correcte: true },
              { texte_reponse: "Barcelona", est_correcte: false },
            ],
          },
        ],
      };

      const requestObj = new NextRequest("http://localhost/api/quizzes", {
        method: "POST",
        body: JSON.stringify(requestData),
      });

      (prisma.quiz.create as jest.Mock).mockRejectedValue(
        new Error("Failed to create quiz")
      );

      const response = await POST(requestObj);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toEqual(expect.any(String));
    });
  });
});
