"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Button } from "@/components/ui/button";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HeroCarousel = () => {
  return (
    <section className="flex justify-center items-center min-h-[78.5vh] px-4 sm:px-6">
      <div className="max-w-7xl w-full flex flex-col-reverse md:flex-row items-center gap-8 text-center md:text-left">
        
        {/* Left Content */}
        <div className="w-full md:w-1/2">
          <span className="bg-gray-100 text-black px-3 py-2 rounded-lg font-semibold text-lg inline-block">
            Empower Your Coding Journey
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mt-3">
            Save Code, Visualize Recursion, Analyze Performance
          </h1>
          <p className="text-gray-600 mt-4 text-base sm:text-lg">
            Enhance your coding experience with tools for saving snippets, executing code, and analyzing LeetCode profiles effortlessly.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Button className="w-full sm:w-auto">Start Coding →</Button>
            <Button variant="outline" className="w-full sm:w-auto">Explore Features →</Button>
          </div>
        </div>

        {/* Right Content (Swiper) */}
        <div className="w-full md:w-1/2">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 3000 }}
            navigation
            pagination={{ clickable: true }}
            className="rounded-xl overflow-hidden"
          >
            {["code-snippet.png", "recursion-tree.png", "leetcode-analysis.png"].map((img, index) => (
              <SwiperSlide key={index}>
                <img 
                  src={`/images/${img}`} 
                  alt={`Feature ${index + 1}`} 
                  className="w-full h-auto object-cover rounded-xl shadow-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
};

export default HeroCarousel;
