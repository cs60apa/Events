import { mutation } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";

export const signUp = mutation({
  args: {
    email: v.string(),
    password: v.string(),
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

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(args.password, saltRounds);

    // Create new user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      password: hashedPassword,
      name: args.name,
      role: args.role,
    });

    return { success: true, userId };
  },
});

export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    // Check if user has a password (migration compatibility)
    if (!user.password) {
      return {
        success: false,
        error: "Please reset your password or create a new account",
      };
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
