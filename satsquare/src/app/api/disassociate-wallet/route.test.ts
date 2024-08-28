/**
 * @jest-environment node
 */
import { POST } from "@/app/api/disassociate-wallet/route"; // Ajustez le chemin si nécessaire
import prisma from "@/db/prisma";
import { NextRequest } from "next/server";
import "whatwg-fetch";

jest.mock("@/db/prisma", () => ({
  __esModule: true,
  default: {
    utilisateur: {
      update: jest.fn(),
    },
  },
}));

describe("API Routes: Disassociate Wallet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and success message when wallet is disassociated successfully", async () => {
    (prisma.utilisateur.update as jest.Mock).mockResolvedValue({});

    const requestObj = new NextRequest(
      "http://localhost/api/disassociate-wallet",
      {
        method: "POST",
        body: JSON.stringify({
          userId: 1,
        }),
      }
    );

    const response = await POST(requestObj);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toBe("Wallet disassociated successfully");
    expect(prisma.utilisateur.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { walletId: null },
    });
    expect(prisma.utilisateur.update).toHaveBeenCalledTimes(1);
  });

  it("should return 400 if userId is not provided", async () => {
    const requestObj = new NextRequest(
      "http://localhost/api/disassociate-wallet",
      {
        method: "POST",
        body: JSON.stringify({}),
      }
    );

    const response = await POST(requestObj);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.message).toBe("User ID is required");
    expect(prisma.utilisateur.update).not.toHaveBeenCalled();
  });

  it("should return 500 if an error occurs during the disassociation", async () => {
    (prisma.utilisateur.update as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const requestObj = new NextRequest(
      "http://localhost/api/disassociate-wallet",
      {
        method: "POST",
        body: JSON.stringify({
          userId: 1,
        }),
      }
    );

    const response = await POST(requestObj);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.message).toBe("Failed to disassociate wallet");
    expect(prisma.utilisateur.update).toHaveBeenCalledTimes(1);
  });
});
