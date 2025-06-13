"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeftIcon,
  SearchIcon,
  MoreVerticalIcon,
  MailIcon,
  CheckIcon,
  XIcon,
  DownloadIcon,
  UsersIcon,
  UserCheckIcon,
  UserXIcon,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Registration } from "@/lib/types";

export default function EventAttendeesPage() {
  const params = useParams();
  const { user } = useAuth();
  const eventId = params.id as string;

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Get event details
  const event = useQuery(api.events.getEventById, {
    eventId: eventId as Id<"events">,
  });

  // Get registrations for this event
  const registrations = useQuery(api.events.getEventRegistrations, {
    eventId: eventId as Id<"events">,
  });

  // Mutation for updating registration status
  const updateRegistrationStatus = useMutation(
    api.events.updateRegistrationStatus
  );

  // Filter registrations based on search and tab
  const filteredRegistrations = (registrations || []).filter(
    (registration: Registration) => {
      const user = registration.user;
      if (!user) return false;

      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.skills?.some((skill: string) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );

      switch (activeTab) {
        case "registered":
          return matchesSearch && registration.status === "registered";
        case "attended":
          return matchesSearch && registration.status === "attended";
        case "cancelled":
          return matchesSearch && registration.status === "cancelled";
        default:
          return matchesSearch;
      }
    }
  );

  // Handle marking attendee as attended
  const handleMarkAsAttended = async (registrationId: Id<"registrations">) => {
    try {
      await updateRegistrationStatus({
        registrationId,
        status: "attended",
      });
    } catch (error) {
      console.error("Failed to mark as attended:", error);
    }
  };

  // Handle cancelling registration
  const handleCancelRegistration = async (
    registrationId: Id<"registrations">
  ) => {
    try {
      await updateRegistrationStatus({
        registrationId,
        status: "cancelled",
      });
    } catch (error) {
      console.error("Failed to cancel registration:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "registered":
        return <Badge variant="default">Registered</Badge>;
      case "attended":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Attended
          </Badge>
        );
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const exportAttendees = () => {
    const csvContent = [
      ["Name", "Email", "Company", "Location", "Status", "Registration Date"],
      ...filteredRegistrations.map((reg: Registration) => [
        reg.user?.name || "",
        reg.user?.email || "",
        reg.user?.company || "",
        reg.user?.location || "",
        reg.status,
        formatDate(reg.registeredAt),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event?.title}-attendees.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (!user || user.role !== "organizer") {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">
          Only event organizers can view attendee lists.
        </p>
      </div>
    );
  }

  if (!event || registrations === undefined) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
        <p className="text-gray-600">Loading event details...</p>
      </div>
    );
  }

  // Check if user owns this event
  if (event.organizer?._id !== user._id) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">
          You can only view attendees for your own events.
        </p>
      </div>
    );
  }

  const registeredCount = registrations.filter(
    (r: Registration) => r.status === "registered"
  ).length;
  const attendedCount = registrations.filter(
    (r: Registration) => r.status === "attended"
  ).length;
  const cancelledCount = registrations.filter(
    (r: Registration) => r.status === "cancelled"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/events">
            <Button variant="outline" size="sm">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Event Attendees
            </h1>
            <p className="text-gray-600 mt-1">{event.title}</p>
          </div>
        </div>

        <Button onClick={exportAttendees}>
          <DownloadIcon className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Event Info */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <UsersIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{registrations.length}</p>
              <p className="text-sm text-gray-600">Total Registrations</p>
            </div>
            <div className="text-center">
              <UserCheckIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{registeredCount}</p>
              <p className="text-sm text-gray-600">Registered</p>
            </div>
            <div className="text-center">
              <CheckIcon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{attendedCount}</p>
              <p className="text-sm text-gray-600">Attended</p>
            </div>
            <div className="text-center">
              <UserXIcon className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{cancelledCount}</p>
              <p className="text-sm text-gray-600">Cancelled</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search attendees by name, email, company, or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Attendees Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({registrations.length})</TabsTrigger>
          <TabsTrigger value="registered">
            Registered ({registeredCount})
          </TabsTrigger>
          <TabsTrigger value="attended">Attended ({attendedCount})</TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredRegistrations.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No attendees found
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? "No attendees match your search criteria."
                    : "No one has registered for this event yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRegistrations.map((registration: Registration) => (
                <Card
                  key={registration._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {registration.user?.name?.charAt(0).toUpperCase() ||
                              "U"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold">
                              {registration.user?.name}
                            </h3>
                            {getStatusBadge(registration.status)}
                          </div>

                          <div className="flex items-center text-sm text-gray-600 space-x-4">
                            <div className="flex items-center">
                              <MailIcon className="h-4 w-4 mr-1" />
                              {registration.user?.email}
                            </div>

                            {registration.user?.company && (
                              <div>• {registration.user.company}</div>
                            )}

                            {registration.user?.location && (
                              <div>• {registration.user.location}</div>
                            )}
                          </div>

                          {registration.user?.skills &&
                            registration.user.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {registration.user.skills
                                  .slice(0, 4)
                                  .map((skill: string) => (
                                    <Badge
                                      key={skill}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                {registration.user.skills.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{registration.user.skills.length - 4} more
                                  </Badge>
                                )}
                              </div>
                            )}

                          <p className="text-xs text-gray-500 mt-2">
                            Registered {formatDate(registration.registeredAt)}
                          </p>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              window.open(`mailto:${registration.user?.email}`)
                            }
                          >
                            <MailIcon className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>

                          {registration.status === "registered" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleMarkAsAttended(
                                  registration._id as Id<"registrations">
                                )
                              }
                            >
                              <CheckIcon className="h-4 w-4 mr-2" />
                              Mark as Attended
                            </DropdownMenuItem>
                          )}

                          {registration.status !== "cancelled" && (
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() =>
                                handleCancelRegistration(
                                  registration._id as Id<"registrations">
                                )
                              }
                            >
                              <XIcon className="h-4 w-4 mr-2" />
                              Cancel Registration
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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
