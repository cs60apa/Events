import { mutation } from "./_generated/server";

export const clearAllUsers = mutation({
  handler: async (ctx) => {
    // Delete all users to start fresh with new schema
    const users = await ctx.db.query("users").collect();

    for (const user of users) {
      await ctx.db.delete(user._id);
    }

    return { deleted: users.length };
  },
});
