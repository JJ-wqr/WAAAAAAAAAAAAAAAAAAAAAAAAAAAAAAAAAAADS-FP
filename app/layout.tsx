import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/authprovider";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Linguiny – Learn Languages Fast",
    template: "%s | Linguiny"
  },
  description: "Your personal language learning companion. Master new languages with interactive lessons, flashcards, and AI-powered conversations.",
  keywords: ["language learning", "vocabulary", "lessons", "flashcards", "AI tutor", "conversation practice"],
  authors: [{ name: "Linguiny Team" }],
  creator: "Linguiny",
  publisher: "Linguiny",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://linguiny.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://linguiny.com",
    title: "Linguiny – Learn Languages Fast",
    description: "Your personal language learning companion. Master new languages with interactive lessons, flashcards, and AI-powered conversations.",
    siteName: "Linguiny",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Linguiny - Language Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Linguiny – Learn Languages Fast",
    description: "Your personal language learning companion. Master new languages with interactive lessons, flashcards, and AI-powered conversations.",
    images: ["/og-image.png"],
    creator: "@linguiny",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased min-h-screen bg-[var(--bg-page)] text-[var(--text-base)]`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
