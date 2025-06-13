import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";
import { api } from "./_generated/api";

// Query to get user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

// Internal mutation for creating user (called from action)
export const createUserMutation = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    role: v.union(v.literal("organizer"), v.literal("attendee")),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      email: args.email,
      password: args.password,
      name: args.name,
      role: args.role,
    });

    return userId;
  },
});

// Action for signing up (handles password hashing)
export const signUp = action({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    role: v.union(v.literal("organizer"), v.literal("attendee")),
  },
  handler: async (ctx, args): Promise<{ success: boolean; userId?: any; error?: string }> => {
    // Check if user already exists by calling the query
    const existingUser = await ctx.runQuery(api.auth.getUserByEmail, {
      email: args.email,
    });

    if (existingUser) {
      return { success: false, error: "User with this email already exists" };
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(args.password, saltRounds);

    // Create new user by calling the mutation
    const userId = await ctx.runMutation(api.auth.createUserMutation, {
      email: args.email,
      password: hashedPassword,
      name: args.name,
      role: args.role,
    });

    return { success: true, userId };
  },
});

// Action for signing in (handles password verification)
export const signIn = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; user?: any; error?: string }> => {
    // Get user by calling the query
    const user = await ctx.runQuery(api.auth.getUserByEmail, {
      email: args.email,
    });

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    // Handle migration case where user doesn't have password yet
    if (!user.password) {
      return { success: false, error: "Please contact support to reset your password" };
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(args.password, user.password);
    
    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or password" };
    }

    // Return user data without password
    const { password, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  },
});
