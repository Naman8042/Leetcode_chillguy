"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Navbar_logo from "../../assets/Navbar_logo.png";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const routes = {
  "Code Snippet": "/codesnippet",
  "Create Resume": "/resume",
  "Recursion Tree": "/code",
  "Execution Flow": "/execution",
  "Compare": "/compare",
};

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { status } = useSession();

  return (
    <nav className="p-5 shadow-md z-50 flex justify-between items-center h-[10vh] px-5 md:px-10 fixed top-0 bg-white w-full">
      {/* Logo */}
      <div
        className="flex items-center cursor-pointer  sm:w-[25%]"
        onClick={() => router.push(`/`)}
      >
        <Image src={Navbar_logo} alt="Logo" width={40} height={40} />
        <h1 className="text-lg md:text-2xl font-bold ml-2 tracking-wide">
          LeetCode Analyser
        </h1>
      </div>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center space-x-6 font-semibold ">
        {Object.entries(routes).map(([name, path]) => (
          <div
            key={path}
            onClick={() => router.push(path)}
            className="cursor-pointer relative group transition-all"
          >
            {name}
            <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></div>
          </div>
        ))}
      </div>

      {/* Buttons & Mobile Menu Toggle */}
      <div className="flex items-center gap-3  w-[25%] justify-end">
        {/* Desktop Buttons */}
        <div className="hidden sm:flex gap-2 w-40 justify-end">
          {status !== "authenticated" ? (
            <>
              <Button onClick={() => router.push(`/login`)}>Login</Button>
              <Button onClick={() => router.push(`/signup`)}>Sign Up</Button>
            </>
          ) : (
            <Button onClick={() => signOut()}>Logout</Button>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button className="sm:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center p-5 sm:hidden"
          >
            {Object.entries(routes).map(([name, path]) => (
              <div
                key={path}
                onClick={() => {
                  router.push(path);
                  setMenuOpen(false);
                }}
                className="cursor-pointer py-2 text-lg font-medium transition-all hover:text-blue-600"
              >
                {name}
              </div>
            ))}

            <div className="w-full flex flex-col gap-3 mt-3">
              {status !== "authenticated" ? (
                <>
                  <Button
                    onClick={() => {
                      router.push(`/login`);
                      setMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      router.push(`/signup`);
                      setMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
