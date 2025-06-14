"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function DebugEventsPage() {
  const allEvents = useQuery(api.events.getAllEvents);
  const publicEvents = useQuery(api.events.getPublicEvents, {});

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Debug Events</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          All Events ({allEvents?.length || 0})
        </h2>

        {allEvents && allEvents.length > 0 && (
          <div className="space-y-4 mb-6">
            {allEvents.map((event) => (
              <div key={event._id} className="bg-white p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <div className="mt-2 space-y-1">
                  <p>
                    <strong>Status:</strong>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-sm ${
                        event.status === "published"
                          ? "bg-green-100 text-green-800"
                          : event.status === "draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {event.status}
                    </span>
                  </p>
                  <p>
                    <strong>Public:</strong>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-sm ${
                        event.isPublic
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {event.isPublic ? "Yes" : "No"}
                    </span>
                  </p>
                  <p>
                    <strong>Category:</strong> {event.category}
                  </p>
                  <p>
                    <strong>Type:</strong> {event.type}
                  </p>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {new Date(event.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Full JSON:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(allEvents, null, 2)}
          </pre>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          Public Events ({publicEvents?.length || 0})
        </h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <pre className="text-sm overflow-auto">
            {JSON.stringify(publicEvents, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
