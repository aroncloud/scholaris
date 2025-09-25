'use server';

import axios from "axios";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

interface SessionPayload {
  accessToken: string;
}

interface RoleApiResponse {
  title: string;
  description: string;
  user_count: number;
  permissions: { permission_title: string }[];
}

interface GetFullRolesResult {
  code: "success" | "error";
  error: string | null;
  data: RoleApiResponse[] | null;
}

/**
 * Fetch full roles server-side using the session cookie
 */
export async function getFullRoles(): Promise<GetFullRolesResult> {
  try {
    // Get session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return { code: "error", error: "Unauthorized: No session cookie", data: null };
    }

    // Decrypt session cookie to get access token
    const sessionPayload = (await decrypt(sessionCookie)) as SessionPayload | null;
    const token = sessionPayload?.accessToken;

    if (!token) {
      return { code: "error", error: "Unauthorized: Invalid session", data: null };
    }

    // Fetch full roles from API
    const response = await axios.get<{ body: RoleApiResponse[] }>(
      "https://iam-worker-dev.scholaris-sys.workers.dev/api/roles/full",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": process.env.X_API,
        },
      }
    );

    // Ensure data exists and is an array
    const roles = response.data.body;
    if (!Array.isArray(roles)) {
      return { code: "error", error: "Invalid response format from API", data: null };
    }

    return { code: "success", error: null, data: roles };
  } catch (error: any) {
    console.error("getFullRoles Error:", error.response?.data || error.message);
    return {
      code: "error",
      error: error.response?.data?.message || "Failed to fetch full roles",
      data: null,
    };
  }
}
