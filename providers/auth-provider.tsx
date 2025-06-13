"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  email: string;
  name: string;
  role: "organizer" | "attendee";
  bio?: string;
  location?: string;
  company?: string;
  skills?: string[];
  linkedinUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  website?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Check if the user ID is a valid Convex ID (not a timestamp)
        if (parsedUser._id && parsedUser._id.length > 20 && !parsedUser._id.match(/^\d+$/)) {
          setUser(parsedUser);
        } else {
          // Clear invalid user data
          localStorage.removeItem("currentUser");
        }
      } catch (error) {
        // Clear corrupted data
        localStorage.removeItem("currentUser");
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // This method is now handled by individual components
    // using the Convex auth.signIn mutation directly
    setIsLoading(true);
    try {
      // This is a placeholder - actual auth is handled in components
      setIsLoading(false);
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
