import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Krown Academy | Earn Your Krown",
  description:
    "Athletics & Academics for At-Risk Youth and Student-Athletes. Grades 6-12. Winston-Salem / Kernersville, NC. Founded by Kendall Nelson.",
  keywords: [
    "Krown Academy",
    "private school",
    "at-risk youth",
    "student athletes",
    "wrestling",
    "Winston-Salem",
    "Kernersville",
    "NC",
    "Kendall Nelson",
  ],
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
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
