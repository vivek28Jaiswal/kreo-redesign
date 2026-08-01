import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollIndicator — Ultra-minimal low-opacity scroll hint (Apple / Teenage Eng aesthetic).
 * No vertical lines, no loud badges. Just quiet, low-opacity monospace text.
 */
const ScrollIndicator = ({ isRevealed }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (!isRevealed) {
      gsap.set(el, { opacity: 0 });
      return;
    }

    // Reveal softly on initial page load
    gsap.to(el, {
      opacity: 1,
      duration: 1.2,
      delay: 1.0,
      ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
    });

    // Fade out completely as user scrolls down into chapters
    const journeyContainer = document.getElementById('product-journey-container');
    if (!journeyContainer) return;

    const st = ScrollTrigger.create({
      trigger: journeyContainer,
      start: 'top top',
      end: 'top -120px',
      onLeave: () => {
        gsap.to(el, { opacity: 0, duration: 0.4, ease: 'power2.in' });
      },
      onEnterBack: () => {
        gsap.to(el, { opacity: 1, duration: 0.6, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' });
      },
    });

    return () => st.kill();
  }, [isRevealed]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none opacity-0"
    >
      <span className="text-[10px] uppercase font-mono tracking-[0.35em] text-neutral-400/50 font-normal">
         scroll to explore 
      </span>
    </div>
  );
};

export default ScrollIndicator;
