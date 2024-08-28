/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import axios from "axios";
import "whatwg-fetch";
import { GET } from "./route";

jest.mock("axios");

describe("API Routes: Invoice Status", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/invoiceStatus", () => {
    it("should return invoice status with status 200", async () => {
      const mockResponse = {
        data: {
          paid: true,
          payment_hash: "sample_payment_hash",
          amount: 1000,
        },
      };

      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const requestObj = new NextRequest(
        "http://localhost/api/invoiceStatus?payment_hash=sample_payment_hash"
      );
      const response = await GET(requestObj);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(mockResponse.data);
    });

    it("should return status 400 if payment_hash is missing", async () => {
      const requestObj = new NextRequest("http://localhost/api/invoiceStatus");
      const response = await GET(requestObj);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error).toBe("Payment hash is missing");
    });

    it("should return status 500 if the API request fails", async () => {
      (axios.get as jest.Mock).mockRejectedValue(
        new Error("Failed to check invoice status")
      );

      const requestObj = new NextRequest(
        "http://localhost/api/invoiceStatus?payment_hash=sample_payment_hash"
      );
      const response = await GET(requestObj);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toBe("Failed to check invoice status");
    });
  });
});
