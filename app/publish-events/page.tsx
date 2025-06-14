"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function PublishEventsPage() {
  const publishAllEvents = useMutation(api.events.publishAllDraftEvents);

  const handlePublishAll = async () => {
    try {
      const result = await publishAllEvents();
      alert(`Published ${result.publishedCount} events`);
      window.location.href = "/events";
    } catch (error) {
      console.error("Error publishing events:", error);
      alert("Error publishing events");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Publish Events</h1>
      <p className="mb-4">
        This will publish all draft events and make them public so they appear
        on the events page.
      </p>
      <Button onClick={handlePublishAll}>Publish All Draft Events</Button>
    </div>
  );
}
