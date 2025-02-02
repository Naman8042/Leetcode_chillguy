"use client"
import Navbar_logo from '@/assets/Navbar_logo.png'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const router = useRouter()
  return (
    <div className="p-5 shadow-md z-50 flex justify-between items-center h-16 px-5 sm:px-8 md:px-10">
    <div className="flex items-center cursor-pointer" onClick={() => router.push(`/`)}>
      <Image src={Navbar_logo} alt="" className="h-8 w-8" />
      <h1 className="text-2xl font-bold ml-2">LeetCode Analyser</h1>
    </div>
    <div className="hidden sm:flex gap-5 text-base font-semibold">
      <div onClick={() => router.push(`/`)} className='cursor-pointer'>Analyse</div>
      <div onClick={() => router.push(`/compare`)} className='cursor-pointer'>Compare</div>
      <div onClick={() => router.push(`/code`)} className='cursor-pointer'>Recursion tree</div>
      <div onClick={() => router.push(`/execution`)} className='cursor-pointer'>Execution Flow</div>
    </div>
  </div>
  
  )
}

export default Navbar