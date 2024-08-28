/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { GET } from "./route"; // Adjust the import path as needed
import axios from "axios";

jest.mock("axios");

// Helper function to create a mock request
const createMockRequest = (url: string, method: string = "GET", body?: any) => {
  return new NextRequest(
    new Request(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
    })
  );
};

describe("API Route: Wallet Balance", () => {
  describe("GET", () => {
    it("should return wallet balance with status 200", async () => {
      const mockResponse = { data: { balance: 1000 } };
      (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const req = createMockRequest(
        "http://localhost/api/wallet-balance?walletId=test-wallet-id"
      );
      const response = await GET(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(200);
      expect(jsonResponse).toEqual({ balance: 1000 });
      expect(axios.get).toHaveBeenCalledWith(
        "https://lightning.ismail-mouyahada.com/api/v1/wallet",
        { headers: { "X-Api-Key": "test-wallet-id" } }
      );
    });

    it("should return status 500 when axios request fails", async () => {
      (axios.get as jest.Mock).mockRejectedValueOnce(
        new Error("Request failed")
      );

      const req = createMockRequest(
        "http://localhost/api/wallet-balance?walletId=test-wallet-id"
      );
      const response = await GET(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(500);
      expect(jsonResponse.error).toBe("Failed to fetch wallet balance");
      expect(axios.get).toHaveBeenCalledWith(
        "https://lightning.ismail-mouyahada.com/api/v1/wallet",
        { headers: { "X-Api-Key": "test-wallet-id" } }
      );
    });

    it("should return status 500 when walletId is missing", async () => {
      const req = createMockRequest("http://localhost/api/wallet-balance");
      const response = await GET(req);

      const jsonResponse = await response.json();

      expect(response.status).toBe(500);
      expect(jsonResponse.error).toBe("Failed to fetch wallet balance");
    });
  });
});
