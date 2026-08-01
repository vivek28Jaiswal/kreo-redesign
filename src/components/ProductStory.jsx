import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Motion System Easings:
 * - Editorial Typography Reveal: High-precision in-place spawn curve
 * - Typography Exit: Soft, quiet in-place dissolve curve
 */
const EASE_EDITORIAL_ENTER = 'cubic-bezier(0.16, 1, 0.3, 1)';
const EASE_EDITORIAL_EXIT = 'cubic-bezier(0.4, 0, 1, 1)';

const sections = [
  {
    id: 's01',
    align: 'left',
    eyebrow: '01 // Keybed Dynamics',
    headingLight: 'Tactile',
    headingBold: 'Precision.',
    subtitle: 'Engineered key travel with zero stem wobble. Every keystroke delivers clean, predictable acoustic feedback.',
    spec: '3.6mm Travel · 40g Actuation',
  },
  {
    id: 's02',
    align: 'right',
    eyebrow: '02 // Switch Core',
    headingLight: 'Graywood V4',
    headingBold: 'Actuation.',
    subtitle: 'Factory-lubed POM stem and PC housing engineered for a signature deep marble thock sound profile.',
    spec: 'Pre-Lubed · Polycarbonate Housing',
  },
  {
    id: 's03',
    align: 'left',
    eyebrow: '03 // Craftsmanship',
    headingLight: '6063 CNC',
    headingBold: 'Aluminum.',
    subtitle: 'Hand-milled chamfered edges, micro-bead sandblasting finish, and durable double-shot PBT keycaps.',
    spec: 'Anodized Finish · Chamfered Edge',
  },
  {
    id: 's04',
    align: 'right',
    eyebrow: '04 // Control',
    headingLight: 'Machined',
    headingBold: 'Rotary Dial.',
    subtitle: '32 tactile detents for instant volume, brightness, and audio media control. Knurled aluminum finish.',
    spec: '32 Detents · Infinite Scroll',
  },
  {
    id: 's05',
    align: 'left',
    eyebrow: '05 // Speed',
    headingLight: 'Sub-1ms',
    headingBold: 'Response.',
    subtitle: '1000Hz polling rate. Zero perceptible input lag across 2.4GHz ultra-fast wireless and USB-C wired.',
    spec: '1000Hz Polling · 0.8ms Latency',
  },
  {
    id: 's06',
    align: 'right',
    eyebrow: '06 // Architecture',
    headingLight: 'Acoustic',
    headingBold: 'Stack.',
    subtitle: 'Multi-layer precision dampened construction absorbs every hollow resonance from the inside out.',
    spec: 'PORON Foam · IXPE Pad · FR4 Plate',
  },
  {
    id: 's07',
    align: 'center',
    eyebrow: 'Industrial Masterpiece',
    headingLight: 'Kreo',
    headingBold: 'Mechanical.',
    subtitle: 'Crafted for creators, programmers, and purists. An uncompromised typing experience.',
    spec: 'Custom Keycaps · Hot-Swappable',
  },
];

const SectionStage = ({ section }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const specRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    const heading = headingRef.current;
    const subtitle = subtitleRef.current;

    if (!el) return;

    const elements = [heading, subtitle].filter(Boolean);

    // Initial state: 100% static in place (zero Y translation), hidden via opacity + blur + clipPath
    gsap.set(elements, {
      opacity: 0,
      y: 0,
      filter: 'blur(12px)',
    });
    if (heading) {
      gsap.set(heading, { clipPath: 'inset(0% 0% 100% 0%)' });
    }

    // In-Place Spawn Reveal Animation
    const playEntrance = () => {
      gsap.killTweensOf(elements);
      const tl = gsap.timeline();

      if (heading) {
        tl.to(heading, {
          opacity: 1,
          filter: 'blur(0px)',
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.9,
          ease: EASE_EDITORIAL_ENTER,
        });
      }

      if (subtitle) {
        tl.to(
          subtitle,
          {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.7,
            ease: EASE_EDITORIAL_ENTER,
          },
          '-=0.5'
        );
      }
    };

    // In-Place Dissolve Exit Animation
    const playExit = () => {
      gsap.killTweensOf(elements);
      gsap.to(elements, {
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.45,
        stagger: 0.03,
        ease: EASE_EDITORIAL_EXIT,
        onComplete: () => {
          if (heading) gsap.set(heading, { clipPath: 'inset(0% 0% 100% 0%)' });
        },
      });
    };

    // Trigger entrance when section enters middle of screen
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 65%',
      end: 'bottom 35%',
      onEnter: playEntrance,
      onLeave: playExit,
      onEnterBack: playEntrance,
      onLeaveBack: playExit,
    });

    return () => st.kill();
  }, []);

  const isRight = section.align === 'right';
  const isCenter = section.align === 'center';

  const alignClasses = isCenter
    ? 'items-center justify-center text-center'
    : isRight
    ? 'items-center justify-end text-right'
    : 'items-center justify-start text-left';

  const textAlign = isCenter ? 'text-center' : isRight ? 'text-right' : 'text-left';
  const px = 'px-8 md:px-24 lg:px-36';

  return (
    <section
      ref={containerRef}
      className={`relative w-full h-screen flex ${alignClasses} ${px} pointer-events-none select-none`}
    >
      <div
        ref={contentRef}
        className={`max-w-sm md:max-w-md flex flex-col ${isRight ? 'items-end' : isCenter ? 'items-center' : 'items-start'} ${textAlign}`}
      >
        {/* Eyebrow Label */}
        {/* {section.eyebrow && (
          <span
            ref={eyebrowRef}
            className="block text-[11px] uppercase tracking-[0.26em] font-mono text-neutral-400 mb-3 will-change-transform"
          >
            {section.eyebrow}
          </span>
        )} */}

        {/* Editorial Heading */}
        <h2
          ref={headingRef}
          className={`text-4xl md:text-5xl xl:text-6xl leading-[1.06] tracking-tight mb-4 text-neutral-900 ${textAlign} will-change-transform`}
        >
          <span className="block font-light text-neutral-900">{section.headingLight}</span>
          <span className="block font-medium text-neutral-900">{section.headingBold}</span>
        </h2>

        {/* Editorial Paragraph */}
        <p
          ref={subtitleRef}
          className={`text-sm text-neutral-500 font-normal mb-4 max-w-xs ${textAlign} will-change-transform`}
          style={{ margin: isCenter ? '0 auto 16px' : undefined }}
        >
          {section.subtitle}
        </p>

        {/* Specification Label */}
        {/* {section.spec && (
          <span
            ref={specRef}
            className="block text-[10px] font-mono tracking-[0.22em] uppercase text-neutral-400 will-change-transform"
          >
            {section.spec}
          </span>
        )} */}
      </div>
    </section>
  );
};

const ProductStory = () => {
  return (
    <div className="relative w-full pointer-events-none select-none">
      {sections.map((section) => (
        <SectionStage key={section.id} section={section} />
      ))}
    </div>
  );
};

export default ProductStory;
