"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin, Film, Cloud } from "lucide-react";

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
  const [chatUrl, setChatUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [hasWidget, setHasWidget] = useState(false);

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

      // Then, generate the v0 widget with this data
      const v0Response = await fetch("/api/v0-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: hasWidget ? `Update styling for ${location}` : `Create a movie-themed weather widget for ${location}`,
          weatherData: weather,
          movieData: movie,
          countryData: country,
          isStyleUpdate: hasWidget,
        }),
      });

      if (!v0Response.ok) {
        throw new Error(`v0 API error! status: ${v0Response.status}`);
      }

      const v0Data = await v0Response.json();
      setChatUrl(v0Data.demo);
      setHasWidget(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const clearWidget = () => {
    setChatUrl("");
    setWeatherData(null);
    setMovieData(null);
    setCountryData(null);
    setHasWidget(false);
    setLocation("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Cloud className="w-8 h-8 text-white" />
            </div>
            <Film className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">CineWeather</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Discover weather with a cinematic twist. Each location brings its own movie magic to your forecast.</p>
        </div>

        {/* Search Interface */}
        <Card className="max-w-2xl mx-auto mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
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

              {hasWidget && (
                <div className="flex justify-center">
                  <button type="button" onClick={clearWidget} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                    Start Over
                  </button>
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
          </CardContent>
        </Card>

        {/* Data Preview Cards */}
        {(weatherData || movieData || countryData) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
            {weatherData && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
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
            )}

            {movieData && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
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
            )}

            {countryData && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
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
            )}
          </div>
        )}

        {/* Generated Widget */}
        {chatUrl && (
          <Card className="max-w-7xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{movieData ? `${movieData.Title} Weather Experience` : "Your Cinematic Weather Widget"}</CardTitle>
              <CardDescription className="text-lg">Immerse yourself in the atmosphere of {countryData?.name || location}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-b-lg overflow-hidden">
                <iframe src={chatUrl} className="w-full h-[900px] border-0" title="CineWeather Widget" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        {!chatUrl && (
          <div className="text-center mt-16 text-gray-500">
            <p className="text-lg">Ready to explore weather through the lens of cinema?</p>
            <p className="text-sm mt-2">Enter a location above to begin your journey.</p>
          </div>
        )}
      </div>
    </div>
  );
}
