"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@pizzaconstructor/ui";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaHref: string;
  tag: string;
}

const slides: Slide[] = [
  {
    id: 0,
    title: "Tasty Pizza",
    subtitle: "Artisanal Craftsmanship",
    description: "The pizza that you'll always remember. Baked to perfection with stone-milled flour and San Marzano tomatoes.",
    image: "/img/pizza_medium.png",
    ctaText: "Explore Full Menu",
    ctaHref: "/menu",
    tag: "Signature Recipes",
  },
  {
    id: 1,
    title: "Build Your Own Pizza",
    subtitle: "Interactive Customizer",
    description: "Combine the exact ingredients and crusts you desire with real-time price, weight, and allergen calculation.",
    image: "/img/create_pizza_medium.png",
    ctaText: "Launch Pizza Builder",
    ctaHref: "/constructor",
    tag: "Live Constructor",
  },
  {
    id: 2,
    title: "Best Location",
    subtitle: "Heart of the City",
    description: "Situated in the vibrant cultural district, easily accessible with warm ambiance and fast table/takeaway service.",
    image: "/img/location_medium.png",
    ctaText: "Start Group Order",
    ctaHref: "/group-order",
    tag: "Visit Us",
  },
];

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border border-[#34495e]/60 bg-gradient-to-br from-[#1a252f] via-[#0f171e] to-[#1a252f] shadow-2xl shadow-black/50"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative min-h-[460px] sm:min-h-[500px] flex items-center">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out grid grid-cols-1 lg:grid-cols-12 items-center p-6 sm:p-12 gap-8 ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-4 text-left">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#f39c12]/15 border border-[#f39c12]/30 text-[#f39c12] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{slide.tag}</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-extrabold text-[#ecf0f1] font-display tracking-tight leading-tight">
                  {slide.title}
                </h2>

                <p className="text-[#f39c12] font-semibold text-base sm:text-lg">
                  {slide.subtitle}
                </p>

                <p className="text-[#95a5a6] text-sm sm:text-base max-w-xl leading-relaxed">
                  {slide.description}
                </p>

                <div className="pt-4 flex flex-wrap gap-3">
                  <Link href={slide.ctaHref}>
                    <Button variant="primary" size="lg" className="shadow-lg shadow-[#f39c12]/30">
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/menu">
                    <Button variant="outline" size="lg">
                      View Menu
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Hero Image */}
              <div className="lg:col-span-5 flex justify-center items-center relative">
                <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-2xl overflow-hidden shadow-2xl border border-[#34495e]/80 group">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f171e]/60 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#0f171e]/80 hover:bg-[#f39c12] text-[#ecf0f1] hover:text-[#0f171e] border border-[#34495e] flex items-center justify-center transition-all shadow-lg"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#0f171e]/80 hover:bg-[#f39c12] text-[#ecf0f1] hover:text-[#0f171e] border border-[#34495e] flex items-center justify-center transition-all shadow-lg"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === currentSlide
                ? "w-8 bg-[#f39c12] shadow-[0_0_10px_#f39c12]"
                : "w-2.5 bg-[#34495e] hover:bg-[#7f8c8d]"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
