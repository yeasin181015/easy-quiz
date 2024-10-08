import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";
import { EasyQuizProvider } from "@/contexts/dbContext";

export const metadata: Metadata = {
  title: "Easy Quiz",
  description: "Quiz platform for admin and users",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <EasyQuizProvider>
          <Navbar />
          {children}
        </EasyQuizProvider>
      </body>
    </html>
  );
}
