import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const HeroContent = () => {
  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const priceRef = useRef(null);
  const paraRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from(headlineRef.current, {
      y: 40,
      opacity: 0,
      duration: 1,
      delay: 0.1,
    })
    .from(paraRef.current, {
      y: 25,
      opacity: 0,
      duration: 0.8,
    }, '-=0.5')
    .from(priceRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
    }, '-=0.4');

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full h-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 items-center relative z-10 pointer-events-none">
      
      {/* Left Column: Big Headline & Paragraph Description */}
      <div className="md:col-span-5 lg:col-span-5 pt-8 md:pt-0 flex flex-col gap-6 pointer-events-auto">
        <h1 ref={headlineRef} className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-medium leading-[0.98] tracking-tight text-kreo-dark">
          Design Meets <br />
          Performance.
        </h1>

        <p ref={paraRef} className="text-xs sm:text-sm md:text-[15px] text-gray-700 leading-relaxed max-w-sm font-normal">
          A great setup isn't just about how it looks it's about how it feels. The smooth keystrokes, the effortless clicks, and the little details that make long hours at your desk feel more comfortable. Products designed to become part of your everyday routine.
        </p>
      </div>

      {/* Center Spacer for Keyboard */}
      <div className="hidden md:block md:col-span-3 lg:col-span-4" />

      {/* Right Column: CTA Badge */}
      <div className="md:col-span-4 lg:col-span-3 flex flex-col items-start md:items-start pt-2 md:pt-0 gap-6 pointer-events-auto self-start md:self-center">
        <div ref={priceRef} className="bg-kreo-purple text-white font-medium text-xs sm:text-sm md:text-base px-4 py-1.5 rounded-full shadow-md tracking-wider cursor-pointer">
          Learn More
        </div>
      </div>

    </div>
  );
};

export default HeroContent;
