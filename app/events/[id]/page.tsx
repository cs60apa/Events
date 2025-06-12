"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Globe,
  Share,
  Heart,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Registration, Speaker, Opportunity, AgendaItem } from "@/lib/types";

export default function EventDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const eventId = params.id as string;

  // Get event details from Convex
  const event = useQuery(api.events.getEventById, {
    eventId: eventId as Id<"events">,
  });

  // Check if user is already registered
  const userRegistrations = useQuery(
    api.events.getEventRegistrations,
    event ? { eventId: event._id } : "skip"
  );

  const isRegistered =
    userRegistrations?.some(
      (reg: Registration) =>
        reg.userId === user?._id && reg.status !== "cancelled"
    ) || false;

  // Mutation for registering to event
  const registerForEvent = useMutation(api.events.registerForEvent);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
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
        return <Globe className="h-5 w-5" />;
      case "in-person":
        return <MapPin className="h-5 w-5" />;
      case "hybrid":
        return <Globe className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  const handleRegister = async () => {
    if (!user) {
      // Redirect to sign in
      window.location.href = "/auth/signin";
      return;
    }

    if (!event) return;

    setIsLoading(true);
    try {
      await registerForEvent({
        eventId: event._id,
        userId: user._id as Id<"users">,
      });
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Loading...
            </h2>
            <p className="text-gray-600">Loading event details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const spotsRemaining = event.maxAttendees
    ? event.maxAttendees - event.registrationCount
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-16">
        {/* Hero Section */}
        <section className="bg-white border-b">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <Badge variant="secondary" className="mb-4">
                    {event.category}
                  </Badge>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {event.title}
                  </h1>

                  {/* Event Meta */}
                  <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {formatTime(event.startDate)} -{" "}
                        {formatTime(event.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getEventTypeIcon(event.type)}
                      <span className="capitalize">{event.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{event.registrationCount} attending</span>
                    </div>
                  </div>

                  {/* Location */}
                  {event.location && (
                    <div className="flex items-start gap-2 text-sm text-gray-600 mb-6">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <span>{event.location}</span>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {event.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Description */}
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      About this event
                    </h3>
                    <div className="text-gray-700 whitespace-pre-line">
                      {event.description}
                    </div>
                  </div>

                  {/* Requirements */}
                  {event.requirements && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Requirements
                      </h3>
                      <p className="text-gray-700">{event.requirements}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Registration Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl">
                          {event.price === 0 ? "Free" : `$${event.price}`}
                        </CardTitle>
                        {spotsRemaining &&
                          spotsRemaining <= 10 &&
                          spotsRemaining > 0 && (
                            <CardDescription className="text-orange-600">
                              Only {spotsRemaining} spots left!
                            </CardDescription>
                          )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user ? (
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleRegister}
                        disabled={isLoading || isRegistered}
                      >
                        {isLoading
                          ? "Registering..."
                          : isRegistered
                          ? "Registered ✓"
                          : "Register Now"}
                      </Button>
                    ) : (
                      <Link href="/auth/signup">
                        <Button className="w-full" size="lg">
                          Sign up to Register
                        </Button>
                      </Link>
                    )}

                    <Button variant="outline" className="w-full" size="lg">
                      <Share className="h-4 w-4 mr-2" />
                      Share Event
                    </Button>

                    <div className="text-sm text-gray-600 text-center">
                      {event.registrationCount} people registered
                    </div>
                  </CardContent>
                </Card>

                {/* Organizer Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Organized by</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {event.organizer.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {event.organizer.company}
                        </p>
                        <p className="text-sm text-gray-700 mt-2">
                          {event.organizer.bio}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Speakers Section */}
        {event.speakers && event.speakers.length > 0 && (
          <section className="py-12 bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Speakers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.speakers.map((speaker: Speaker, index: number) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-8 w-8 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {speaker.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {speaker.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {speaker.company}
                          </p>
                          <p className="text-sm text-gray-700 mt-2">
                            {speaker.bio}
                          </p>
                          <div className="mt-3">
                            <Badge variant="outline">{speaker.topic}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Agenda Section */}
        {event.agenda && event.agenda.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Agenda</h2>
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {event.agenda.map((item: any, index: number) => (
                      <div key={index} className="p-6 flex items-start gap-4">
                        <div className="text-sm font-medium text-gray-900 w-20">
                          {item.time}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {item.topic}
                          </h3>
                          {item.speaker && (
                            <p className="text-sm text-gray-600">
                              by {item.speaker}
                            </p>
                          )}
                          {item.duration && (
                            <p className="text-sm text-gray-500">
                              {item.duration} minutes
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Opportunities Section */}
        {event.opportunities && event.opportunities.length > 0 && (
          <section className="py-12 bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Opportunities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.opportunities.map((opportunity: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {opportunity.title}
                        </CardTitle>
                        <Badge variant="secondary" className="capitalize">
                          {opportunity.type}
                        </Badge>
                      </div>
                      <CardDescription>{opportunity.company}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">
                        {opportunity.description}
                      </p>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
