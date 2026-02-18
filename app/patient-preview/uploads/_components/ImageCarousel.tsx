"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageCarouselProps {
  images: Array<{ id: number; src: string; alt: string }>;
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="swiper rounded-lg relative">
      <div className="swiper-wrapper relative overflow-hidden rounded-lg">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`swiper-slide transition-opacity duration-300 ${
              index === currentIndex ? "opacity-100" : "opacity-0 absolute inset-0"
            }`}
          >
            <Image
              className="h-full w-full object-cover"
              src={image.src}
              alt={image.alt}
              width={800}
              height={600}
            />
          </div>
        ))}
      </div>

      <div className="swiper-pagination flex justify-center mt-4 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? "w-8 bg-primary dark:bg-accent"
                : "w-2 bg-slate-300 dark:bg-navy-600"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div
        onClick={goToPrev}
        className="swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
        aria-label="Previous slide"
      ></div>

      <div
        onClick={goToNext}
        className="swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
        aria-label="Next slide"
      ></div>
    </div>
  );
}
