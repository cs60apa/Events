import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexProvider } from "@/providers/convex-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TechMeet - Tech Meetup Events Platform",
  description: "Connect, Learn, and Grow with the Tech Community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ConvexProvider>
          <AuthProvider>
            <Header />
            {children}
            <Footer />
            <Toaster />
          </AuthProvider>
        </ConvexProvider>
      </body>
    </html>
  );
}
