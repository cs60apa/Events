"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeftIcon, SaveIcon, TrashIcon } from "lucide-react";
import Link from "next/link";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const eventId = params.id as string;

  // Get event data
  const event = useQuery(api.events.getEventById, { eventId: eventId as Id<"events"> });
  const updateEvent = useMutation(api.events.updateEvent);
  const deleteEvent = useMutation(api.events.deleteEvent);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "online" as "online" | "in-person" | "hybrid",
    location: "",
    virtualLink: "",
    startDate: "",
    endDate: "",
    maxAttendees: "",
    category: "",
    tags: "",
    isPublic: true,
    registrationDeadline: "",
    price: "",
    currency: "USD",
    requirements: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Populate form when event data loads
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        type: event.type || "online",
        location: event.location || "",
        virtualLink: event.virtualLink || "",
        startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : "",
        endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
        maxAttendees: event.maxAttendees?.toString() || "",
        category: event.category || "",
        tags: event.tags?.join(", ") || "",
        isPublic: event.isPublic ?? true,
        registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline).toISOString().slice(0, 16) : "",
        price: event.price?.toString() || "",
        currency: event.currency || "USD",
        requirements: event.requirements || "",
      });
    }
  }, [event]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !event) return;

    setIsLoading(true);

    try {
      const updateData = {
        eventId: eventId as Id<"events">,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        location: formData.location || undefined,
        virtualLink: formData.virtualLink || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
        category: formData.category,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        isPublic: formData.isPublic,
        registrationDeadline: formData.registrationDeadline || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        currency: formData.currency || undefined,
        requirements: formData.requirements || undefined,
      };

      await updateEvent(updateData);
      router.push("/dashboard/events");
    } catch (error) {
      console.error("Failed to update event:", error);
      alert("Failed to update event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteEvent({ eventId: eventId as Id<"events"> });
      router.push("/dashboard/events");
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event. Please try again.");
    }
  };

  if (!user || user.role !== "organizer") {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">Only organizers can edit events.</p>
      </div>
    );
  }

  if (!event) {
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
        <p className="text-gray-600">You can only edit your own events.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
            <p className="text-gray-600 mt-1">Update your event details</p>
          </div>
        </div>
        
        <Button
          variant="destructive"
          onClick={handleDelete}
          className="ml-auto"
        >
          <TrashIcon className="h-4 w-4 mr-2" />
          Delete Event
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your event"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-development">Web Development</SelectItem>
                    <SelectItem value="mobile-development">Mobile Development</SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                    <SelectItem value="devops">DevOps</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="product-management">Product Management</SelectItem>
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Event Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location/Virtual Link */}
            {(formData.type === "in-person" || formData.type === "hybrid") && (
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Enter venue address"
                />
              </div>
            )}

            {(formData.type === "online" || formData.type === "hybrid") && (
              <div>
                <Label htmlFor="virtualLink">Virtual Link</Label>
                <Input
                  id="virtualLink"
                  value={formData.virtualLink}
                  onChange={(e) => handleInputChange("virtualLink", e.target.value)}
                  placeholder="Zoom, Meet, or other virtual platform link"
                />
              </div>
            )}

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="startDate">Start Date & Time *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="endDate">End Date & Time *</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Additional Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="maxAttendees">Maximum Attendees</Label>
                <Input
                  id="maxAttendees"
                  type="number"
                  value={formData.maxAttendees}
                  onChange={(e) => handleInputChange("maxAttendees", e.target.value)}
                  placeholder="Leave empty for unlimited"
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                <Input
                  id="registrationDeadline"
                  type="datetime-local"
                  value={formData.registrationDeadline}
                  onChange={(e) => handleInputChange("registrationDeadline", e.target.value)}
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags and Requirements */}
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
                placeholder="React, JavaScript, Frontend (comma-separated)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate tags with commas to help people find your event
              </p>
            </div>

            <div>
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => handleInputChange("requirements", e.target.value)}
                placeholder="Any prerequisites or things attendees should bring"
                rows={3}
              />
            </div>

            {/* Public Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
              />
              <Label htmlFor="isPublic">Make this event public</Label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link href="/dashboard/events">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  "Saving..."
                ) : (
                  <>
                    <SaveIcon className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
