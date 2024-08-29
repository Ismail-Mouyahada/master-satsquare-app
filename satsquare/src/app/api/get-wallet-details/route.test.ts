/**
 * @jest-environment node
 */
import prisma from "@/db/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import "whatwg-fetch";
import { GET } from "./route";

jest.mock("@/db/prisma", () => ({
  __esModule: true,
  default: {
    utilisateur: {
      findFirst: jest.fn(),
    },
  },
}));

jest.mock("next-auth/jwt");

describe("API Routes: Wallet", () => {
  const mockRequest = (url: string) => new NextRequest(url, { method: "GET" });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if user is not authenticated", async () => {
    (getToken as jest.Mock).mockResolvedValue(null);

    const request = mockRequest("http://localhost/api/wallet");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe("Not authenticated");
    expect(body.details).toBe("User session not found");
  });

  it("should return 404 if wallet or walletId is not found", async () => {
    (getToken as jest.Mock).mockResolvedValue({ email: "test@example.com" });
    (prisma.utilisateur.findFirst as jest.Mock).mockResolvedValue(null);

    const request = mockRequest("http://localhost/api/wallet");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toBe("Failed to fetch wallet details");
    expect(body.details).toBe("Wallet not found or Wallet ID missing");
  });

  it("should return 500 if external API request fails", async () => {
    (getToken as jest.Mock).mockResolvedValue({ email: "test@example.com" });
    (prisma.utilisateur.findFirst as jest.Mock).mockResolvedValue({
      walletId: "sample_wallet_id",
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValue("API error"),
    });

    const request = mockRequest("http://localhost/api/wallet");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Failed to fetch wallet details from external API");
    expect(body.details).toBe("API error");
  });

  it("should return 200 with wallet details on successful request", async () => {
    const mockWalletData = {
      balance: 1000,
      transactions: [],
    };

    (getToken as jest.Mock).mockResolvedValue({ email: "test@example.com" });
    (prisma.utilisateur.findFirst as jest.Mock).mockResolvedValue({
      walletId: "sample_wallet_id",
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockWalletData),
    });

    const request = mockRequest("http://localhost/api/wallet");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(mockWalletData);
  });

  it("should return 500 if an unexpected error occurs", async () => {
    (getToken as jest.Mock).mockResolvedValue({ email: "test@example.com" });
    (prisma.utilisateur.findFirst as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const request = mockRequest("http://localhost/api/wallet");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Failed to fetch wallet details");
    expect(body.details).toBe("Database error");
  });
});
