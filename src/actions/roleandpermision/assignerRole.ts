'use server';

import axios from "axios";
import { decrypt } from "@/lib/session";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

interface SessionPayload {
  accessToken: string;
  // add other fields if needed
}

type ApiResponse<T = any> = {
  code: "success" | "error";
  error: string | null;
  data: T | null;
};

export async function getSessionTokenFromCookieValue(sessionCookie?: string): Promise<string | null> {
  if (!sessionCookie) return null;

  const sessionPayload = await decrypt(sessionCookie);
  if (!sessionPayload || !sessionPayload.accessToken) return null;

  return sessionPayload.accessToken;
}

export async function assignRole(userCode: string, roleCode: string): Promise<ApiResponse> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) throw new Error("No session cookie found");

    const token = await getSessionTokenFromCookieValue(sessionCookie);
    if (!token) throw new Error("No access token found in session");

    const response = await axios.post(
      `${process.env.ROLE_ENDPOINT}/api/users/${userCode}/role`,
      { role_code: roleCode },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": process.env.X_API,
          "Content-Type": "application/json",
        },
      }
    );

    return { code: "success", error: null, data: response.data };
  } catch (error: any) {
    console.error("Assign Role Error:", error.response ?? error.message);

    return {
      code: "error",
      error: error.response?.data?.message ?? "Role assignment failed",
      data: null,
    };
  }
}

export async function removeRole(userCode: string, roleCode: string, profile_code: string): Promise<ApiResponse> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) throw new Error("No session cookie found");

    const token = await getSessionTokenFromCookieValue(sessionCookie);
    if (!token) throw new Error("No access token found in session");

    if (!roleCode) throw new Error("Missing role code for removal");

    const url = `${process.env.ROLE_ENDPOINT}/api/users/${userCode}/role`;

    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": process.env.X_API,
        "Content-Type": "application/json",
      },
      data: { role_code: roleCode }, // ✅ backend only needs role_code now
    });

    return {
      code: "success",
      error: null,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Remove Role Error:", error.response ?? error.message);

    return {
      code: "error",
      error: error.response?.data?.message ?? "Role removal failed",
      data: null,
    };
  }
}

export async function GET(request: Request) {
  try {
    const token = request.headers.get("authorization") || "";

    const response = await axios.get(`${process.env.ROLE_ENDPOINT}/api/roles`, {
      headers: { Authorization: token },
    });

    return NextResponse.json(
      { code: "success", error: null, data: response.data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching roles:", error.response ?? error.message);

    return NextResponse.json(
      {
        code: "error",
        error: error.response?.data?.message ?? "Failed to fetch roles",
        data: null,
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function GET_full_role(request: Request) {
  try {
    const token = request.headers.get("authorization") || "";

    if (!token) {
      return NextResponse.json(
        { code: "error", error: "Unauthorized: Missing token", data: null },
        { status: 401 }
      );
    }

    const response = await axios.get(`${process.env.ROLE_ENDPOINT}/api/roles/full`, {
      headers: { Authorization: token },
    });

    return NextResponse.json(
      { code: "success", error: null, data: response.data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching full roles:", error.response ?? error.message);

    const statusCode = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to fetch full roles";

    return NextResponse.json(
      { code: "error", error: message, data: null },
      { status: statusCode }
    );
  }
}
