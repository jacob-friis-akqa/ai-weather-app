"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin, Film, Cloud, ExternalLink, Share2 } from "lucide-react";
import { ShimmerWrapper } from "@/components/shimmer-card";
import Link from "next/link";

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
  };
}

interface MovieData {
  Title: string;
  Year: string;
  Genre: string;
  Director: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
}

interface CountryData {
  name: string;
  capital: string;
  weatherQuery: string;
}

export default function WeatherApp() {
  const [location, setLocation] = useState("");
  const [widgetId, setWidgetId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [hasWidget, setHasWidget] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Cycling loading messages
  useEffect(() => {
    const weatherMessages = [
      "Gathering storm clouds of creativity... ⛈️",
      "Checking the forecast for movie magic... 🌤️",
      "Brewing up some cinematic atmosphere... 🌪️",
      "Waiting for the perfect weather scene... ❄️",
      "Summoning movie winds from distant lands... 🌬️",
      "Painting the sky with film colors... 🌅",
      "Collecting raindrops of inspiration... 🌧️",
      "Consulting with the weather wizards... ⚡",
      "Mixing sunshine with silver screen magic... ☀️",
      "Capturing lightning in a movie bottle... 🌩️",
    ];

    if (isLoading) {
      setLoadingMessage(weatherMessages[0]);
      const interval = setInterval(() => {
        setLoadingMessage((prev) => {
          const currentIndex = weatherMessages.indexOf(prev);
          return weatherMessages[(currentIndex + 1) % weatherMessages.length];
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      // First, get the weather and movie data
      const weatherMovieResponse = await fetch("/api/weather-movie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location }),
      });

      if (!weatherMovieResponse.ok) {
        const errorData = await weatherMovieResponse.json();
        throw new Error(errorData.error || `HTTP error! status: ${weatherMovieResponse.status}`);
      }

      const { weather, movie, country } = await weatherMovieResponse.json();

      setWeatherData(weather);
      setMovieData(movie);
      setCountryData(country);

      // For updates, only change colors and data, not layout
      const isStyleUpdate = hasWidget;
      const message = isStyleUpdate
        ? `Update the colors, theme, and data for this existing weather widget. Change the location to ${location}, update the weather data, and apply the color scheme and styling of "${movie.Title}" (${movie.Genre}). Keep the exact same layout and structure - only update colors, fonts, background, and the displayed data.`
        : `Create a movie-themed weather widget for ${location}`;

      // Then, generate the v0 widget with this data
      const v0Response = await fetch("/api/v0-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          weatherData: weather,
          movieData: movie,
          countryData: country,
          isStyleUpdate,
        }),
      });

      if (!v0Response.ok) {
        throw new Error(`v0 API error! status: ${v0Response.status}`);
      }

      const v0Data = await v0Response.json();

      // Always create a new widget record for both initial creation and updates
      const widgetResponse = await fetch("/api/widget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location,
          demoUrl: v0Data.demo,
          weatherData: weather,
          movieData: movie,
          countryData: country,
        }),
      });

      if (widgetResponse.ok) {
        const { id } = await widgetResponse.json();
        setWidgetId(id);
        // Automatically open the widget in a new tab
        window.open(`/widget/${id}`, "_blank");
      }

      setHasWidget(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const clearWidget = () => {
    setWeatherData(null);
    setMovieData(null);
    setCountryData(null);
    setHasWidget(false);
    setWidgetId("");
    setLocation("");
  };

  const shareWidget = async () => {
    if (!widgetId) return;

    const url = `${window.location.origin}/widget/${widgetId}`;
    if (navigator.share) {
      await navigator.share({
        title: `CineWeather - ${location}`,
        text: `Check out this movie-themed weather widget for ${location}!`,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Widget link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto px-4 py-8 h-screen grid grid-rows-3 gap-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Cloud className="w-8 h-8 text-white" />
            </div>
            <Film className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">CineWeather</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mx-auto">Discover weather with a cinematic twist. Each location brings its own movie magic to your forecast.</p>
        </div>

        {/* Search Interface */}
        <Card className="w-[60%] mx-auto mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <MapPin className="w-6 h-6 text-blue-600" />
              {hasWidget ? "Change Location" : "Enter Your Location"}
            </CardTitle>
            <CardDescription className="text-lg">{hasWidget ? "Try a new location to see a different movie theme" : "Enter any country or city to begin your cinematic weather journey"}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-3">
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., France, Tokyo, New York, Brazil..."
                  className="flex-1 px-4 py-3 text-lg border border-gray-300 rounded-xl bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !location.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {hasWidget ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{hasWidget ? "Update Theme" : "Create Widget"}</>
                  )}
                </button>
              </div>

              {hasWidget && !isLoading && (
                <div className="flex justify-between gap-4">
                  <button type="button" onClick={clearWidget} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                    Start Over
                  </button>

                  {widgetId && (
                    <div className="flex items-center gap-2">
                      <Link target="_blank" href={`/widget/${widgetId}`} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        <ExternalLink className="w-4 h-4" />
                        View Widget
                      </Link>

                      <button onClick={shareWidget} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  )}
                </div>
              )}
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-center">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}

            {isLoading && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <p className="text-blue-700 font-medium animate-pulse">{loadingMessage}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Preview Cards */}
        {(isLoading || weatherData || movieData || countryData) && (
          <div className="grid grid-cols-1 md:grid-cols-3 w-[80%] gap-6 mx-auto mb-8">
            {weatherData && (
              <ShimmerWrapper isLoading={isLoading}>
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm opacity-40">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Cloud className="w-5 h-5 text-blue-600" />
                      Current Weather
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <strong>Location:</strong>
                      <span>{weatherData.location.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>Temperature:</strong>
                      <span className="text-lg font-bold text-blue-600">{weatherData.current.temp_c}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>Condition:</strong>
                      <span>{weatherData.current.condition.text}</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>Feels Like:</strong>
                      <span>{weatherData.current.feelslike_c}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>Humidity:</strong>
                      <span>{weatherData.current.humidity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>Wind:</strong>
                      <span>{weatherData.current.wind_kph} kph</span>
                    </div>
                  </CardContent>
                </Card>
              </ShimmerWrapper>
            )}

            {movieData && (
              <ShimmerWrapper isLoading={isLoading}>
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full opacity-40">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Film className="w-5 h-5 text-purple-600" />
                      Movie Theme
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <strong>Title:</strong>
                      <span className="text-right font-semibold">{movieData.Title}</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>Year:</strong>
                      <span>{movieData.Year}</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>Genre:</strong>
                      <span className="text-purple-600 font-medium">{movieData.Genre}</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>Director:</strong>
                      <span className="text-right">{movieData.Director}</span>
                    </div>
                    {movieData.imdbRating && (
                      <div className="flex justify-between">
                        <strong>Rating:</strong>
                        <span className="font-bold text-yellow-600">{movieData.imdbRating}/10</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </ShimmerWrapper>
            )}

            {countryData && (
              <ShimmerWrapper isLoading={isLoading}>
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full opacity-40">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-600" />
                      Location Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <strong>Country:</strong>
                      <span className="capitalize font-semibold">{countryData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>Capital:</strong>
                      <span>{countryData.capital}</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>Weather Source:</strong>
                      <span className="text-green-600">{countryData.weatherQuery}</span>
                    </div>
                  </CardContent>
                </Card>
              </ShimmerWrapper>
            )}
          </div>
        )}

        {/* Footer */}
        {!widgetId && !isLoading && (
          <div className="text-center mt-16 text-gray-500">
            <p className="text-lg">Ready to explore weather through the lens of cinema?</p>
            <p className="text-sm mt-2">Enter a location above to begin your journey.</p>
          </div>
        )}
      </div>
    </div>
  );
}
