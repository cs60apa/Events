"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  SaveIcon,
  BellIcon,
  MailIcon,
  ShieldIcon,
  PaletteIcon,
  GlobeIcon,
  TrashIcon
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    eventReminders: true,
    eventUpdates: true,
    marketingEmails: false,
    weeklyDigest: true,
  });

  const [preferences, setPreferences] = useState({
    timezone: "America/New_York",
    language: "en",
    theme: "light",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showLocation: true,
    showCompany: true,
    allowEventRecommendations: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePreferenceChange = (key: string, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: string, value: boolean | string) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      // Here you would normally save to Convex
      // For now, just simulate a save
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    if (!confirm("This will permanently delete all your data, events, and registrations. Are you absolutely sure?")) {
      return;
    }

    try {
      // Here you would call the delete account function
      alert("Account deletion request submitted. You will receive a confirmation email.");
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Failed to delete account. Please contact support.");
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
        <p className="text-gray-600">Loading your settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BellIcon className="h-5 w-5" />
            <CardTitle>Notification Preferences</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="event-reminders">Event Reminders</Label>
                <p className="text-sm text-gray-500">Get reminded before events start</p>
              </div>
              <Switch
                id="event-reminders"
                checked={notifications.eventReminders}
                onCheckedChange={(checked) => handleNotificationChange("eventReminders", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="event-updates">Event Updates</Label>
                <p className="text-sm text-gray-500">Notifications about event changes</p>
              </div>
              <Switch
                id="event-updates"
                checked={notifications.eventUpdates}
                onCheckedChange={(checked) => handleNotificationChange("eventUpdates", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-digest">Weekly Digest</Label>
                <p className="text-sm text-gray-500">Summary of upcoming events</p>
              </div>
              <Switch
                id="weekly-digest"
                checked={notifications.weeklyDigest}
                onCheckedChange={(checked) => handleNotificationChange("weeklyDigest", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketing-emails">Marketing Emails</Label>
                <p className="text-sm text-gray-500">Promotional content and updates</p>
              </div>
              <Switch
                id="marketing-emails"
                checked={notifications.marketingEmails}
                onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* General Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <GlobeIcon className="h-5 w-5" />
            <CardTitle>General Preferences</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={preferences.timezone} onValueChange={(value) => handlePreferenceChange("timezone", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  <SelectItem value="Europe/Berlin">Berlin (CET)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="language">Language</Label>
              <Select value={preferences.language} onValueChange={(value) => handlePreferenceChange("language", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select value={preferences.theme} onValueChange={(value) => handlePreferenceChange("theme", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date-format">Date Format</Label>
              <Select value={preferences.dateFormat} onValueChange={(value) => handlePreferenceChange("dateFormat", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="time-format">Time Format</Label>
              <Select value={preferences.timeFormat} onValueChange={(value) => handlePreferenceChange("timeFormat", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                  <SelectItem value="24h">24 Hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <ShieldIcon className="h-5 w-5" />
            <CardTitle>Privacy Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="profile-visibility">Profile Visibility</Label>
            <Select value={privacy.profileVisibility} onValueChange={(value) => handlePrivacyChange("profileVisibility", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="members-only">Members Only</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-1">
              Control who can view your profile information
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-email">Show Email Address</Label>
                <p className="text-sm text-gray-500">Display email on your profile</p>
              </div>
              <Switch
                id="show-email"
                checked={privacy.showEmail}
                onCheckedChange={(checked) => handlePrivacyChange("showEmail", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-location">Show Location</Label>
                <p className="text-sm text-gray-500">Display location on your profile</p>
              </div>
              <Switch
                id="show-location"
                checked={privacy.showLocation}
                onCheckedChange={(checked) => handlePrivacyChange("showLocation", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-company">Show Company</Label>
                <p className="text-sm text-gray-500">Display company on your profile</p>
              </div>
              <Switch
                id="show-company"
                checked={privacy.showCompany}
                onCheckedChange={(checked) => handlePrivacyChange("showCompany", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="event-recommendations">Event Recommendations</Label>
                <p className="text-sm text-gray-500">Allow personalized recommendations</p>
              </div>
              <Switch
                id="event-recommendations"
                checked={privacy.allowEventRecommendations}
                onCheckedChange={(checked) => handlePrivacyChange("allowEventRecommendations", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-between items-center">
        <Button 
          onClick={handleSaveSettings} 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            "Saving..."
          ) : (
            <>
              <SaveIcon className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrashIcon className="h-5 w-5 text-red-500" />
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-red-600">Delete Account</h4>
              <p className="text-sm text-gray-600 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete My Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
