import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/contexts/UserContext";
import { Header } from "@/components/Header";
import { QueryProvider } from "@/providers/QueryProvider";
import { SessionTypeProvider } from "@/providers/SessionTypeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stepful Coaching Take Home - Andrew Clark",
  icons: {
    icon: "https://cdn.prod.website-files.com/60fae2951956f7e83dd6018b/60fae2fd5bfe638ea4d6902a_parade-hw5bMw3aDwedptddoSLhya-32.png",
  },
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
            <SessionTypeProvider>
              <Header />
              {children}
            </SessionTypeProvider>
          </UserProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
