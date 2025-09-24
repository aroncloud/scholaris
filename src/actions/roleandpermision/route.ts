import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

interface SessionPayload {
  accessToken: string;
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ code: "error", error: "No session cookie", data: null });
    }

    const sessionPayload = (await decrypt(sessionCookie)) as SessionPayload | null;
    const token = sessionPayload?.accessToken;

    if (!token) {
      return NextResponse.json({ code: "error", error: "Invalid session", data: null });
    }

    const response = await axios.get(
      "https://iam-worker-dev.scholaris-sys.workers.dev/api/roles/full",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": process.env.X_API,
        },
      }
    );

    const roles = response.data.body;
    if (!Array.isArray(roles)) {
      return NextResponse.json({ code: "error", error: "Invalid API response", data: null });
    }

    return NextResponse.json({ code: "success", error: null, data: roles });
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    return NextResponse.json({
      code: "error",
      error: error.response?.data?.message || "Failed to fetch roles",
      data: null,
    });
  }
}
