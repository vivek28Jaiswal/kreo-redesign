import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * HeroLandingHeader — Initial Landing Title & Model Description.
 * Visible on screen load alongside the 3D model, smoothly fades & dissolves out
 * as user begins scrolling, guaranteed to hide during product journey.
 */
const HeroLandingHeader = ({ isRevealed }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (!isRevealed) {
      gsap.set(el, { opacity: 0, filter: 'blur(12px)', display: 'none' });
      return;
    }

    // Reveal entrance when page loader finishes
    gsap.set(el, { display: 'block' });
    gsap.to(el, {
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.2,
      delay: 0.5,
      ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
    });

    // Dissolve out reliably on scroll as user enters Section 01
    const st = ScrollTrigger.create({
      trigger: '#product-journey-container',
      start: 'top top',
      end: 'top -200px',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress; // 0 (hero) to 1 (scrolled down)
        const opacity = Math.max(0, 1 - progress * 1.8);
        const blur = (1 - opacity) * 12;

        gsap.set(el, {
          opacity: opacity,
          filter: `blur(${blur}px)`,
          display: opacity <= 0.01 ? 'none' : 'block',
        });
      },
    });

    return () => st.kill();
  }, [isRevealed]);

  return (
    <div
      ref={containerRef}
      className="fixed top-1/2 left-8 md:left-20 lg:left-32 -translate-y-1/2 z-30 max-w-sm md:max-w-md pointer-events-none select-none opacity-0"
    >
      {/* Model Name / Hero Title */}
      <h1 className="text-4xl md:text-5xl xl:text-6xl leading-[1.06] tracking-tight mb-4 text-neutral-900">
        <span className="block font-medium text-neutral-900">Kreo</span>
        <span className="block font-medium text-neutral-900">Hive 75.</span>
      </h1>

      {/* Sub-paragraph Description */}
      <p className="text-sm md:text-base text-neutral-500 font-normal leading-[1.7] max-w-xs md:max-w-sm">
        A custom mechanical keyboard engineered for uncompromised tactile precision. Featuring factory-lubed Graywood switches, gasket-mount acoustics, and CNC aluminum construction.
      </p>
    </div>
  );
};

export default HeroLandingHeader;
