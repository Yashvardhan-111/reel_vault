//Navbar
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User } from "lucide-react";
import { useNotification } from "./Notification";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-lg border-b border-purple-900/30">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo Section */}
          <div className="flex-none">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 group"
              prefetch={true}
              onClick={() =>
                showNotification("Welcome to ImageKit ReelsPro", "info")
              }
            >
              <Home className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Video with AI
              </span>
            </Link>
          </div>

          {/* User Menu Section */}
          <div className="flex-none">
            <div className="relative group">
              <button className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300">
                <User className="w-5 h-5 text-gray-300 group-hover:text-purple-400 transition-colors" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                <div className="bg-gray-900/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl shadow-purple-500/20 overflow-hidden">
                  {session ? (
                    <>
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-800">
                        <span className="text-sm text-gray-400">
                          {session.user?.email?.split("@")[0]}
                        </span>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/upload"
                          className="flex items-center px-4 py-2 text-gray-300 hover:bg-purple-500/20 hover:text-purple-400 transition-all duration-300"
                          onClick={() =>
                            showNotification("Welcome to Admin Dashboard", "info")
                          }
                        >
                          Video Upload
                        </Link>

                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center px-4 py-2 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-2">
                      <Link
                        href="/login"
                        className="flex items-center px-4 py-2 text-gray-300 hover:bg-purple-500/20 hover:text-purple-400 transition-all duration-300"
                        onClick={() =>
                          showNotification("Please sign in to continue", "info")
                        }
                      >
                        Login
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}