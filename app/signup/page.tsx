"use client";
import { useState } from "react";
import { SigninForm } from "@/components/signup-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
const Page = () => {
  const router = useRouter()
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userName, setUsername] = useState<string>("");

  const signinHandler = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form default submission behavior
      try{
        const {data}= await axios.post("/api/users/signup",{email,password,userName})
        
        if(data.success===true){
          toast.success(data.message)
          router.push("/login")
        }
        else{
          toast.error(data.message)
        }
        
      }
      catch(err){
        console.log(err)
      }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SigninForm setEmail={setEmail} signinHandler={signinHandler} setPassword={setPassword} setUsername={setUsername}/>
      </div>
    </div>
  );
};

export default Page;
