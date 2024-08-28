import { NextRequest, NextResponse } from "next/server";

// Mock NextRequest with support for query parameters
export const mockNextRequest = (
  url: string,
  method: string = "GET",
  body: any = null
) => {
  const urlObj = new URL(url);
  return {
    url,
    method,
    json: async () => body,
    nextUrl: {
      searchParams: {
        get: (key: string) => urlObj.searchParams.get(key),
      },
    },
  } as unknown as NextRequest;
};

// Mock NextResponse with functionality to capture JSON responses
export const mockNextResponse = () => {
  let responseStatus = 200;
  let responseBody: any;

  return {
    status: (statusCode: number) => {
      responseStatus = statusCode;
      return {
        json: (body: any) => {
          responseBody = body;
          return Promise.resolve({
            status: responseStatus,
            json: () => Promise.resolve(responseBody),
          });
        },
      };
    },
  };
};
