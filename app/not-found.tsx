"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search, Calendar } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <Search className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            404
          </CardTitle>
          <p className="text-lg text-gray-600">Page Not Found</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-gray-500">
              Sorry, we couldn't find the page you're looking for.
            </p>
            <p className="text-sm text-gray-400">
              The page might have been moved, deleted, or you entered the wrong
              URL.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/" className="block">
              <Button className="w-full" size="lg">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </Link>

            <Link href="/events" className="block">
              <Button variant="outline" className="w-full" size="lg">
                <Calendar className="mr-2 h-4 w-4" />
                Browse Events
              </Button>
            </Link>

            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-400">
              If you believe this is an error, please{" "}
              <Link href="/contact" className="text-blue-600 hover:underline">
                contact support
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
