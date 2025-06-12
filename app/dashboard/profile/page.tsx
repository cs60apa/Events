"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MailIcon,
  MapPinIcon,
  BuildingIcon,
  LinkedinIcon,
  TwitterIcon,
  GithubIcon,
  GlobeIcon,
  SaveIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";

export default function ProfilePage() {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    company: "",
    skills: [] as string[],
    linkedinUrl: "",
    twitterUrl: "",
    githubUrl: "",
    website: "",
  });

  const [newSkill, setNewSkill] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Populate form when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        location: user.location || "",
        company: user.company || "",
        skills: user.skills || [],
        linkedinUrl: user.linkedinUrl || "",
        twitterUrl: user.twitterUrl || "",
        githubUrl: user.githubUrl || "",
        website: user.website || "",
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      // For now, just update the local auth context
      // In a real app, you'd call the Convex mutation
      setUser({ ...user, ...formData });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your personal information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarFallback className="text-2xl">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <h3 className="text-xl font-semibold mb-2">
                {user.name || "User"}
              </h3>
              <Badge
                variant={user.role === "organizer" ? "default" : "secondary"}
                className="mb-4"
              >
                {user.role === "organizer" ? "Event Organizer" : "Attendee"}
              </Badge>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <MailIcon className="h-4 w-4 mr-2" />
                  {user.email}
                </div>

                {formData.location && (
                  <div className="flex items-center justify-center">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    {formData.location}
                  </div>
                )}

                {formData.company && (
                  <div className="flex items-center justify-center">
                    <BuildingIcon className="h-4 w-4 mr-2" />
                    {formData.company}
                  </div>
                )}
              </div>

              {formData.bio && (
                <p className="text-sm text-gray-600 mt-4 text-left">
                  {formData.bio}
                </p>
              )}

              {formData.skills.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {formData.skills.slice(0, 6).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {formData.skills.length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{formData.skills.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) =>
                        handleInputChange("company", e.target.value)
                      }
                      placeholder="Your current company"
                    />
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <Label>Skills & Technologies</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill..."
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddSkill())
                      }
                    />
                    <Button type="button" onClick={handleAddSkill} size="sm">
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1 hover:text-red-600"
                          >
                            <XIcon className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Social Links</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                      <div className="relative">
                        <LinkedinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="linkedinUrl"
                          value={formData.linkedinUrl}
                          onChange={(e) =>
                            handleInputChange("linkedinUrl", e.target.value)
                          }
                          placeholder="https://linkedin.com/in/username"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="twitterUrl">Twitter Profile</Label>
                      <div className="relative">
                        <TwitterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="twitterUrl"
                          value={formData.twitterUrl}
                          onChange={(e) =>
                            handleInputChange("twitterUrl", e.target.value)
                          }
                          placeholder="https://twitter.com/username"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="githubUrl">GitHub Profile</Label>
                      <div className="relative">
                        <GithubIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="githubUrl"
                          value={formData.githubUrl}
                          onChange={(e) =>
                            handleInputChange("githubUrl", e.target.value)
                          }
                          placeholder="https://github.com/username"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="website">Personal Website</Label>
                      <div className="relative">
                        <GlobeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) =>
                            handleInputChange("website", e.target.value)
                          }
                          placeholder="https://yourwebsite.com"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      "Saving..."
                    ) : (
                      <>
                        <SaveIcon className="h-4 w-4 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
