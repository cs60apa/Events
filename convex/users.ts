import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("organizer"), v.literal("attendee")),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    company: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    linkedinUrl: v.optional(v.string()),
    twitterUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      role: args.role,
      bio: args.bio,
      location: args.location,
      company: args.company,
      skills: args.skills,
      linkedinUrl: args.linkedinUrl,
      twitterUrl: args.twitterUrl,
      githubUrl: args.githubUrl,
      website: args.website,
    });

    return userId;
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    company: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    linkedinUrl: v.optional(v.string()),
    twitterUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;

    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    return await ctx.db.patch(userId, cleanUpdates);
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getUserStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    if (user.role === "organizer") {
      // Get events organized
      const eventsOrganized = await ctx.db
        .query("events")
        .withIndex("by_organizer", (q) => q.eq("organizer", args.userId))
        .collect();

      return {
        eventsOrganized: eventsOrganized.length,
        totalAttendees: 0, // TODO: Calculate total attendees across all events
      };
    } else {
      // Get events attended
      const registrations = await ctx.db
        .query("registrations")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect();

      const eventsAttended = registrations.filter(
        (r) => r.status === "attended"
      ).length;
      const eventsRegistered = registrations.filter(
        (r) => r.status === "registered"
      ).length;

      return {
        eventsAttended,
        eventsRegistered,
        totalEvents: registrations.length,
      };
    }
  },
});
