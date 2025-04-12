import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/contexts/UserContext";
import { Header } from "@/components/Header";
import { QueryProvider } from "@/providers/QueryProvider";

const inter = Inter();

export const metadata: Metadata = {
  title: "Stepful Coaching Take Home - Andrew Clark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <UserProvider>
            <Header />
            {children}
          </UserProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
