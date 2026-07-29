import React, { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const BottomNavDock = () => {
  const dockRef = useRef(null);

  useGSAP(() => {
    gsap.from(dockRef.current, {
      y: 60,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: 'back.out(1.7)',
    });
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
      <div 
        ref={dockRef}
        className="bg-[#111113]/95 backdrop-blur-md text-white px-3 py-2 rounded-[4px] flex items-center justify-between gap-6 sm:gap-12 md:gap-20 shadow-2xl border border-white/10"
      >
        
        {/* Left Pill: Explore Products */}
        <button className="bg-kreo-purple hover:bg-kreo-purple-dark text-white text-xs sm:text-sm font-medium px-4 sm:px-5 py-2.5 rounded-[4px] transition-all duration-200 hover:shadow-lg active:scale-95 cursor-pointer whitespace-nowrap">
          Explore Products
        </button>

        {/* Center: Kreo Logo */}
        <div className="flex items-center justify-center">
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-montreal">
            kreo<span className="text-kreo-purple">.</span>
          </span>
        </div>

        {/* Right Pill: Buy Now */}
        <button className="bg-white hover:bg-gray-100 text-kreo-dark text-xs sm:text-sm font-medium px-4 sm:px-5 py-2.5 rounded-[4px] flex items-center gap-1.5 transition-all duration-200 hover:shadow-lg active:scale-95 cursor-pointer whitespace-nowrap">
          <span>Buy now</span>
          <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
        </button>

      </div>
    </div>
  );
};

export default BottomNavDock;
