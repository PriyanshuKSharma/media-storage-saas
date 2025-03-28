import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KineticView: SaaS Platform",
  description: "A modern platform for video uploading, downloading, and sharing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-gray-50 text-gray-800`}>
          <div className="min-h-screen flex flex-col">
            <header className="bg-blue-600 text-white py-4 shadow-md">
              <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold">Video SaaS Platform</h1>
              </div>
            </header>
            <main className="flex-grow container mx-auto px-4 py-6">
              {children}
            </main>
            <footer className="bg-gray-800 text-white py-4">
              <div className="container mx-auto text-center">
                <p>&copy; 2025  KineticView: SaaS Platform. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
