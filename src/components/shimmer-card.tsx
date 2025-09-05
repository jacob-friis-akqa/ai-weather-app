import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ReactNode } from "react";

interface ShimmerWrapperProps {
  isLoading: boolean;
  children: ReactNode;
  className?: string;
}

export function ShimmerWrapper({ isLoading, children, className = "" }: ShimmerWrapperProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
      {isLoading && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer bg-[length:200%_100%] rounded-lg" />}
    </div>
  );
}

// Keep the old component for backwards compatibility if needed
export function ShimmerCard() {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm animate-pulse">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-300 rounded"></div>
          <div className="h-5 bg-gray-300 rounded w-24"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-300 rounded w-16"></div>
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-300 rounded w-20"></div>
          <div className="h-6 bg-gray-300 rounded w-12"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-300 rounded w-16"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-300 rounded w-18"></div>
          <div className="h-4 bg-gray-300 rounded w-12"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-300 rounded w-16"></div>
          <div className="h-4 bg-gray-300 rounded w-8"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-300 rounded w-12"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
      </CardContent>
    </Card>
  );
}
