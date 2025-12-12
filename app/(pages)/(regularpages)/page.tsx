"use client";
// import Image from "next/image";
// import Recursion_tree from "@/assets/Recursion_tree.png";
// import Code_Execution from "@/assets/Code_execution.png";
// import Resume_Builder from '@/assets/Resume_builder.png'
// import Compare from "@/assets/Compare.png";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import CodeSnip from "@/assets/Codesnippet.jpeg";
import HeroCarousel from "@/app/_component/Herocarouel";
// import toast from "react-hot-toast";
import Grid from '@/app/_component/Grid'

export default function Home() {
  return (
    <div className="">
      <HeroCarousel />
      <Grid />
    </div>
  );
}

// function Grid() {
//   const router = useRouter();
//   const [id, setId] = useState<string | number | readonly string[] | undefined>(
//     ""
//   );
//   return (
//     // Enhanced Grid Component with Improved Styling
//     <div className="max-w-7xl mx-auto mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10  py-20">
//       {[
//         {
//           title: "Leetcode Profile Analysis",
//           description:
//             "Enter your LeetCode ID to view your problem-solving history, ranking, badges, and progress over time.",
//           input: true,
//           buttonText: "Analyse Profile",
//         },
//         {
//           title: "Resume Builder",
//           description:
//             "Create a professional resume by entering your personal, academic, and work details. Easily edit and download in A4 format.",
//           image:Resume_Builder,
//           link: "/resume",
//         },

//         {
//           title: "Save Code Snippets",
//           description:
//             "Store and organize your favorite code snippets for quick access and reuse.",
//           image: CodeSnip,
//           link: "/codesnippet",
//         },
//         {
//           title: "Recursion Tree Visualization",
//           description:
//             "Visualize recursion trees for your code to understand function call structures better.",
//           image: Recursion_tree,
//           link: "/code",
//         },
//         {
//           title: "Code Execution Flow",
//           description:
//             "Understand your program's execution order for easier debugging and logic tracing.",
//           image: Code_Execution,
//           link: "/execution",
//         },
//         {
//           title: "Compare Profiles",
//           description:
//             "Compare your LeetCode profile with others to see how your problem-solving skills stack up.",
//           image: Compare,
//           link: "/compare",
//         },
//       ].map((item, index) => (
//         <div
//           key={index}
//           className="flex-1 h-88 p-6 flex flex-col gap-4 border-2 rounded-xl cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
//           onClick={item.link ? () => router.push(item.link) : undefined}
//         >
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//             {item.title}
//           </h1>
//           <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
//           {item.input && (
//             <input
//               value={id}
//               onChange={(e) => setId(e.target.value)}
//               type="text"
//               placeholder="Enter Your Leetcode Username"
//               className="w-full border p-3 text-base rounded-md outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
//             />
//           )}
//           {item.buttonText && (
//             <Button
//               onClick={() => {
//                 if (id) {
//                   router.push(`/analyse/${id}`);
//                 } else {
//                   toast.error("Please enter a LeetCode username");
//                 }
//               }}
//             >
//               {item.buttonText}
//             </Button>
//           )}

//           {item.image && (
//             <div className="flex items-center justify-center mt-4">
//               <Image
//                 src={item.image}
//                 alt={item.title}
//                 className="h-32 w-40 object-cover rounded-lg shadow-md"
//               />
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }
