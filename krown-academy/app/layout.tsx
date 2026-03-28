import type { Metadata } from "next";
import { AuthProvider } from "../context/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://krownacademy.org'),
  title: "Krown Academy | Earn Your Krown",
  description: "A private school for at-risk youth and student-athletes in Winston-Salem / Kernersville, NC. Tuition-free for qualifying Opportunity Scholarship families.",
  keywords: ["Krown Academy", "private school", "Kendall Nelson", "wrestling", "student athletes", "Opportunity Scholarship", "NC", "at-risk youth"],
  openGraph: {
    title: "Krown Academy | Earn Your Krown",
    description: "Athletics. Academics. Mentoring. A private school for at-risk youth and student-athletes. 100% College Readiness Guarantee.",
    url: "https://krownacademy.org",
    siteName: "Krown Academy",
    images: [{ url: "/Krown_Academy_New_Logo.png.png", width: 1200, height: 630, alt: "Krown Academy Logo" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krown Academy | Earn Your Krown",
    description: "Athletics. Academics. Mentoring. A private school for at-risk youth and student-athletes in Winston-Salem, NC.",
    images: ["/Krown_Academy_New_Logo.png.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-krown-white">
        <AuthProvider>
          <main>{children}</main>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
