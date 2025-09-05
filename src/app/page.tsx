import { WeatherCard } from "@/components/weather-card";

export default function Home() {
  const sampleData = {
    location: "San Francisco, CA",
    unit: "C" as const,
    temperature: 22,
    condition: "Partly cloudy",
    high: 25,
    low: 18,
    humidity: 0.65,
    windKph: 15,
  };

  return (
    <section className="flex justify-center items-center h-screen">
      <WeatherCard data={sampleData} />
    </section>
  );
}
