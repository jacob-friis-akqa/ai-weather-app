import { type NextRequest, NextResponse } from "next/server";
import { v0 } from "v0-sdk";

const WEATHER_SYSTEM_PROMPT = `Design a beautiful, immersive weather widget that dynamically adapts its visual mood and atmosphere based on a selected movie theme.

CRITICAL REQUIREMENTS:
- NO INPUT FIELDS OR SEARCH BARS - the location is already provided
- NO BUTTONS for location changes - this is a display-only widget
- Focus purely on displaying the weather information beautifully

The widget should feature:
1. A prominent movie display area showing:
   - Movie title prominently displayed
   - Movie poster image (use the provided poster URL)
   - Brief plot summary
   - Genre(s) and director
   - Release year

2. A weather information section displaying:
   - Location name clearly
   - Current temperature in Celsius (large, prominent)
   - Weather condition text
   - Weather icon (use weather condition to determine appropriate icon)
   - 'Feels Like' temperature in Celsius
   - Humidity percentage
   - Wind speed in kph

3. Dynamic theming based on movie genre:
   - Horror: Dark, gritty, desaturated colors, gothic fonts, shadowy effects
   - Comedy: Bright, vibrant, playful colors, fun fonts, cheerful atmosphere
   - Drama: Sophisticated, muted tones, elegant typography
   - Action: Bold, dynamic colors, strong contrasts, energetic design
   - Romance: Soft, warm colors, elegant curves, romantic atmosphere
   - Sci-Fi: Futuristic, neon accents, tech-inspired design
   - Fantasy: Magical, ethereal colors, mystical elements

The entire widget should be a cohesive, beautiful display that feels like it belongs in the movie's world while keeping weather information easily readable.`;

export async function POST(request: NextRequest) {
  try {
    const { message, weatherData, movieData, countryData, isStyleUpdate } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Construct the enhanced message with context
    let enhancedMessage = message;

    if (weatherData && movieData && countryData) {
      if (isStyleUpdate) {
        enhancedMessage = `Update the existing weather widget with new styling for ${countryData.name}. Keep the same layout and structure, but change the visual theme to match the new movie data:

WEATHER DATA (update the displayed data):
- Location: ${weatherData.location?.name || countryData.name}
- Temperature: ${weatherData.current?.temp_c}°C
- Condition: ${weatherData.current?.condition?.text}
- Feels Like: ${weatherData.current?.feelslike_c}°C
- Humidity: ${weatherData.current?.humidity}%
- Wind Speed: ${weatherData.current?.wind_kph} kph

NEW MOVIE THEME:
- Title: ${movieData.Title}
- Genre: ${movieData.Genre}
- Plot: ${movieData.Plot}
- Director: ${movieData.Director}
- Year: ${movieData.Year}
- Poster: ${movieData.Poster}

Update the color scheme, typography, and overall mood to match the new movie's genre. Keep the widget structure the same but refresh the visual styling.`;
      } else {
        enhancedMessage = `${WEATHER_SYSTEM_PROMPT}

Create a beautiful weather widget for ${countryData.name} with the following data:

WEATHER DATA:
- Location: ${weatherData.location?.name || countryData.name}
- Temperature: ${weatherData.current?.temp_c}°C
- Condition: ${weatherData.current?.condition?.text}
- Feels Like: ${weatherData.current?.feelslike_c}°C
- Humidity: ${weatherData.current?.humidity}%
- Wind Speed: ${weatherData.current?.wind_kph} kph

MOVIE THEME:
- Title: ${movieData.Title}
- Genre: ${movieData.Genre}
- Plot: ${movieData.Plot}
- Director: ${movieData.Director}
- Year: ${movieData.Year}
- Poster: ${movieData.Poster}

Create a stunning, immersive weather widget that captures the essence of "${movieData.Title}" through its visual design.`;
      }
    }

    // Create a new chat using the v0 SDK
    const chat = await v0.chats.create({
      message: enhancedMessage,
    });

    // Type assertion for v0 SDK response
    const chatResponse = chat as { demo: string };

    return NextResponse.json({
      demo: chatResponse.demo,
    });
  } catch (error) {
    console.error("v0 API Error:", error);
    return NextResponse.json({ error: "Failed to create chat with v0 API" }, { status: 500 });
  }
}
