"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  MoreVerticalIcon,
  PlusIcon,
  SearchIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CopyIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: "online" | "in-person" | "hybrid";
  location?: string;
  virtualLink?: string;
  status: "draft" | "published" | "cancelled";
  category: string;
  maxAttendees?: number;
  registrationCount: number;
  attendeeCount: number;
  isPublic: boolean;
  imageUrl?: string;
}

export default function EventsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Get events for the current organizer
  const events = useQuery(
    api.events.getEventsByOrganizer,
    user ? { organizerId: user._id as Id<"users"> } : "skip"
  );

  const deleteEvent = useMutation(api.events.deleteEvent);
  const updateEvent = useMutation(api.events.updateEvent);

  // Filter events based on search and tab
  const filteredEvents =
    events?.filter((event: Event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());

      switch (activeTab) {
        case "published":
          return matchesSearch && event.status === "published";
        case "draft":
          return matchesSearch && event.status === "draft";
        case "past":
          return matchesSearch && new Date(event.endDate) < new Date();
        default:
          return matchesSearch;
      }
    }) || [];

  const handleDeleteEvent = async (eventId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      try {
        await deleteEvent({ eventId: eventId as Id<"events"> });
      } catch (error) {
        console.error("Failed to delete event:", error);
        alert("Failed to delete event. Please try again.");
      }
    }
  };

  const handleToggleStatus = async (eventId: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    try {
      await updateEvent({
        eventId: eventId as Id<"events">,
        status: newStatus as "draft" | "published" | "cancelled",
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
          <p className="text-gray-600 mt-1">Manage your tech meetup events</p>
        </div>
        <Link href="/dashboard/events/create">
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold">{events?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <EyeIcon className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold">
                  {events?.filter((e: Event) => e.status === "published")
                    .length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PencilIcon className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Drafts</p>
                <p className="text-2xl font-bold">
                  {events?.filter((e: Event) => e.status === "draft").length ||
                    0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UsersIcon className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Total Registrations</p>
                <p className="text-2xl font-bold">
                  {events?.reduce(
                    (sum: number, e: Event) => sum + e.registrationCount,
                    0
                  ) || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Events Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredEvents.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No events found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm
                    ? "No events match your search criteria."
                    : "You haven't created any events yet."}
                </p>
                {!searchTerm && (
                  <Link href="/dashboard/events/create">
                    <Button>Create Your First Event</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map((event: Event) => (
                <Card
                  key={event._id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(event.status, event.startDate)}
                          <Badge variant="outline">{event.type}</Badge>
                        </div>
                        <CardTitle className="text-lg line-clamp-2">
                          {event.title}
                        </CardTitle>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/events/${event._id}`)}
                          >
                            <EyeIcon className="h-4 w-4 mr-2" />
                            View Event
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/dashboard/events/${event._id}/edit`)
                            }
                          >
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Edit Event
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/dashboard/events/${event._id}/attendees`
                              )
                            }
                          >
                            <UsersIcon className="h-4 w-4 mr-2" />
                            View Attendees ({event.registrationCount})
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleToggleStatus(event._id, event.status)
                            }
                          >
                            {event.status === "published" ? (
                              <>
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Make Draft
                              </>
                            ) : (
                              <>
                                <EyeIcon className="h-4 w-4 mr-2" />
                                Publish
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigator.clipboard.writeText(
                                `${window.location.origin}/events/${event._id}`
                              )
                            }
                          >
                            <CopyIcon className="h-4 w-4 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteEvent(event._id)}
                            className="text-red-600"
                          >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {formatDate(event.startDate)}
                      </div>

                      {event.type !== "online" && event.location && (
                        <div className="flex items-center text-gray-600">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          {event.location}
                        </div>
                      )}

                      <div className="flex items-center text-gray-600">
                        <UsersIcon className="h-4 w-4 mr-2" />
                        {event.registrationCount} registered
                        {event.maxAttendees && ` / ${event.maxAttendees} max`}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary">{event.category}</Badge>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/events/${event._id}`)}
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/dashboard/events/${event._id}/edit`)
                            }
                          >
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
