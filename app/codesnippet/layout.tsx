"use client";
import {useEffect} from "react";
import Sidebar from "../_component/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const {  status } = useSession();


  useEffect(() => {
      if (status === "loading") return; // Avoid redirection during loading
    
      if (status !== "authenticated") {
        router.push("/api/auth/signin");
      } 
    }, [status]);

  return (
    <div className="flex flex-col md:flex-row md:h-screen pt-16">
      <Sidebar/>
      <div className="flex-1 md:ml-[25%] md:p-6 ">{children}</div>
    </div>
  );
}
