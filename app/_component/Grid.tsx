"use client";

import React, { useState } from "react";
// In production uncomment the real imports below and remove the mock implementations
// import { useRouter } from "next/navigation";
// import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  Code2,
  GitGraph,
  PlayCircle,
  Scale,
  ArrowRight,
} from "lucide-react";

// ------------------------
// Types
// ------------------------

// A conservative, accurate type for Lucide icon components
type IconType = React.ComponentType<
  React.SVGProps<SVGSVGElement> & { size?: number }
>;

interface Feature {
  title: string;
  description: string;
  icon: IconType;
  link?: string;
  input?: boolean;
  buttonText?: string;
  color: string; // Tailwind text color class, e.g. "text-indigo-500"
}

// ------------------------
// --- MOCK ROUTER (For Preview) ---
// Remove this ENTIRE function in your actual project
const useRouter = () => ({
  push: (path: string) => {
    console.log(`Navigating to ${path}`);
    // alert(`Navigating to: ${path}`);
  },
});

// ------------------------
// --- MOCK LINK (For Preview) ---
// Remove this ENTIRE component in your actual project
const Link = ({
  href,
  children,
  className,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        console.log(`Link Navigating to ${href}`);
        alert(`Link Navigating to: ${href}`);
      }}
      {...props}
    >
      {children}
    </a>
  );
};

// --- MOCK TOAST (For Preview) ---
const toast = {
  error: (msg: string) => alert(msg),
};

// ------------------------
// Features data
// ------------------------
const features: Feature[] = [
  {
    title: "Leetcode Analysis",
    description:
      "Enter your ID to view problem-solving history, badges, and progress tracking.",
    icon: Search,
    input: true,
    buttonText: "Analyse Profile",
    color: "text-blue-500",
  },
  {
    title: "Resume Builder",
    description: "Create a professional resume with auto-formatting. Export to A4 PDF instantly.",
    icon: FileText,
    link: "/resume",
    color: "text-emerald-500",
  },
  {
    title: "Snippet Library",
    description: "Store, organize, and retrieve your favorite algorithms and code snippets.",
    icon: Code2,
    link: "/codesnippet",
    color: "text-indigo-500",
  },
  {
    title: "Recursion Tree",
    description: "Visualize recursive function calls to debug and understand complex logic.",
    icon: GitGraph,
    link: "/code",
    color: "text-purple-500",
  },
  {
    title: "Execution Flow",
    description: "Step-by-step execution visualization for easier debugging and logic tracing.",
    icon: PlayCircle,
    link: "/execution",
    color: "text-amber-500",
  },
  {
    title: "Compare Profiles",
    description: "Benchmark your problem-solving skills against other developers in real-time.",
    icon: Scale,
    link: "/compare",
    color: "text-pink-500",
  },
];

const Grid: React.FC = () => {
  const router = useRouter();

  return (
    <section className="py-20 px-4 sm:px-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Everything you need to <span className="text-indigo-600">Excel</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            A complete suite of tools designed to accelerate your coding interview preparation and career growth.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            // For the LeetCode input card, keep local state so other cards don't share it
            const [localId, setLocalId] = useState("");

            const Icon = feature.icon;

            const CardContent = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -5 }}
                className={`
                  group relative bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full
                  ${feature.link ? "cursor-pointer" : ""}
                `}
                // If this card itself is clickable via link, ensure keyboard accessibility by making it focusable when wrapping with a Link
                role={feature.link ? "link" : undefined}
                tabIndex={feature.link ? 0 : undefined}
                onKeyDown={(e) => {
                  if (feature.link && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    router.push(feature.link);
                  }
                }}
              >
                {/* Gradient Blob Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

                {/* Icon */}
                <div
                  className={`
                    relative w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 bg-slate-50 border border-slate-100
                    ${feature.color}
                  `}
                >
                  {/* lucide icons accept size prop */}
                  <Icon size={28} aria-hidden />
                </div>

                {/* Content */}
                <div className="relative flex-1 space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>

                {/* Special Input Section for First Card */}
                {feature.input && (
                  <div
                    className="relative mt-6 space-y-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative">
                      <input
                        value={localId}
                        onChange={(e) => setLocalId(e.target.value)}
                        type="text"
                        aria-label="LeetCode Username"
                        placeholder="LeetCode Username"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (localId) router.push(`/analyse/${localId}`);
                        else toast.error("Please enter a username");
                      }}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      {feature.buttonText}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                {/* "Learn More" Link Visual Indicator */}
                {feature.link && (
                  <div className="relative mt-6 pt-6 border-t border-slate-100 flex items-center text-indigo-600 font-medium text-sm group-hover:gap-2 transition-all">
                    Try Now{" "}
                    <ArrowRight
                      size={16}
                      className="ml-1 transition-transform group-hover:translate-x-1"
                      aria-hidden
                    />
                  </div>
                )}
              </motion.div>
            );

            if (feature.link) {
              return (
                <Link key={index} href={feature.link} className="block h-full">
                  {CardContent}
                </Link>
              );
            }

            return (
              <div key={index} className="block h-full">
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Grid;
