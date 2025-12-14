"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Code2, Terminal, Play } from "lucide-react";

/** ---------------------------
 * Types
 * --------------------------- */
type ButtonVariant = "primary" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  className?: string;
  children?: React.ReactNode;
}

interface Slide {
  id: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
  code: string;
  color: string;
  borderColor?: string;
}

/** ---------------------------
 * Mock Button (Preview)
 * - Typed; remove and replace with your real Button component in production
 * --------------------------- */
const Button: React.FC<ButtonProps> = ({ children, className = "", variant = "primary", ...props }) => {
  const base =
    "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 h-10 px-6";
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30",
    outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

/** ---------------------------
 * Slides Data
 * --------------------------- */
const slides: Slide[] = [
  {
    id: 1,
    icon: <Code2 className="w-8 h-8 sm:w-12 sm:h-12 text-indigo-500" />,
    title: "Snippet Library",
    desc: "Save and organize your favorite algorithms.",
    code: `function fib(n) {
  if (n <= 1) return n;
  return fib(n-1) + fib(n-2);
}`,
    color: "from-indigo-500/20 to-blue-500/20",
    borderColor: "border-indigo-200",
  },
  {
    id: 2,
    icon: <Terminal className="w-8 h-8 sm:w-12 sm:h-12 text-emerald-500" />,
    title: "Execution Flow",
    desc: "Visualize stack traces in real-time.",
    code: `// Stack Trace:
> fib(5)
  > fib(4)
    > fib(3)
      > fib(2)`,
    color: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-200",
  },
  {
    id: 3,
    icon: <Play className="w-8 h-8 sm:w-12 sm:h-12 text-amber-500" />,
    title: "Instant Run",
    desc: "Compile and test across 10+ languages.",
    code: `Input: [2, 7, 11, 15], Target: 9
Output: [0, 1]
Runtime: 2ms (Beats 98%)`,
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-200",
  },
];

/** ---------------------------
 * HeroCarousel
 * --------------------------- */
const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Auto-advance slides. Depend on slides.length so interval updates if slides change.
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // safety: ensure slide is valid (fallback to first slide)
  const slide = slides[currentSlide] ?? slides[0];

  return (
    <section className="relative w-full min-h-dvh sm:min-h-[90vh]   mt-[9vh] flex items-center justify-center overflow-hidden  ">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[40%] sm:w-[50%] sm:h-[50%] rounded-full bg-indigo-500/5 blur-[80px] sm:blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[60%] h-[40%] sm:w-[40%] sm:h-[40%] rounded-full bg-blue-500/5 blur-[60px] sm:blur-[100px]" />
      </div>

      <div className="max-w-7xl w-full px-4 sm:px-6 md:px-8 z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* LEFT */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 sm:space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] sm:leading-[1.1]"
          >
            Visualize <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Algorithms</span> Like <br /> Never Before
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
            Enhance your coding experience with tools for saving snippets, visualizing recursion trees, and analyzing code performance effortlessly.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Button className="w-full sm:w-auto gap-2">
              Start Coding <ArrowRight size={16} />
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              Explore Features
            </Button>
          </motion.div>
        </div>

        {/* RIGHT (Carousel) */}
        <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[500px] flex items-center justify-center sm:justify-end ">
          {/* Abstract blobs */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] bg-indigo-100 rounded-full blur-2xl sm:blur-3xl opacity-60 animate-pulse" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-[90%] sm:max-w-md bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
            >
              {/* Mac-style header */}
              <div className="bg-slate-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-100 flex items-center gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400" />
                <div className="ml-auto text-xs text-slate-400 font-mono">Main.js</div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-8 space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
                  <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${slide.color}`}>
                    {slide.icon}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">{slide.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-500">{slide.desc}</p>
                  </div>
                </div>

                {/* Code Snippet Block */}
                <div className="relative group">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${slide.color} rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-1000`} />
                  <div className="relative bg-slate-900 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm text-slate-300 overflow-hidden">
                    <pre className="whitespace-pre-wrap break-words"><code>{slide.code}</code></pre>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Navigation */}
          <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => {
              const isActive = currentSlide === index;
              return (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`rounded-full transition-all duration-300 ${isActive ? "bg-indigo-600 w-5 sm:w-6 h-2.5" : "bg-slate-300 hover:bg-slate-400 w-2.5 h-2.5"}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
