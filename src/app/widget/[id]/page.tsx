"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Share2 } from "lucide-react";
import Link from "next/link";

interface WidgetData {
  id: string;
  location: string;
  demoUrl: string;
  weatherData: {
    location: { name: string };
    current: { temp_c: number; condition: { text: string }; humidity: number };
  };
  movieData: {
    Title: string;
    Genre: string;
    Director: string;
    Year: string;
  };
  countryData: {
    name: string;
    capital: string;
    weatherQuery: string;
  };
  createdAt: string;
}

export default function WidgetPage() {
  const params = useParams();
  const [widgetData, setWidgetData] = useState<WidgetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWidget = async () => {
      try {
        const response = await fetch(`/api/widget/${params.id}`);
        if (!response.ok) {
          throw new Error("Widget not found");
        }
        const data = await response.json();
        setWidgetData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load widget");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      loadWidget();
    }
  }, [params.id]);

  const shareWidget = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: `CineWeather - ${widgetData?.location}`,
        text: `Check out this movie-themed weather widget for ${widgetData?.location}!`,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg text-gray-600">Loading your cinematic weather experience...</p>
        </div>
      </div>
    );
  }

  if (error || !widgetData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Widget Not Found</CardTitle>
            <CardDescription>{error || "The requested widget could not be found."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to CineWeather
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <iframe src={widgetData.demoUrl} className="w-full h-screen border-0" title={`${widgetData.location} Weather Widget`} />
    </div>
  );
}
