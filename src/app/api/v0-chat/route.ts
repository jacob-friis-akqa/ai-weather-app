import { type NextRequest, NextResponse } from "next/server";
import { v0 } from "v0-sdk";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Create a new chat using the v0 SDK
    const chat = await v0.chats.create({
      message: message,
    });

    return NextResponse.json({
      demo: chat.demo,
    });
  } catch (error) {
    console.error("v0 API Error:", error);
    return NextResponse.json({ error: "Failed to create chat with v0 API" }, { status: 500 });
  }
}
