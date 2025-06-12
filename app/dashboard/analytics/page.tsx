"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3Icon,
  TrendingUpIcon,
  TrendingDownIcon,
  UsersIcon,
  CalendarIcon,
  MapPinIcon,
  StarIcon,
  DownloadIcon,
  FilterIcon
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("last-30-days");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get analytics data from Convex
  const analyticsData = useQuery(
    api.events.getEventAnalytics,
    user ? { organizerId: user._id as Id<"users"> } : "skip"
  );

  // Filter events based on category
  const filteredEvents = (analyticsData || []).filter((event: any) => 
    selectedCategory === "all" || event.category === selectedCategory
  );

  const totalRegistrations = filteredEvents.reduce((sum: number, event: any) => sum + event.registrationCount, 0);
  const totalRevenue = filteredEvents.reduce((sum: number, event: any) => sum + (event.revenue || 0), 0);
  const averageAttendanceRate = filteredEvents.length > 0 
    ? filteredEvents.reduce((sum: number, event: any) => sum + event.attendanceRate, 0) / filteredEvents.length 
    : 0;

  // Calculate average rating (assuming rating is part of event feedback)
  const averageRating = filteredEvents.length > 0 
    ? filteredEvents.reduce((sum: number, event: any) => sum + (event.averageRating || 0), 0) / filteredEvents.length 
    : 0;

  const categoryStats = {
    "web-development": filteredEvents.filter((e: any) => e.category === "Web Development").length,
    "data-science": filteredEvents.filter((e: any) => e.category === "Data Science").length,
    "devops": filteredEvents.filter((e: any) => e.category === "DevOps").length,
    "design": filteredEvents.filter((e: any) => e.category === "Design").length,
  };

  const typeStats = {
    "online": filteredEvents.filter((e: any) => e.type === "online").length,
    "in-person": filteredEvents.filter((e: any) => e.type === "in-person").length,
    "hybrid": filteredEvents.filter((e: any) => e.type === "hybrid").length,
  };

  if (!user || user.role !== "organizer") {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">Only event organizers can access analytics.</p>
      </div>
    );
  }

  if (analyticsData === undefined) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
        <p className="text-gray-600">Loading your analytics data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your event performance and insights</p>
        </div>
        
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-90-days">Last 90 days</SelectItem>
              <SelectItem value="last-year">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <FilterIcon className="h-5 w-5 text-gray-500" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="web-development">Web Development</SelectItem>
                <SelectItem value="data-science">Data Science</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
                <SelectItem value="design">Design</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">{filteredEvents.length}</p>
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUpIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">+12%</span>
              </div>
            </div>
            <div className="mt-4">
              <CalendarIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                <p className="text-3xl font-bold text-gray-900">{totalRegistrations.toLocaleString()}</p>
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUpIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">+8%</span>
              </div>
            </div>
            <div className="mt-4">
              <UsersIcon className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-3xl font-bold text-gray-900">{averageAttendanceRate.toFixed(1)}%</p>
              </div>
              <div className="flex items-center text-red-600">
                <TrendingDownIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">-2%</span>
              </div>
            </div>
            <div className="mt-4">
              <BarChart3Icon className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUpIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">+0.2</span>
              </div>
            </div>
            <div className="mt-4">
              <StarIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Card */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">${(totalRevenue / filteredEvents.length).toFixed(0)}</p>
              <p className="text-sm text-gray-600">Average per Event</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {filteredEvents.filter((e: any) => e.revenue && e.revenue > 0).length}
              </p>
              <p className="text-sm text-gray-600">Paid Events</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Event Performance</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="formats">Event Formats</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents.map((event: any) => (
                  <div key={event._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{event.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>{formatDate(event.startDate)}</span>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-center">
                      <div>
                        <p className="text-lg font-semibold">{event.registrationCount}</p>
                        <p className="text-xs text-gray-600">Registered</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{event.attendeeCount}</p>
                        <p className="text-xs text-gray-600">Attended</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">
                          {event.registrationCount > 0 ? event.attendanceRate.toFixed(0) : 0}%
                        </p>
                        <p className="text-xs text-gray-600">Rate</p>
                      </div>
                      {event.revenue && event.revenue > 0 && (
                        <div>
                          <p className="text-lg font-semibold text-green-600">
                            ${event.revenue.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600">Revenue</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Events by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(categoryStats).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="capitalize font-medium">
                      {category.replace("-", " ")}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ 
                            width: `${filteredEvents.length > 0 ? (count / filteredEvents.length) * 100 : 0}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Formats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(typeStats).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {type === "online" && <CalendarIcon className="h-4 w-4 text-blue-500" />}
                      {type === "in-person" && <MapPinIcon className="h-4 w-4 text-green-500" />}
                      {type === "hybrid" && <BarChart3Icon className="h-4 w-4 text-purple-500" />}
                      <span className="capitalize font-medium">{type.replace("-", " ")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full"
                          style={{ 
                            width: `${filteredEvents.length > 0 ? (count / filteredEvents.length) * 100 : 0}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
