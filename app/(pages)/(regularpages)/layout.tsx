"use client"
import Navbar from "@/app/_component/Navbar";
import Footer from "@/app/_component/Footer";
import { RecoilRoot } from "recoil";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>
    <RecoilRoot>
    <Navbar/>
    {children}
    <Footer/>
    </RecoilRoot>
    </div>;
}
