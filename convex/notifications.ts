import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createNotification = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.union(
      v.literal("event_update"),
      v.literal("event_reminder"),
      v.literal("event_cancelled"),
      v.literal("registration_confirmed"),
      v.literal("new_opportunity")
    ),
    relatedEventId: v.optional(v.id("events")),
  },
  handler: async (ctx, args) => {
    const notificationId = await ctx.db.insert("notifications", {
      ...args,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    return notificationId;
  },
});

export const getUserNotifications = query({
  args: { 
    userId: v.id("users"),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc");

    const notifications = await query.collect();
    
    // Sort by created date (most recent first)
    const sortedNotifications = notifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Limit results if specified
    const limitedNotifications = args.limit 
      ? sortedNotifications.slice(0, args.limit) 
      : sortedNotifications;

    // Get related event details if available
    const notificationsWithEvents = await Promise.all(
      limitedNotifications.map(async (notification) => {
        if (notification.relatedEventId) {
          const event = await ctx.db.get(notification.relatedEventId);
          return { ...notification, relatedEvent: event };
        }
        return notification;
      })
    );

    return notificationsWithEvents;
  },
});

export const getUnreadNotificationCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_read_status", (q) => 
        q.eq("userId", args.userId).eq("isRead", false)
      )
      .collect();

    return notifications.length;
  },
});

export const markNotificationAsRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.notificationId, { isRead: true });
  },
});

export const markAllNotificationsAsRead = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_read_status", (q) => 
        q.eq("userId", args.userId).eq("isRead", false)
      )
      .collect();

    await Promise.all(
      unreadNotifications.map(notification => 
        ctx.db.patch(notification._id, { isRead: true })
      )
    );

    return unreadNotifications.length;
  },
});

export const deleteNotification = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.notificationId);
  },
});

// Helper function to notify all event attendees
export const notifyEventAttendees = mutation({
  args: {
    eventId: v.id("events"),
    title: v.string(),
    message: v.string(),
    type: v.union(
      v.literal("event_update"),
      v.literal("event_reminder"),
      v.literal("event_cancelled")
    ),
  },
  handler: async (ctx, args) => {
    // Get all registrations for the event
    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .filter((q) => q.neq(q.field("status"), "cancelled"))
      .collect();

    // Create notifications for each attendee
    const notificationPromises = registrations.map(registration =>
      ctx.db.insert("notifications", {
        userId: registration.userId,
        title: args.title,
        message: args.message,
        type: args.type,
        relatedEventId: args.eventId,
        isRead: false,
        createdAt: new Date().toISOString(),
      })
    );

    await Promise.all(notificationPromises);
    return registrations.length; // Return number of notifications sent
  },
});
