"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Calendar, MapPin, Users, Search } from "lucide-react";
import Link from "next/link";
import { EventWithPopulatedOrganizer } from "@/lib/types";

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Get public events from Convex
  const allEvents = useQuery(api.events.getPublicEvents, {
    category:
      selectedCategory && selectedCategory !== "all"
        ? selectedCategory
        : undefined,
    type:
      selectedType && selectedType !== "all"
        ? (selectedType as "online" | "in-person" | "hybrid")
        : undefined,
  });

  const categories = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "AI/Machine Learning",
    "DevOps",
    "Design",
    "Cybersecurity",
    "Blockchain",
    "Gaming",
    "IoT",
    "Cloud Computing",
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "online":
        return "🌐";
      case "in-person":
        return "📍";
      case "hybrid":
        return "🔄";
      default:
        return "📅";
    }
  };

  // Filter events based on search term (since we already filter by category/type in the query)
  const filteredEvents = (allEvents || []).filter(
    (event: EventWithPopulatedOrganizer) => {
      if (!searchTerm) return true;

      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags?.some((tag: string) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      return matchesSearch;
    }
  );

  // Show loading state
  if (allEvents === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="pt-16">
          <div className="text-center py-24">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Loading Events...
            </h2>
            <p className="text-gray-600">Discovering amazing tech events for you</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 text-white py-24 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
          </div>
          
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur-sm">
                🚀 Discover amazing tech events
              </div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-7xl bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Tech Events
              </h1>
              <p className="mt-6 text-xl leading-8 text-blue-100 max-w-2xl mx-auto">
                Connect with the community, learn from experts, and stay ahead of the curve with curated tech events
              </p>
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-6 text-sm text-blue-200">
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                    {filteredEvents.length} Live Events
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-blue-400 rounded-full mr-2"></div>
                    Multiple Formats
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-purple-400 rounded-full mr-2"></div>
                    Expert Speakers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-16 z-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1 max-w-xl">
                <div className="relative group">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    placeholder="Search events, topics, or speakers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-52 h-12 rounded-xl border-gray-200 shadow-sm">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-44 h-12 rounded-xl border-gray-200 shadow-sm">
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="online">🌐 Online</SelectItem>
                    <SelectItem value="in-person">📍 In-Person</SelectItem>
                    <SelectItem value="hybrid">🔄 Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {filteredEvents.length > 0 ? (
                  <>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {filteredEvents.length}
                    </span>{" "}
                    Events Found
                  </>
                ) : (
                  "No Events Found"
                )}
              </h2>
              {filteredEvents.length > 0 && (
                <p className="text-gray-600 text-lg">
                  Discover your next learning opportunity
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event: EventWithPopulatedOrganizer) => (
                <Card
                  key={event._id}
                  className="group overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm hover:bg-white hover:scale-[1.02] rounded-2xl"
                >
                  {/* Event Type Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary" 
                        className="bg-white/90 text-gray-700 border-0 rounded-full px-3 py-1 text-xs font-medium shadow-sm"
                      >
                        {event.category}
                      </Badge>
                      <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-lg">
                          {getEventTypeIcon(event.type)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Event Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-4 left-4 right-16">
                      <h3 className="text-white font-bold text-xl leading-tight line-clamp-2">
                        {event.title}
                      </h3>
                    </div>
                    {/* Price Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {event.price === 0 ? "Free" : `$${event.price}`}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    {/* Description */}
                    <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-3">
                      {/* Date & Time */}
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <Calendar className="h-3 w-3 text-blue-600" />
                        </div>
                        <span className="font-medium">
                          {formatDate(event.startDate)} at {formatTime(event.startDate)}
                        </span>
                      </div>

                      {/* Location */}
                      {event.type !== "online" && event.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <MapPin className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="font-medium truncate">{event.location}</span>
                        </div>
                      )}

                      {/* Attendees */}
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <Users className="h-3 w-3 text-purple-600" />
                        </div>
                        <span className="font-medium">
                          {event.registrationCount} registered
                          {event.maxAttendees && ` / ${event.maxAttendees} max`}
                        </span>
                      </div>
                    </div>

                    {/* Organizer */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        by <span className="font-medium text-gray-700">{event.organizer?.name ?? "Unknown Organizer"}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {event.tags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full">
                          {tag}
                        </Badge>
                      ))}
                      {event.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs border-gray-200 text-gray-600 rounded-full">
                          +{event.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Action Button */}
                    <Link href={`/events/${event._id}`} className="block">
                      <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-xl h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                        View Details
                        <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-20">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <div className="text-gray-400 text-6xl">🔍</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No events found
                </h3>
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                  We couldn't find any events matching your criteria. Try adjusting your filters or search terms.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="outline"
                    className="rounded-xl h-12 px-8 border-gray-200 hover:bg-gray-50"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                      setSelectedType("all");
                    }}
                  >
                    Clear All Filters
                  </Button>
                  <Button 
                    className="rounded-xl h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => window.location.reload()}
                  >
                    Refresh Events
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
