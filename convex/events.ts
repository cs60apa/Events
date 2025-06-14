import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    organizer: v.id("users"),
    type: v.union(
      v.literal("online"),
      v.literal("in-person"),
      v.literal("hybrid")
    ),
    location: v.optional(v.string()),
    virtualLink: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.string(),
    maxAttendees: v.optional(v.number()),
    category: v.string(),
    tags: v.array(v.string()),
    imageUrl: v.optional(v.string()),
    isPublic: v.boolean(),
    registrationDeadline: v.optional(v.string()),
    price: v.optional(v.number()),
    currency: v.optional(v.string()),
    requirements: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const eventId = await ctx.db.insert("events", {
      ...args,
      status: "draft",
      agenda: [],
    });

    return eventId;
  },
});

export const getEventById = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) return null;

    // Get organizer details
    const organizer = await ctx.db.get(event.organizer);

    // Get speakers
    const speakers = await ctx.db
      .query("speakers")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    // Get opportunities
    const opportunities = await ctx.db
      .query("opportunities")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    // Get registration count
    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    return {
      ...event,
      organizer,
      speakers,
      opportunities,
      registrationCount: registrations.length,
      attendeeCount: registrations.filter((r) => r.status === "attended")
        .length,
    };
  },
});

export const getPublicEvents = query({
  args: {
    category: v.optional(v.string()),
    type: v.optional(
      v.union(v.literal("online"), v.literal("in-person"), v.literal("hybrid"))
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("events")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .filter((q) => q.eq(q.field("isPublic"), true));

    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    }

    if (args.type) {
      query = query.filter((q) => q.eq(q.field("type"), args.type));
    }

    const events = await query.collect();

    // Sort by start date
    const sortedEvents = events.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    // Limit results if specified
    const limitedEvents = args.limit
      ? sortedEvents.slice(0, args.limit)
      : sortedEvents;

    // Get organizer details for each event
    const eventsWithOrganizers = await Promise.all(
      limitedEvents.map(async (event) => {
        const organizer = await ctx.db.get(event.organizer);
        const registrations = await ctx.db
          .query("registrations")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .collect();

        return {
          ...event,
          organizer,
          registrationCount: registrations.length,
        };
      })
    );

    return eventsWithOrganizers;
  },
});

export const getEventsByOrganizer = query({
  args: { organizerId: v.id("users") },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("events")
      .withIndex("by_organizer", (q) => q.eq("organizer", args.organizerId))
      .collect();

    // Get registration counts for each event
    const eventsWithStats = await Promise.all(
      events.map(async (event) => {
        const registrations = await ctx.db
          .query("registrations")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .collect();

        return {
          ...event,
          registrationCount: registrations.length,
          attendeeCount: registrations.filter((r) => r.status === "attended")
            .length,
        };
      })
    );

    return eventsWithStats.sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  },
});

export const updateEvent = mutation({
  args: {
    eventId: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(
      v.union(v.literal("online"), v.literal("in-person"), v.literal("hybrid"))
    ),
    location: v.optional(v.string()),
    virtualLink: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    maxAttendees: v.optional(v.number()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    imageUrl: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("published"),
        v.literal("cancelled")
      )
    ),
    isPublic: v.optional(v.boolean()),
    registrationDeadline: v.optional(v.string()),
    price: v.optional(v.number()),
    currency: v.optional(v.string()),
    requirements: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { eventId, ...updates } = args;

    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    return await ctx.db.patch(eventId, cleanUpdates);
  },
});

export const deleteEvent = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    // Delete related data
    const speakers = await ctx.db
      .query("speakers")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    const opportunities = await ctx.db
      .query("opportunities")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    // Delete all related records
    await Promise.all([
      ...speakers.map((speaker) => ctx.db.delete(speaker._id)),
      ...registrations.map((reg) => ctx.db.delete(reg._id)),
      ...opportunities.map((opp) => ctx.db.delete(opp._id)),
    ]);

    // Delete the event
    return await ctx.db.delete(args.eventId);
  },
});

export const registerForEvent = mutation({
  args: {
    eventId: v.id("events"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Check if user is already registered
    const existingRegistration = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();

    if (existingRegistration) {
      throw new Error("User is already registered for this event");
    }

    // Check event capacity
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    if (event.maxAttendees) {
      const registrations = await ctx.db
        .query("registrations")
        .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
        .collect();

      if (registrations.length >= event.maxAttendees) {
        throw new Error("Event is full");
      }
    }

    const registrationId = await ctx.db.insert("registrations", {
      eventId: args.eventId,
      userId: args.userId,
      status: "registered",
      registeredAt: new Date().toISOString(),
    });

    return registrationId;
  },
});

export const getUpcomingEvents = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    const events = await ctx.db
      .query("events")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .filter((q) =>
        q.and(q.eq(q.field("isPublic"), true), q.gte(q.field("startDate"), now))
      )
      .collect();

    // Sort by start date
    const sortedEvents = events.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    // Limit results if specified
    const limitedEvents = args.limit
      ? sortedEvents.slice(0, args.limit)
      : sortedEvents;

    // Get organizer details for each event
    const eventsWithOrganizers = await Promise.all(
      limitedEvents.map(async (event) => {
        const organizer = await ctx.db.get(event.organizer);
        const registrations = await ctx.db
          .query("registrations")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .collect();

        return {
          ...event,
          organizer,
          registrationCount: registrations.length,
        };
      })
    );

    return eventsWithOrganizers;
  },
});

export const getEventRegistrations = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    // Get user details for each registration
    const registrationsWithUsers = await Promise.all(
      registrations.map(async (registration) => {
        const user = await ctx.db.get(registration.userId);
        return {
          ...registration,
          user,
        };
      })
    );

    // Sort by registration date (most recent first)
    return registrationsWithUsers.sort(
      (a, b) =>
        new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
    );
  },
});

export const updateRegistrationStatus = mutation({
  args: {
    registrationId: v.id("registrations"),
    status: v.union(
      v.literal("registered"),
      v.literal("attended"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const updates: any = { status: args.status };

    if (args.status === "attended") {
      updates.checkedInAt = new Date().toISOString();
    }

    return await ctx.db.patch(args.registrationId, updates);
  },
});

export const getEventAnalytics = query({
  args: { organizerId: v.id("users") },
  handler: async (ctx, args) => {
    // Get all events by organizer
    const events = await ctx.db
      .query("events")
      .withIndex("by_organizer", (q) => q.eq("organizer", args.organizerId))
      .collect();

    // Get analytics data for each event
    const eventsWithAnalytics = await Promise.all(
      events.map(async (event) => {
        const registrations = await ctx.db
          .query("registrations")
          .withIndex("by_event", (q) => q.eq("eventId", event._id))
          .collect();

        const attendees = registrations.filter((r) => r.status === "attended");
        const registrationCount = registrations.length;
        const attendeeCount = attendees.length;

        return {
          _id: event._id,
          title: event.title,
          startDate: event.startDate,
          category: event.category,
          type: event.type,
          price: event.price,
          registrationCount,
          attendeeCount,
          attendanceRate:
            registrationCount > 0
              ? (attendeeCount / registrationCount) * 100
              : 0,
          revenue: event.price ? event.price * registrationCount : 0,
        };
      })
    );

    return eventsWithAnalytics.sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  },
});
