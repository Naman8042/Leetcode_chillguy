"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Assuming you have shadcn/ui or similar
import {
  Menu,
  X,
  ChevronDown,
  Code2,
  LogOut,
  User,
  ScanSearch,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const routes = {
  "Code Snippet": "/codesnippet",
  "Create Resume": "/resume",
  "Recursion Tree": "/code",
  "Execution Flow": "/execution",
  Compare: "/compare",
};

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { data: session, status } = useSession();
  const profileRef = useRef<HTMLDivElement | null>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target as Node)
    ) {
      setProfileOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);


  return (
    <div className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {/* --- Logo Section --- */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => router.push("/")}
        >
          <div className="relative w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
            {/* Layered Icon Effect */}
            <Code2 size={20} strokeWidth={2.5} className="absolute" />
            <ScanSearch
              size={28}
              strokeWidth={1.5}
              className="absolute opacity-0 scale-75 group-hover:opacity-20 group-hover:scale-125 transition-all duration-500"
            />
          </div>
          <div className="flex flex-col justify-center -space-y-1">
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Code<span className="text-indigo-600">Scope</span>
            </span>
          </div>
        </div>

        {/* --- Desktop Navigation --- */}
        <div className="hidden md:flex items-center space-x-8">
          {Object.entries(routes).map(([name, path]) => {
            const isActive = pathname === path;
            return (
              <div
                key={path}
                onClick={() => router.push(path)}
                className={`relative cursor-pointer text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                {name}
                {isActive && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 top-full mt-1 w-full h-0.5 bg-blue-600 rounded-full"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* --- Actions Section (Auth & Mobile Toggle) --- */}
        <div className="flex items-center gap-4">
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {status === "loading" ? (
              // Loading Skeleton
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
            ) : status !== "authenticated" ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => router.push(`/login`)}
                  className="text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                >
                  Log in
                </Button>
                <Button
                  onClick={() => router.push(`/signup`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  Sign Up
                </Button>
              </>
            ) : (
              // Authenticated User Dropdown
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-1 rounded-full border border-gray-200 hover:shadow-md transition-all bg-white"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-blue-200">
                    {session?.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="User"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    ) : (
                      <User size={18} className="text-blue-600" />
                    )}
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform duration-200 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1 ring-1 ring-black ring-opacity-5"
                    >
                      <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                          Signed in as
                        </p>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {session?.user?.email || "User"}
                        </p>
                      </div>

                      <div className="p-1">
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            // Add dashboard route if exists
                            // router.push('/dashboard');
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors flex items-center gap-2"
                        >
                          <Code2 size={16} />
                          My Snippets
                        </button>

                        <button
                          onClick={() => signOut()}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors flex items-center gap-2"
                        >
                          <LogOut size={16} />
                          Log out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* --- Mobile Dropdown Menu --- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden shadow-lg"
          >
            <div className="p-4 space-y-4">
              {/* Mobile Links */}
              <div className="flex flex-col space-y-1">
                {Object.entries(routes).map(([name, path]) => (
                  <div
                    key={path}
                    onClick={() => {
                      router.push(path);
                      setMenuOpen(false);
                    }}
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      pathname === path
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {name}
                  </div>
                ))}
              </div>

              <div className="h-px bg-gray-100 my-2" />

              {/* Mobile Auth */}
              <div className="flex flex-col gap-3 px-1 pb-4">
                {status !== "authenticated" ? (
                  <>
                    <Button
                      onClick={() => {
                        router.push(`/login`);
                        setMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full justify-center"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => {
                        router.push(`/signup`);
                        setMenuOpen(false);
                      }}
                      className="w-full justify-center bg-blue-600"
                    >
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                        {session?.user?.image ? (
                          <Image
                            src={session.user.image}
                            alt="User"
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          session?.user?.name?.[0] || <User size={20} />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">
                          {session?.user?.name || "User"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {session?.user?.email}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        signOut();
                        setMenuOpen(false);
                      }}
                      variant="destructive"
                      className="w-full justify-center"
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
