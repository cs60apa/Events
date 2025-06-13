"use client";

import { useAuth } from "@/providers/auth-provider";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, TrendingUp, Plus, Eye } from "lucide-react";
import Link from "next/link";
import { Event, EventWithPopulatedOrganizer } from "@/lib/types";

export default function DashboardPage() {
  const { user } = useAuth();

  // Get user stats from Convex
  const userStats = useQuery(
    api.users.getUserStats,
    user ? { userId: user._id as Id<"users"> } : "skip"
  );

  // Get user's events
  const userEvents = useQuery(
    api.events.getEventsByOrganizer,
    user?.role === "organizer"
      ? { organizerId: user._id as Id<"users"> }
      : "skip"
  );

  // Get upcoming events for display
  const upcomingEvents = useQuery(api.events.getUpcomingEvents, { limit: 3 });

  if (user?.role === "organizer") {
    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name ?? "User"}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Here&apos;s what&apos;s happening with your events today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Events
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userEvents?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Events organized</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Attendees
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userEvents?.reduce(
                  (sum: number, event: Event) =>
                    sum + (event.registrationCount || 0),
                  0
                ) || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Total registrations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Events
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userEvents?.filter(
                  (event: Event) => new Date(event.startDate) > new Date()
                ).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Next event in 3 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {userEvents?.reduce(
                  (sum: number, event: Event) =>
                    sum + (event.price || 0) * (event.registrationCount || 0),
                  0
                ) || 0}
              </div>
              <p className="text-xs text-muted-foreground">Total revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard/events/create">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Event
                </Button>
              </Link>
              <Link href="/dashboard/events">
                <Button variant="outline" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  View All Events
                </Button>
              </Link>
              <Link href="/dashboard/attendees">
                <Button variant="outline" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Manage Attendees
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle>Your Events</CardTitle>
            <CardDescription>
              Recent and upcoming events you&apos;re organizing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents?.map((event: EventWithPopulatedOrganizer) => (
                <div
                  key={event._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(event.startDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-gray-400">
                      by {event.organizer?.name ?? "Unknown Organizer"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                      {event.registrationCount} attendees
                    </div>
                    <Badge
                      variant={
                        event.status === "published" ? "default" : "secondary"
                      }
                    >
                      {event.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Attendee Dashboard
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name ?? "User"}! 👋
        </h1>
        <p className="mt-2 text-gray-600">
          Discover new events and connect with the tech community.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Events Attended
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats?.eventsAttended || 0}
            </div>
            <p className="text-xs text-muted-foreground">Completed events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Registered Events
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats?.eventsRegistered || 0}
            </div>
            <p className="text-xs text-muted-foreground">Upcoming events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats?.totalEvents || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              All time participation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Learning Journey
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Growing!</div>
            <p className="text-xs text-muted-foreground">
              {" "}
              Keep attending events
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Explore Events</CardTitle>
          <CardDescription>
            Find new events and expand your network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Link href="/events">
              <Button className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Browse Events
              </Button>
            </Link>
            <Link href="/dashboard/events">
              <Button variant="outline" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                My Registrations
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Update Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Your Upcoming Events</CardTitle>
          <CardDescription>Events you&apos;re registered for</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents
              ?.slice(0, 2)
              .map((event: EventWithPopulatedOrganizer) => (
                <div
                  key={event._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>{" "}
                    <p className="text-sm text-gray-500">
                      {new Date(event.startDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                      {event.registrationCount} attending
                    </div>
                    <Badge variant="default">Registered</Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
