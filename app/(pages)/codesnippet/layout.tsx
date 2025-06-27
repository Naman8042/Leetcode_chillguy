import Sidebar from "../../_component/Sidebar";
import { getServerSession } from "next-auth";
import { option} from "@/app/api/auth/[...nextauth]/option";
import { redirect } from "next/navigation";
import Navbar from "@/app/_component/Navbar";
import Footer from "@/app/_component/Footer";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(option);

  if (!session) {
    redirect("/api/auth/signin");
  }

 return (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <div className="flex flex-col md:flex-row flex-1 pt-16 overflow-hidden">
      <Sidebar />
      <div className="flex-1 md:ml-[25%] md:p-6 overflow-y-auto ">{children}</div>
    </div>
    <Footer />
  </div>
);

}