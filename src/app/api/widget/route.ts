import { type NextRequest, NextResponse } from "next/server";
import { saveWidget, generateWidgetId } from "@/lib/widget-storage";

export async function POST(request: NextRequest) {
  try {
    const { location, demoUrl, weatherData, movieData, countryData } = await request.json();

    if (!location || !demoUrl) {
      return NextResponse.json({ error: "Location and demo URL are required" }, { status: 400 });
    }

    // Generate a unique ID for the widget
    const id = generateWidgetId(location, movieData?.Title || "");

    const widgetData = {
      id,
      location,
      demoUrl,
      weatherData,
      movieData,
      countryData,
      createdAt: new Date().toISOString(),
    };

    saveWidget(id, widgetData);

    return NextResponse.json({ id, url: `/widget/${id}` });
  } catch (error) {
    console.error("Widget creation error:", error);
    return NextResponse.json({ error: "Failed to create widget" }, { status: 500 });
  }
}
