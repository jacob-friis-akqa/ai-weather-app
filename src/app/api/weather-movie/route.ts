import { type NextRequest, NextResponse } from "next/server";
import { getWeather } from "../get-weather";
import { getMovie } from "../get-movie";
import { getCountryAndMovieObject } from "@/lib/get-country-and-movie";

export async function POST(request: NextRequest) {
  try {
    const { location } = await request.json();

    if (!location) {
      return NextResponse.json({ error: "Location is required" }, { status: 400 });
    }

    // Normalize the location to lowercase for country lookup
    const normalizedLocation = location.toLowerCase().trim();

    // Get country and movie data
    const countryData = await getCountryAndMovieObject(normalizedLocation);

    if (!countryData) {
      return NextResponse.json(
        {
          error: "Country/location not found in our database",
        },
        { status: 404 }
      );
    }

    // Get weather data using the appropriate weather query
    const weatherData = await getWeather(countryData.weatherQuery);

    // Get movie data using the IMDB ID
    const movieData = await getMovie(countryData.movie.imdbID);

    return NextResponse.json({
      weather: weatherData,
      movie: movieData,
      country: {
        name: location,
        capital: countryData.capital,
        weatherQuery: countryData.weatherQuery,
      },
    });
  } catch (error) {
    console.error("Weather-Movie API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch weather and movie data",
      },
      { status: 500 }
    );
  }
}
