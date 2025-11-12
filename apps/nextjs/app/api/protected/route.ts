import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";

const BASE_URL =
  "https://zg5nz4f7pbvxlgeycnuwjpy2cy0bigya.lambda-url.us-east-2.on.aws";

const JWKS = createRemoteJWKSet(new URL(`${BASE_URL}/api/auth/jwks`));

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: BASE_URL,
      audience: BASE_URL,
    });

    return NextResponse.json({
      message: "Access granted",
      user: payload,
    });
  } catch (error) {
    console.error("Token validation failed:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
