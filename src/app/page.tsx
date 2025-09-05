"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

import { getCountryAndMovieObject } from "@/lib/get-country-and-movie";
import { getWeather } from "./api/get-weather";
import { getMovie } from "./api/get-movie";

export default function V0ApiPoc() {
  const [prompt, setPrompt] = useState("");
  const [chatUrl, setChatUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError("");
    setChatUrl("");

    try {
      const response = await fetch("/api/v0-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setChatUrl(data.demo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto space-y-6 grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>v0 Platform API POC</CardTitle>
            <CardDescription>Enter a prompt to generate code using the v0 Platform API</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., Create a responsive navbar with Tailwind CSS" className="flex-1" disabled={isLoading} />
              <button type="submit" disabled={isLoading || !prompt.trim()} className="bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-400 disabled:text-slate-200">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-destructive text-sm">Error: {error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {chatUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Code</CardTitle>
              <CardDescription>Live preview of your generated component</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <iframe src={chatUrl} className="w-full h-[600px] border-0 rounded-b-lg" title="v0 Generated Code" />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
