"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react"; // For icons
import Navbar_logo from '../../assets/Navbar_logo.png'

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="p-5 shadow-md z-50 flex justify-between items-center h-16 px-5 md:px-10 fixed top-0 bg-white w-screen  mx-auto">
      {/* Logo */}
      <div
        className="flex items-center cursor-pointer sm:w-[30%] md:w-1/3"
        onClick={() => router.push(`/`)}
      >
        <Image src={Navbar_logo} alt="Logo" width={32} height={32} />
        <h1 className="text-base md:text-2xl font-bold ml-2">LeetCode Analyser</h1>
      </div>

      {/* Desktop Menu */}
      <div className="hidden sm:flex justify-between text-xs md:text-base font-semibold sm:w-[40%] md:w-1/3">
        <div onClick={() => router.push(`/`)} className="cursor-pointer">Analyse</div>
        <div onClick={() => router.push(`/compare`)} className="cursor-pointer">Compare</div>
        <div onClick={() => router.push(`/code`)} className="cursor-pointer">Recursion Tree</div>
        <div onClick={() => router.push(`/execution`)} className="cursor-pointer">Execution Flow</div>
      </div>

      {/* Buttons & Mobile Menu Toggle */}
      <div className="sm:w-[30%] md:w-1/3 flex justify-end gap-2">
        <div className="hidden sm:flex gap-2">
          <Button onClick={() => router.push(`/login`)}>Login</Button>
          <Button onClick={() => router.push(`/signup`)}>Signin</Button>
        </div>

        {/* Hamburger Icon for Mobile */}
        <button
          className="sm:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center p-5 sm:hidden">
          <div onClick={() => router.push(`/`)} className="cursor-pointer py-2">Analyse</div>
          <div onClick={() => router.push(`/compare`)} className="cursor-pointer py-2">Compare</div>
          <div onClick={() => router.push(`/code`)} className="cursor-pointer py-2">Recursion Tree</div>
          <div onClick={() => router.push(`/execution`)} className="cursor-pointer py-2">Execution Flow</div>
          <div className="w-full flex flex-col gap-2 mt-3">
            <Button onClick={() => router.push(`/login`)} className="w-full">Login</Button>
            <Button onClick={() => router.push(`/signup`)} className="w-full">Signin</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
