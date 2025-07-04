"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import "swiper/css";
import Code from '@/assets/Code.avif';

const HeroCarousel = () => {
  return (
    <section className="flex justify-center items-center h-dvh pt-28  px-4 sm:px-6 py-10">
  <div className="max-w-7xl w-full flex flex-col-reverse md:flex-row items-center gap-6 md:gap-10 text-center md:text-left">

    {/* Left Content */}
    <div className="w-full md:w-1/2">
      <span className="bg-gray-100 text-black px-1.5 sm:px-3 py-1 sm:py-2 rounded-lg font-semibold text-base ms:text-lg inline-block">
        Empower Your Coding Journey
      </span>
      <h1 className="text-lg sm:text-4xl md:text-6xl font-bold text-gray-900 mt-3">
        Save Code, Visualize Recursion, Analyze Performance
      </h1>
      <p className="text-gray-600 mt-4 text-base sm:text-lg">
        Enhance your coding experience with tools for saving snippets, executing code, and analyzing LeetCode profiles effortlessly.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <Button className="w-full sm:w-1/3">Start Coding →</Button>
        <Button variant="outline" className="w-full sm:w-1/3">Explore Features →</Button>
      </div>
    </div>

    {/* Right Content (Swiper) */}
    <div className="w-full md:w-1/2 flex justify-center max-w-xs sm:max-w-sm md:max-w-full">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={10}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000 }}
        className="w-full h-auto"
      >
        <SwiperSlide>
          <Image 
            src={Code} 
            alt="Feature Image"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-[40vh] sm:h-auto rounded-xl"
          />
        </SwiperSlide>
      </Swiper>
    </div>

  </div>
</section>

  );
};

export default HeroCarousel;
