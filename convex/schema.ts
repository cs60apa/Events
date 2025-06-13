import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    password: v.string(), // Hashed password
    name: v.string(),
    role: v.union(v.literal("organizer"), v.literal("attendee")),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    company: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    linkedinUrl: v.optional(v.string()),
    twitterUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    website: v.optional(v.string()),
  }).index("by_email", ["email"]),

  events: defineTable({
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
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("cancelled")
    ),
    isPublic: v.boolean(),
    registrationDeadline: v.optional(v.string()),
    price: v.optional(v.number()),
    currency: v.optional(v.string()),
    requirements: v.optional(v.string()),
    agenda: v.optional(
      v.array(
        v.object({
          time: v.string(),
          topic: v.string(),
          speaker: v.optional(v.string()),
          duration: v.optional(v.number()),
        })
      )
    ),
  })
    .index("by_organizer", ["organizer"])
    .index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_start_date", ["startDate"]),

  speakers: defineTable({
    eventId: v.id("events"),
    name: v.string(),
    bio: v.string(),
    title: v.string(),
    company: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    twitterUrl: v.optional(v.string()),
    topic: v.string(),
    talkDescription: v.optional(v.string()),
  }).index("by_event", ["eventId"]),

  registrations: defineTable({
    eventId: v.id("events"),
    userId: v.id("users"),
    status: v.union(
      v.literal("registered"),
      v.literal("attended"),
      v.literal("cancelled")
    ),
    registeredAt: v.string(),
    checkedInAt: v.optional(v.string()),
    feedback: v.optional(
      v.object({
        rating: v.number(),
        comment: v.string(),
        wouldRecommend: v.boolean(),
      })
    ),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  opportunities: defineTable({
    eventId: v.id("events"),
    title: v.string(),
    description: v.string(),
    type: v.union(
      v.literal("job"),
      v.literal("internship"),
      v.literal("volunteer"),
      v.literal("collaboration"),
      v.literal("mentorship")
    ),
    company: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    applicationUrl: v.optional(v.string()),
    requirements: v.optional(v.array(v.string())),
    isActive: v.boolean(),
  })
    .index("by_event", ["eventId"])
    .index("by_type", ["type"]),

  notifications: defineTable({
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
    isRead: v.boolean(),
    createdAt: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_read_status", ["userId", "isRead"])
    .index("by_created_at", ["createdAt"]),
});
