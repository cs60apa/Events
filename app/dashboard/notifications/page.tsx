"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BellIcon,
  CalendarIcon,
  InfoIcon,
  AlertTriangleIcon,
  CheckIcon,
  XIcon,
  MailIcon,
  CheckCheckIcon,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

// Remove custom interface since we'll use Convex generated types

// Type for notification with optional related event
type NotificationWithEvent = {
  _id: string;
  title: string;
  message: string;
  type:
    | "event_update"
    | "event_reminder"
    | "event_cancelled"
    | "registration_confirmed"
    | "new_opportunity";
  isRead: boolean;
  createdAt: string;
  relatedEventId?: string;
  relatedEvent?: {
    _id: string;
    title: string;
    startDate: string;
  };
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  // Get user notifications from Convex
  const notifications = useQuery(
    api.notifications.getUserNotifications,
    user ? { userId: user._id as Id<"users"> } : "skip"
  ) as NotificationWithEvent[] | undefined;

  // Get unread count
  const unreadCount = useQuery(
    api.notifications.getUnreadNotificationCount,
    user ? { userId: user._id as Id<"users"> } : "skip"
  );

  // Mutations for notification actions
  const markAsRead = useMutation(api.notifications.markNotificationAsRead);
  const markAllAsRead = useMutation(
    api.notifications.markAllNotificationsAsRead
  );
  const deleteNotification = useMutation(api.notifications.deleteNotification);

  // Filter notifications based on tab
  const filteredNotifications = (notifications || []).filter((notification) => {
    switch (activeTab) {
      case "unread":
        return !notification.isRead;
      case "events":
        return ["event_update", "event_reminder", "event_cancelled"].includes(
          notification.type
        );
      case "registrations":
        return notification.type === "registration_confirmed";
      default:
        return true;
    }
  });

  // Handle notification actions
  const handleMarkAsRead = async (notificationId: Id<"notifications">) => {
    try {
      await markAsRead({ notificationId });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    try {
      await markAllAsRead({ userId: user._id as Id<"users"> });
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleDeleteNotification = async (
    notificationId: Id<"notifications">
  ) => {
    try {
      await deleteNotification({ notificationId });
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "event_update":
        return <InfoIcon className="h-5 w-5 text-blue-500" />;
      case "event_reminder":
        return <BellIcon className="h-5 w-5 text-orange-500" />;
      case "event_cancelled":
        return <AlertTriangleIcon className="h-5 w-5 text-red-500" />;
      case "registration_confirmed":
        return <CheckIcon className="h-5 w-5 text-green-500" />;
      case "new_opportunity":
        return <CalendarIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "event_update":
        return <Badge variant="default">Update</Badge>;
      case "event_reminder":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            Reminder
          </Badge>
        );
      case "event_cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "registration_confirmed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Confirmed
          </Badge>
        );
      case "new_opportunity":
        return <Badge variant="outline">Opportunity</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
        <p className="text-gray-600">Loading your notifications...</p>
      </div>
    );
  }

  if (notifications === undefined) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
        <p className="text-gray-600">Loading your notifications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            Stay updated with your events and activities
          </p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={!unreadCount || unreadCount === 0}
          >
            <CheckCheckIcon className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BellIcon className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">
                  {notifications?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MailIcon className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold">{unreadCount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Events</p>
                <p className="text-2xl font-bold">
                  {notifications?.filter((n) =>
                    [
                      "event_update",
                      "event_reminder",
                      "event_cancelled",
                    ].includes(n.type)
                  ).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckIcon className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Registrations</p>
                <p className="text-2xl font-bold">
                  {notifications?.filter(
                    (n) => n.type === "registration_confirmed"
                  ).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            All ({notifications?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount || 0})</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No notifications
                </h3>
                <p className="text-gray-600">
                  {activeTab === "unread"
                    ? "You're all caught up!"
                    : "No notifications found."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification._id}
                  className={`hover:shadow-md transition-shadow ${
                    !notification.isRead
                      ? "border-l-4 border-l-blue-500 bg-blue-50/30"
                      : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {getNotificationIcon(notification.type)}

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3
                              className={`font-semibold ${
                                !notification.isRead ? "font-bold" : ""
                              }`}
                            >
                              {notification.title}
                            </h3>
                            {getNotificationBadge(notification.type)}
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>

                          <p className="text-gray-600 mb-3">
                            {notification.message}
                          </p>

                          {notification.relatedEvent && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                              <div className="flex items-center space-x-2">
                                <CalendarIcon className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium">
                                  {notification.relatedEvent.title}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(
                                  notification.relatedEvent.startDate
                                )}
                              </p>
                            </div>
                          )}

                          <p className="text-xs text-gray-500">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        {notification.relatedEvent && (
                          <Link
                            href={`/events/${notification.relatedEvent._id}`}
                          >
                            <Button variant="outline" size="sm">
                              View Event
                            </Button>
                          </Link>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleMarkAsRead(
                              notification._id as Id<"notifications">
                            )
                          }
                          disabled={notification.isRead}
                        >
                          {notification.isRead ? (
                            <MailIcon className="h-4 w-4" />
                          ) : (
                            <CheckIcon className="h-4 w-4" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDeleteNotification(
                              notification._id as Id<"notifications">
                            )
                          }
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
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
