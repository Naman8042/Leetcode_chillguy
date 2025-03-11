"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { LoginForm } from "@/components/login-form";

const Page = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form default submission behavior
      try{
         await signIn("credentials", {
          redirect: true,
          email,
          password,
          callbackUrl: "/", // Redirect after login
        });
      }
      catch(err){
        console.log(err)
      }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm setEmail={setEmail} loginHandler={loginHandler} setPassword={setPassword} />
      </div>
    </div>
  );
};

export default Page;
