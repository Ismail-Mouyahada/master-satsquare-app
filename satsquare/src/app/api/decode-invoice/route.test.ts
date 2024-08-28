/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import axios from "axios";
import "whatwg-fetch";
import { POST } from "./route";

jest.mock("axios");

describe("API Routes: Decode Invoice", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return decoded invoice with status 200 on success", async () => {
    const mockDecodedInvoice = {
      payment_hash: "sample_payment_hash",
      amount: 1000,
    };

    (axios.post as jest.Mock).mockResolvedValue({ data: mockDecodedInvoice });

    const requestObj = new NextRequest("http://localhost/api/invoice/decode", {
      method: "POST",
      body: JSON.stringify({
        invoice: "sample_invoice_string",
      }),
    });

    const response = await POST(requestObj);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(mockDecodedInvoice);
    expect(axios.post).toHaveBeenCalledWith(
      "https://lightning.ismail-mouyahada.com/api/v1/payments/decode",
      {
        data: "sample_invoice_string",
      },
      {
        headers: {
          "X-Api-Key":
            process.env.LNBITS_INVOICE_KEY ||
            "c0081b6f59d749c1984a916afddec8c1",
          "Content-Type": "application/json",
        },
      }
    );
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it("should return status 500 if decoding fails", async () => {
    (axios.post as jest.Mock).mockRejectedValue(
      new Error("Failed to decode invoice")
    );

    const requestObj = new NextRequest("http://localhost/api/invoice/decode", {
      method: "POST",
      body: JSON.stringify({
        invoice: "sample_invoice_string",
      }),
    });

    const response = await POST(requestObj);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Failed to decode invoice");
  });

  it("should return status 500 if request body is malformed", async () => {
    const requestObj = new NextRequest("http://localhost/api/invoice/decode", {
      method: "POST",
      body: "not_a_valid_json",
    });

    const response = await POST(requestObj);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Failed to decode invoice");
  });
});
