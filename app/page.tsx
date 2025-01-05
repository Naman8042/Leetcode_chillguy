"use client"
import LeetcodeImage from '@/assets/leetcode-logo.jpeg'
import ChillGuy from '@/assets/chill_guy.png'
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const[id,setId] = useState<string | number | readonly string[] | undefined>("")
  return (
    <div className='flex flex-col items-center justify-center h-svh bg-gray-100'>
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
        <div className='p-8 flex gap-2 flex-col items-center justify-center mt-5 rounded-md bg-white'>
          <input value={id} onChange={(e)=>setId(e.target.value)} type='text' placeholder='Enter Your Leetcode Username' className='w-full border p-3 text-base md:text-lg rounded-md outline-none'/>
          <button onClick={() => router.push(`/analyse/${id}`)} className='w-full p-2 bg-black py-2  text-white rounded-md font-semibold text-sm md:text-base'>Analyse Profile</button>
          <button className='w-full p-2 bg-black py-2  text-white rounded-md font-semibold text-sm md:text-base'>Compare User</button>
        </div>
      </div>
    </div>
  );
}
