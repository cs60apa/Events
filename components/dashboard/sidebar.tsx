"use client";

import { useAuth } from "@/providers/auth-provider";
import { CalendarDays, Plus, Users, BarChart3, Settings, Calendar, User, Bookmark, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const organizerNavigation = [
    { name: "Overview", href: "/dashboard", icon: BarChart3 },
    { name: "My Events", href: "/dashboard/events", icon: Calendar },
    { name: "Create Event", href: "/dashboard/events/create", icon: Plus },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const attendeeNavigation = [
    { name: "Overview", href: "/dashboard", icon: BarChart3 },
    { name: "My Events", href: "/dashboard/events", icon: Calendar },
    { name: "Browse Events", href: "/events", icon: CalendarDays },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const navigation = user?.role === "organizer" ? organizerNavigation : attendeeNavigation;

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TechMeet</span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        pathname === item.href
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:text-blue-700 hover:bg-blue-50",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      )}
                    >
                      <item.icon
                        className={cn(
                          pathname === item.href ? "text-blue-700" : "text-gray-400 group-hover:text-blue-700",
                          "h-6 w-6 shrink-0"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="mt-auto">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
