"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  LogOutIcon,
  MenuIcon,
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  ImageIcon,
  ChevronRightIcon,
  Settings,
  UserIcon,
  X
} from "lucide-react";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Dashboard" },
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-30 h-full bg-white shadow-xl w-64 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:w-64 flex flex-col`}
      >
        {/* Logo/Brand */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <Link href="/" className="flex items-center space-x-2">
            <ImageIcon className="w-8 h-8 text-primary" />
            <span className="text-lg font-bold text-gray-800">Cloudinary</span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md hover:bg-gray-100 lg:hidden"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition-all ${
                    pathname === item.href
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  } relative`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`h-5 w-5 mr-3 ${pathname === item.href ? "text-primary" : "text-gray-500"}`} />
                  {item.label}
                  {pathname === item.href && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-l-full"></div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User area */}
        {user && (
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <img
                src={user.imageUrl}
                alt={user.username || "User"}
                className="h-9 w-9 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.username || user.fullName || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.emailAddresses[0].emailAddress}
                </p>
              </div>
              <button 
                onClick={handleSignOut}
                className="p-1 rounded hover:bg-gray-100" 
                title="Sign Out"
              >
                <LogOutIcon className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center z-10">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
              >
                <MenuIcon className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-800 lg:ml-0">
                Cloudinary Showcase
              </h1>
            </div>

            {/* User dropdown (mobile-only - since we have user in sidebar) */}
            {user && (
              <div className="relative lg:hidden">
                <button className="flex items-center space-x-1">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img
                      src={user.imageUrl}
                      alt={user.username || "User"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="container mx-auto py-6 px-4">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-3">
          <div className="container mx-auto px-4">
            <p className="text-center text-xs text-gray-500">
              © 2025 Cloudinary Showcase. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}