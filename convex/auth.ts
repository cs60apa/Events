import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const signUp = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("organizer"), v.literal("attendee")),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existingUser) {
      return { success: false, error: "User with this email already exists" };
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      role: args.role,
    });

    return { success: true, userId };
  },
});

export const signIn = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return { success: true, user };
  },
});
