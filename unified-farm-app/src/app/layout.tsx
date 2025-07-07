import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as a common font
import "./globals.css";
import Navbar from "../components/Navbar"; // Import the new Navbar component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Unified Farm Management System",
  description: "A comprehensive platform for modern agriculture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <div className="pt-16"> {/* Add padding-top to account for fixed navbar */}
          {children}
        </div>
      </body>
    </html>
  );
}
