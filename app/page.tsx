import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users, Trophy, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
<Header/>
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 pt-20 pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-2 text-sm font-medium"
            >
              🚀 Connect with the Tech Community
            </Badge>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Discover Amazing{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tech Events
            </span>
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-600 max-w-2xl mx-auto">
            Join the largest community of tech enthusiasts. Attend meetups,
            network with professionals, and grow your career in technology.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="h-12 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/events">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-lg font-semibold"
              >
                Browse Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to connect
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Whether you&apos;re looking to learn, network, or share knowledge,
              our platform has you covered.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CalendarDays className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Easy Event Discovery</CardTitle>
                <CardDescription>
                  Find events that match your interests and skill level with our
                  smart filtering system.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Networking Opportunities</CardTitle>
                <CardDescription>
                  Connect with like-minded professionals and expand your network
                  in the tech industry.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Career Growth</CardTitle>
                <CardDescription>
                  Discover job opportunities, mentorship programs, and career
                  development events.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Easy Event Creation</CardTitle>
                <CardDescription>
                  Organize your own events with our intuitive event management
                  tools and dashboard.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Global & Local Events</CardTitle>
                <CardDescription>
                  Attend online events from anywhere or find local meetups in
                  your city.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Smart Recommendations</CardTitle>
                <CardDescription>
                  Get personalized event recommendations based on your interests
                  and past attendance.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Join thousands of tech enthusiasts
            </h2>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Our community is growing every day with passionate developers,
              designers, and tech leaders.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">10K+</div>
              <div className="mt-2 text-lg text-blue-100">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">500+</div>
              <div className="mt-2 text-lg text-blue-100">Events Hosted</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">50+</div>
              <div className="mt-2 text-lg text-blue-100">Cities Worldwide</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Join our community today and start discovering amazing tech events
              in your area.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="h-12 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-12 px-8 text-lg font-semibold text-gray-600 hover:text-gray-900"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer/>

    </div>
  );
}
