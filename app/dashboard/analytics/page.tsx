"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
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

interface EventAnalytics {
  id: string;
  title: string;
  date: string;
  registrations: number;
  attendees: number;
  rating: number;
  category: string;
  type: "online" | "in-person" | "hybrid";
  revenue?: number;
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("last-30-days");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock analytics data
  const mockEvents: EventAnalytics[] = [
    {
      id: "1",
      title: "React Advanced Workshop",
      date: "2024-12-01",
      registrations: 150,
      attendees: 120,
      rating: 4.8,
      category: "web-development",
      type: "hybrid",
      revenue: 2400
    },
    {
      id: "2",
      title: "Python Data Science Bootcamp",
      date: "2024-12-05",
      registrations: 200,
      attendees: 180,
      rating: 4.6,
      category: "data-science",
      type: "online",
      revenue: 3600
    },
    {
      id: "3",
      title: "JavaScript Fundamentals",
      date: "2024-12-10",
      registrations: 80,
      attendees: 75,
      rating: 4.9,
      category: "web-development",
      type: "in-person",
      revenue: 0
    },
    {
      id: "4",
      title: "DevOps Best Practices",
      date: "2024-12-15",
      registrations: 120,
      attendees: 100,
      rating: 4.7,
      category: "devops",
      type: "online",
      revenue: 1800
    },
    {
      id: "5",
      title: "UI/UX Design Thinking",
      date: "2024-12-20",
      registrations: 90,
      attendees: 85,
      rating: 4.5,
      category: "design",
      type: "hybrid",
      revenue: 1350
    }
  ];

  const filteredEvents = mockEvents.filter(event => 
    selectedCategory === "all" || event.category === selectedCategory
  );

  const totalRegistrations = filteredEvents.reduce((sum, event) => sum + event.registrations, 0);
  const totalAttendees = filteredEvents.reduce((sum, event) => sum + event.attendees, 0);
  const totalRevenue = filteredEvents.reduce((sum, event) => sum + (event.revenue || 0), 0);
  const averageRating = filteredEvents.reduce((sum, event) => sum + event.rating, 0) / filteredEvents.length;
  const averageAttendanceRate = (totalAttendees / totalRegistrations) * 100;

  const categoryStats = {
    "web-development": filteredEvents.filter(e => e.category === "web-development").length,
    "data-science": filteredEvents.filter(e => e.category === "data-science").length,
    "devops": filteredEvents.filter(e => e.category === "devops").length,
    "design": filteredEvents.filter(e => e.category === "design").length,
  };

  const typeStats = {
    "online": filteredEvents.filter(e => e.type === "online").length,
    "in-person": filteredEvents.filter(e => e.type === "in-person").length,
    "hybrid": filteredEvents.filter(e => e.type === "hybrid").length,
  };

  if (!user || user.role !== "organizer") {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">Only event organizers can access analytics.</p>
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
                {filteredEvents.filter(e => e.revenue && e.revenue > 0).length}
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
                {filteredEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{event.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>{formatDate(event.date)}</span>
                        <Badge variant="outline">{event.type}</Badge>
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                          {event.rating}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-center">
                      <div>
                        <p className="text-lg font-semibold">{event.registrations}</p>
                        <p className="text-xs text-gray-600">Registered</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{event.attendees}</p>
                        <p className="text-xs text-gray-600">Attended</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">
                          {((event.attendees / event.registrations) * 100).toFixed(0)}%
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
                            width: `${(count / filteredEvents.length) * 100}%` 
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
                            width: `${(count / filteredEvents.length) * 100}%` 
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
