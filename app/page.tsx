"use client";
import Image from "next/image";
import Recursion_tree from "@/assets/Recursion_tree.png";
import Code_Execution from "@/assets/Code_execution.png";
import Compare from '@/assets/Compare.png'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CodeSnip from '@/assets/Codesnippet.jpeg'

export default function Home() {
  const router = useRouter();
  const [id, setId] = useState<string | number | readonly string[] | undefined>(
    ""
  );
  return (
    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 pb-10 sm:pb-10 md:grid-cols-3 sm:flex-col md:flex-row lg:flex-row gap-10 px-5 sm:px-8 md:px-10 lg:px-10 py-20">
      <div className="flex-1 h-88 p-5 flex flex-col gap-3 border-2 rounded-xl hover:shadow-lg hover:z-30">
        <h1 className="text-xl font-bold">Leetcode Profile Analysis</h1>
        <p>
          Enter your LeetCode ID to view your problem-solving history, ranking,
          badges, and progress over time.
        </p>
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          type="text"
          placeholder="Enter Your Leetcode Username"
          className="w-full border p-2 text-sm md:text-base rounded-md outline-none"
        />
        <Button>
          Analyse Profile
        </Button>
      </div>

      <div
        className="flex-1 h-88 p-5 flex flex-col gap-3 border-2 rounded-xl cursor-pointer hover:shadow-lg hover:z-30"
        onClick={() => router.push("/codesnippet")}
      >
        <h1 className="text-xl font-bold">Save Code Snippets</h1>
        <p>
        Store and organize your favorite code snippets for quick access and reuse.
        </p>
        <div className="flex items-center justify-center">
        <Image src={CodeSnip} alt="" className="h-28 w-36 bg-blend-normal" />
        </div>
      </div>

      <div
        className="flex-1 h-88 p-5 flex flex-col gap-3 border-2 rounded-xl cursor-pointer hover:shadow-lg hover:z-30"
        onClick={() => router.push("/code")}
      >
        <h1 className="text-xl font-bold">Recursion Tree Visualization</h1>
        <p>
          Visualize recursion trees for your code to understand function call
          structures better.
        </p>
        <div className="flex items-center justify-center">
          <Image src={Recursion_tree} alt="" className="h-28 w-36" />
        </div>
      </div>
      
      <div
        className="flex-1 h-88 p-5 flex flex-col gap-3 border-2 rounded-xl cursor-pointer hover:shadow-lg hover:z-30"
        onClick={() => router.push("/execution")}
      >
        <h1 className="text-xl font-bold">Code Execution Flow</h1>
        <p>Understand your program&apos;s execution order for easier debugging and logic tracing.</p>

        <div className="flex items-center justify-center">
          <Image src={Code_Execution} alt="" className="h-28 w-36" />
        </div>
      </div>
      <div
        className="flex-1 h-88 p-5 flex flex-col gap-3 border-2 rounded-xl cursor-pointer hover:shadow-lg hover:z-30"
        onClick={() => router.push("/compare")}
      >
        <h1 className="text-xl font-bold">Compare Profiles</h1>
        <p>Compare your LeetCode profile with others to see how your problem-solving skills stack up.</p>

        <div className="flex items-center justify-center">
          <Image src={Compare} alt="" className="h-28 w-36" />
        </div>
      </div>
    </div>
  );
}

{
  /* <div className='flex-1 flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='lg:w-2/5 md:w-1/2 sm:w-3/4 w-[90%]'>
        <div className='flex justify-between '>
          <Image alt='' src={LeetcodeImage} className='rounded-full lg:w-32 lg:h-32 w-12 h-12 md:w-28 md:h-28' />
          <p className='font-bold lg:text-4xl text-xl md:text-3xl'>
            LeetCode Chill
            <br />
            Guy Analyzer
          </p>
          <Image alt='' src={ChillGuy} className='rounded-full lg:w-32 lg:h-32 w-16 h-16 md:w-28 md:h-28' />
        </div>
        <p className='mt-4 text-center text-gray-500 text-md lg:text-lg'>
          Enter your LeetCode username to discover how chill are you and see how your problem-solving journey aligns with the zen of coding.
        </p>
        <div className='p-5 flex gap-2 flex-col items-center justify-center mt-5 rounded-md bg-white'>
          <input value={id} onChange={(e)=>setId(e.target.value)} type='text' placeholder='Enter Your Leetcode Username' className='w-full border p-2 text-sm md:text-base rounded-md outline-none'/>
          <button onClick={() => router.push(`/analyse/${id}`)} className='w-full p-2 bg-black py-2  text-white rounded-md font-semibold text-sm md:text-base'>Analyse Profile</button>
          <button onClick={() => router.push(`/compare`)} className='w-full p-2 bg-black py-2  text-white rounded-md font-semibold text-sm md:text-base'>Compare User</button>
        </div>
      </div>
    </div> */
}
