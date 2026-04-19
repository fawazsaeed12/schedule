import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ScheduleProvider } from "@/context/ScheduleContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UniSync | Timetable Tracker",
  description: "Dynamic schedule and attendance tracker for Cybersecurity BSCYS 2A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <ScheduleProvider>
          {children}
        </ScheduleProvider>
      </body>
    </html>
  );
}
