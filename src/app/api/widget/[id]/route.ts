import { type NextRequest, NextResponse } from "next/server";
import { getWidget } from "@/lib/widget-storage";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Widget ID is required" }, { status: 400 });
    }

    const widget = getWidget(id);

    if (!widget) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 });
    }

    return NextResponse.json(widget);
  } catch (error) {
    console.error("Widget retrieval error:", error);
    return NextResponse.json({ error: "Failed to retrieve widget" }, { status: 500 });
  }
}
