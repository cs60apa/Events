// Types for the TechMeet application

import { Id } from "@/convex/_generated/dataModel";

export interface User {
  _id: Id<"users">;
  email: string;
  name: string;
  role: "organizer" | "attendee";
  bio?: string;
  location?: string;
  profileImage?: string;
  company?: string;
  skills?: string[];
  linkedinUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  website?: string;
}

export interface Speaker {
  _id: Id<"speakers">;
  eventId: Id<"events">;
  name: string;
  bio: string;
  title: string;
  company?: string;
  profileImage?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  topic: string;
  talkDescription?: string;
}

export interface Opportunity {
  _id: Id<"opportunities">;
  eventId: Id<"events">;
  title: string;
  description: string;
  type: "job" | "internship" | "volunteer" | "collaboration" | "mentorship";
  company?: string;
  contactEmail?: string;
  applicationUrl?: string;
  requirements?: string[];
  isActive: boolean;
}

export interface Registration {
  _id: Id<"registrations">;
  eventId: Id<"events">;
  userId: Id<"users">;
  status: "registered" | "attended" | "cancelled";
  registeredAt: string;
  checkedInAt?: string;
  feedback?: {
    rating: number;
    comment: string;
    wouldRecommend: boolean;
  };
  user?: User | null; // Populated in queries
}

export interface AgendaItem {
  time: string;
  topic: string;
  speaker?: string;
  duration?: number;
}

export interface Event {
  _id: Id<"events">;
  title: string;
  description: string;
  organizer: Id<"users"> | User;
  type: "online" | "in-person" | "hybrid";
  location?: string;
  virtualLink?: string;
  startDate: string;
  endDate: string;
  maxAttendees?: number;
  category: string;
  tags: string[];
  imageUrl?: string;
  status: "draft" | "published" | "cancelled";
  isPublic: boolean;
  registrationDeadline?: string;
  price?: number;
  currency?: string;
  requirements?: string;
  agenda?: AgendaItem[];
  speakers?: Speaker[];
  opportunities?: Opportunity[];
  registrationCount?: number;
  attendeeCount?: number;
}

export interface EventWithDetails extends Event {
  organizer: User;
  speakers: Speaker[];
  opportunities: Opportunity[];
  registrationCount: number;
  attendeeCount: number;
}

export interface Notification {
  _id: Id<"notifications">;
  userId: Id<"users">;
  title: string;
  message: string;
  type:
    | "event_update"
    | "event_reminder"
    | "event_cancelled"
    | "registration_confirmed"
    | "new_opportunity";
  relatedEventId?: Id<"events">;
  isRead: boolean;
  createdAt: string;
}

export interface UserStats {
  eventsAttended: number;
  eventsRegistered: number;
  totalEvents: number;
}

export interface EventAnalytics {
  _id: Id<"events">;
  title: string;
  category: string;
  type: "online" | "in-person" | "hybrid";
  startDate: string;
  registrationCount: number;
  attendeeCount: number;
  attendanceRate: number;
  revenue?: number;
  averageRating?: number;
}
