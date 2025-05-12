"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import "swiper/css";
import Code from '@/assets/Code.avif';

const HeroCarousel = () => {
  return (
    <section className="flex justify-center items-center h-auto min-h-[91vh] px-4 sm:px-6 ">
      <div className="max-w-7xl w-full flex flex-col-reverse md:flex-row items-center gap-6 md:gap-10 text-center md:text-left">
        
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
            <Button className="w-full sm:w-1/3">Start Coding →</Button>
            <Button variant="outline" className="w-full sm:w-1/3">Explore Features →</Button>
          </div>
        </div>

        {/* Right Content (Swiper) */}
        <div className="w-full md:w-1/2 flex justify-center ">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={10}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 3000 }}
            className="rounded-xl overflow-hidden w-full max-w-xl max-h-max "
          >
            <SwiperSlide>
              <Image 
                src={Code} 
                alt="Feature Image"
                layout="responsive"
                width={500}
                height={500}
                className="rounded-xl "
              />
            </SwiperSlide>
          </Swiper>
        </div>

      </div>
    </section>
  );
};

export default HeroCarousel;
