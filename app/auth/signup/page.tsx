"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarDays, Mail, User, Building, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/providers/auth-provider";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "attendee" as "organizer" | "attendee",
    company: "",
    location: "",
    bio: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { setUser } = useAuth();
  const createUser = useMutation(api.users.createUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userId = await createUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        company: formData.company || undefined,
        location: formData.location || undefined,
        bio: formData.bio || undefined,
      });

      // Set user in auth context
      const user = {
        _id: userId,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        company: formData.company,
        location: formData.location,
        bio: formData.bio,
      };

      setUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <CalendarDays className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">TechMeet</span>
          </Link>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Join TechMeet</CardTitle>
            <CardDescription>
              Connect with the tech community and discover amazing events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <Label>I want to:</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      role: value as "organizer" | "attendee",
                    })
                  }
                  className="grid grid-cols-1 gap-4"
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="attendee" id="attendee" />
                    <Label htmlFor="attendee" className="flex-1 cursor-pointer">
                      <div className="font-medium">Attend Events</div>
                      <div className="text-sm text-gray-500">
                        Join meetups and network with professionals
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="organizer" id="organizer" />
                    <Label
                      htmlFor="organizer"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">Host Events</div>
                      <div className="text-sm text-gray-500">
                        Organize and manage tech meetups
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Optional Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company (Optional)</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="company"
                      type="text"
                      placeholder="Your Company"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location (Optional)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      type="text"
                      placeholder="City, Country"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
