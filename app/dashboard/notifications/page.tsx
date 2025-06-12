"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
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
  Trash2Icon,
  CheckCheckIcon
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "event_update" | "event_reminder" | "event_cancelled" | "registration_confirmed" | "new_opportunity";
  isRead: boolean;
  createdAt: string;
  relatedEventId?: string;
  relatedEvent?: {
    _id: string;
    title: string;
    startDate: string;
  };
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  // Mock notifications data (in real app, would come from Convex)
  const mockNotifications: Notification[] = [
    {
      _id: "1",
      title: "Event Update",
      message: "The React Meetup venue has been changed to Tech Hub Downtown.",
      type: "event_update",
      isRead: false,
      createdAt: "2024-12-10T14:30:00Z",
      relatedEventId: "event1",
      relatedEvent: {
        _id: "event1",
        title: "React Meetup",
        startDate: "2024-12-15T18:00:00Z"
      }
    },
    {
      _id: "2",
      title: "Event Reminder",
      message: "Don't forget! Your registered event 'JavaScript Workshop' starts tomorrow at 2:00 PM.",
      type: "event_reminder",
      isRead: false,
      createdAt: "2024-12-09T10:00:00Z",
      relatedEventId: "event2",
      relatedEvent: {
        _id: "event2",
        title: "JavaScript Workshop",
        startDate: "2024-12-10T14:00:00Z"
      }
    },
    {
      _id: "3",
      title: "Registration Confirmed",
      message: "You have successfully registered for 'Python Data Science Bootcamp'.",
      type: "registration_confirmed",
      isRead: true,
      createdAt: "2024-12-08T16:45:00Z",
      relatedEventId: "event3",
      relatedEvent: {
        _id: "event3",
        title: "Python Data Science Bootcamp",
        startDate: "2024-12-20T09:00:00Z"
      }
    },
    {
      _id: "4",
      title: "New Opportunity",
      message: "A new job opportunity has been posted for the Tech Career Fair event.",
      type: "new_opportunity",
      isRead: true,
      createdAt: "2024-12-07T12:20:00Z",
      relatedEventId: "event4",
      relatedEvent: {
        _id: "event4",
        title: "Tech Career Fair",
        startDate: "2024-12-25T10:00:00Z"
      }
    },
    {
      _id: "5",
      title: "Event Cancelled",
      message: "Unfortunately, the 'Mobile Dev Meetup' has been cancelled due to unforeseen circumstances.",
      type: "event_cancelled",
      isRead: false,
      createdAt: "2024-12-06T09:15:00Z",
      relatedEventId: "event5",
      relatedEvent: {
        _id: "event5",
        title: "Mobile Dev Meetup",
        startDate: "2024-12-12T19:00:00Z"
      }
    }
  ];

  // Filter notifications based on tab
  const filteredNotifications = mockNotifications.filter((notification) => {
    switch (activeTab) {
      case "unread":
        return !notification.isRead;
      case "events":
        return ["event_update", "event_reminder", "event_cancelled"].includes(notification.type);
      case "registrations":
        return notification.type === "registration_confirmed";
      default:
        return true;
    }
  });

  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

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
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Reminder</Badge>;
      case "event_cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "registration_confirmed":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Confirmed</Badge>;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with your events and activities</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <CheckCheckIcon className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline" size="sm">
            <Trash2Icon className="h-4 w-4 mr-2" />
            Clear All
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
                <p className="text-2xl font-bold">{mockNotifications.length}</p>
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
                <p className="text-2xl font-bold">{unreadCount}</p>
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
                  {mockNotifications.filter(n => ["event_update", "event_reminder", "event_cancelled"].includes(n.type)).length}
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
                  {mockNotifications.filter(n => n.type === "registration_confirmed").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({mockNotifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-600">
                  {activeTab === "unread" ? "You're all caught up!" : "No notifications found."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card 
                  key={notification._id} 
                  className={`hover:shadow-md transition-shadow ${
                    !notification.isRead ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {getNotificationIcon(notification.type)}
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className={`font-semibold ${!notification.isRead ? "font-bold" : ""}`}>
                              {notification.title}
                            </h3>
                            {getNotificationBadge(notification.type)}
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-3">{notification.message}</p>
                          
                          {notification.relatedEvent && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                              <div className="flex items-center space-x-2">
                                <CalendarIcon className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium">{notification.relatedEvent.title}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(notification.relatedEvent.startDate)}
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
                          <Link href={`/events/${notification.relatedEvent._id}`}>
                            <Button variant="outline" size="sm">
                              View Event
                            </Button>
                          </Link>
                        )}
                        
                        <Button variant="ghost" size="sm">
                          {notification.isRead ? (
                            <MailIcon className="h-4 w-4" />
                          ) : (
                            <CheckIcon className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <Button variant="ghost" size="sm">
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
