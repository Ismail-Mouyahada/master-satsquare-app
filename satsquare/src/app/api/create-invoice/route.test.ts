/**
 * @jest-environment node
 */
import prisma from "@/db/prisma";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import axios from "axios";
import "whatwg-fetch";
import { POST } from "./route";

jest.mock("next-auth/next");
jest.mock("axios");
jest.mock("@/db/prisma", () => ({
  __esModule: true,
  default: {
    utilisateur: {
      findUnique: jest.fn(),
    },
  },
}));

describe("API Routes: Create Invoice", () => {
  const mockSession = {
    user: {
      email: "test@example.com",
    },
  };

  const mockUser = {
    id: 1,
    email: "test@example.com",
    walletId: "sample_wallet_id",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return status 401 if session does not exist", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const requestObj = new NextRequest("http://localhost/api/invoice", {
      method: "POST",
      body: JSON.stringify({
        amount: 1000,
        memo: "Test Invoice",
      }),
    });

    const response = await POST(requestObj);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  it("should return status 401 if user is not found in the database", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue(null);

    const requestObj = new NextRequest("http://localhost/api/invoice", {
      method: "POST",
      body: JSON.stringify({
        amount: 1000,
        memo: "Test Invoice",
      }),
    });

    const response = await POST(requestObj);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe("Unauthorized");
  });

  it("should return status 400 if invoice key is not found", async () => {
    const mockUserWithoutWalletId = { ...mockUser, walletId: null };
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue(
      mockUserWithoutWalletId
    );

    const requestObj = new NextRequest("http://localhost/api/invoice", {
      method: "POST",
      body: JSON.stringify({
        amount: 1000,
        memo: "Test Invoice",
      }),
    });

    const response = await POST(requestObj);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Invoice key not found");
  });

  it("should return status 400 if amount or memo is missing", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const requestObj = new NextRequest("http://localhost/api/invoice", {
      method: "POST",
      body: JSON.stringify({
        memo: "Test Invoice", // Missing amount
      }),
    });

    const response = await POST(requestObj);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Amount and memo are required");
  });

  it("should return status 201 and created invoice on successful request", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const mockInvoice = {
      payment_hash: "sample_payment_hash",
      payment_request: "sample_payment_request",
    };

    (axios.post as jest.Mock).mockResolvedValue({ data: mockInvoice });

    const requestObj = new NextRequest("http://localhost/api/invoice", {
      method: "POST",
      body: JSON.stringify({
        amount: 1000,
        memo: "Test Invoice",
      }),
    });

    const response = await POST(requestObj);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual(mockInvoice);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it("should return status 500 if the API request fails", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    (prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (axios.post as jest.Mock).mockRejectedValue(
      new Error("Failed to create invoice")
    );

    const requestObj = new NextRequest("http://localhost/api/invoice", {
      method: "POST",
      body: JSON.stringify({
        amount: 1000,
        memo: "Test Invoice",
      }),
    });

    const response = await POST(requestObj);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Failed to create invoice");
  });
});
