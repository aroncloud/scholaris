import { verifySession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await verifySession();
    return NextResponse.json({ 
      success: true, 
      data: { 
        accessToken: session.accessToken 
      } 
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to verify session' 
      },
      { status: 401 }
    );
  }
}
