"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ClockIcon,
  EditIcon,
  TrashIcon,
  ArrowLeftIcon,
  ExternalLinkIcon,
  ShareIcon,
  DownloadIcon,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const eventId = params.id as string;

  // Get event data
  const event = useQuery(api.events.getEventById, {
    eventId: eventId as Id<"events">,
  });

  // Get registrations for this event
  const registrations = useQuery(api.events.getEventRegistrations, {
    eventId: eventId as Id<"events">,
  });

  const deleteEvent = useMutation(api.events.deleteEvent);
  const updateEventStatus = useMutation(api.events.updateEvent);

  const handleDeleteEvent = async () => {
    if (
      confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      try {
        await deleteEvent({ eventId: eventId as Id<"events"> });
        router.push("/dashboard/events");
      } catch (error) {
        console.error("Failed to delete event:", error);
        alert("Failed to delete event. Please try again.");
      }
    }
  };

  const handleStatusToggle = async () => {
    if (!event) return;
    
    const newStatus = event.status === "published" ? "draft" : "published";
    try {
      await updateEventStatus({
        eventId: eventId as Id<"events">,
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to update event status:", error);
      alert("Failed to update event status. Please try again.");
    }
  };

  const getStatusBadge = (status: string, startDate: string) => {
    const isPast = new Date(startDate) < new Date();

    if (isPast) {
      return <Badge variant="secondary">Past</Badge>;
    }

    switch (status) {
      case "published":
        return <Badge variant="default">Published</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!user || user.role !== "organizer") {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">
          Only organizers can access the events management dashboard.
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
        <p className="text-gray-600">Fetching event details...</p>
      </div>
    );
  }

  // Check if the current user is the organizer of this event
  if (event.organizer !== user._id) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">
          You can only view events that you have created.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/events">
            <Button variant="ghost" size="sm">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            <div className="flex items-center space-x-2 mt-2">
              {getStatusBadge(event.status, event.startDate)}
              <Badge variant="secondary">{event.category}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleStatusToggle}
          >
            {event.status === "published" ? "Unpublish" : "Publish"}
          </Button>
          <Link href={`/dashboard/events/${eventId}/edit`}>
            <Button variant="outline" size="sm">
              <EditIcon className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteEvent}
            className="text-red-600 hover:text-red-700"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Event Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>

              {event.requirements && (
                <div>
                  <h3 className="font-semibold mb-2">Requirements</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {event.requirements}
                  </p>
                </div>
              )}

              {event.tags && event.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attendees */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Attendees</span>
                <Link href={`/dashboard/events/${eventId}/attendees`}>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {registrations?.length || 0} registered attendees
                </p>
                <Link
                  href={`/dashboard/events/${eventId}/attendees`}
                  className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
                >
                  Manage attendees →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Info */}
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Start Date</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(event.startDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">End Date</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(event.endDate)}
                  </p>
                </div>
              </div>

              {event.type === "in-person" && event.location && (
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-gray-600">{event.location}</p>
                  </div>
                </div>
              )}

              {(event.type === "online" || event.type === "hybrid") &&
                event.virtualLink && (
                  <div className="flex items-center space-x-3">
                    <ExternalLinkIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Virtual Link</p>
                      <a
                        href={event.virtualLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Join Meeting
                      </a>
                    </div>
                  </div>
                )}

              {event.maxAttendees && (
                <div className="flex items-center space-x-3">
                  <UsersIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Capacity</p>
                    <p className="text-sm text-gray-600">
                      {event.registrationCount || 0} / {event.maxAttendees}{" "}
                      registered
                    </p>
                  </div>
                </div>
              )}

              {event.price && (
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 text-gray-400 flex items-center justify-center text-sm font-bold">
                    $
                  </div>
                  <div>
                    <p className="font-medium">Price</p>
                    <p className="text-sm text-gray-600">
                      {event.currency} {event.price}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {event.status === "published" && (
                <>
                  <Button variant="outline" className="w-full" size="sm">
                    <ShareIcon className="h-4 w-4 mr-2" />
                    Share Event
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Export Attendees
                  </Button>
                </>
              )}
              <Link href={`/events/${eventId}`} className="block">
                <Button variant="outline" className="w-full" size="sm">
                  <ExternalLinkIcon className="h-4 w-4 mr-2" />
                  View Public Page
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
