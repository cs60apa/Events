"use client";

import { Button } from "@/components/ui/button";
import { CalendarDays, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TechMeet</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/events"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Events
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Button variant="outline" onClick={signOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/events"
                className="text-gray-700 hover:text-gray-900 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-gray-900 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-gray-900 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button variant="ghost" className="w-full mb-2">
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button variant="ghost" className="w-full mb-2">
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
