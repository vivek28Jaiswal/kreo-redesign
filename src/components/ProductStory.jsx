import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
    isFinal: true,
    eyebrow: '',
    headingLight: 'Kreo Mechanical',
    headingBold: '',
    subtitle: 'Built with premium materials, precision engineering, and performance at its core. Every detail is designed to deliver a keyboard that feels as exceptional as it looks.',
    spec: '',
  },
];

/**
 * SectionStage — 100% Fixed Stationary On Screen.
 * Never translates vertically on scroll; fades in and out purely in-place.
 */
const SectionStage = ({ section }) => {
  const stageRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const heading = headingRef.current;
    const subtitle = subtitleRef.current;
    const triggerEl = document.getElementById(section.id);

    if (!stage || !triggerEl) return;

    const elements = [heading, subtitle].filter(Boolean);

    // Initial state: Hidden in-place (zero Y translation, pure opacity + blur + display)
    gsap.set(stage, { opacity: 0, display: 'none' });
    gsap.set(elements, { opacity: 0, y: 0, filter: 'blur(12px)' });

    // In-Place Stationary Reveal
    const playEntrance = () => {
      gsap.set(stage, { display: 'flex', opacity: 1 });
      gsap.killTweensOf(elements);
      const tl = gsap.timeline();

      if (heading) {
        tl.to(heading, {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.7,
          ease: EASE_EDITORIAL_ENTER,
        });
      }

      if (subtitle) {
        tl.to(
          subtitle,
          {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.55,
            ease: EASE_EDITORIAL_ENTER,
          },
          '-=0.4'
        );
      }
    };

    // In-Place Stationary Dissolve
    const playExit = () => {
      gsap.killTweensOf(elements);
      gsap.to(elements, {
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.38,
        stagger: 0.02,
        ease: EASE_EDITORIAL_EXIT,
        onComplete: () => {
          gsap.set(stage, { display: 'none' });
        },
      });
    };

    const st = ScrollTrigger.create({
      trigger: triggerEl,
      start: section.isFinal ? 'top 70%' : 'top 50%',
      end: section.isFinal ? 'bottom 20%' : 'bottom 50%',
      onEnter: playEntrance,
      onLeave: playExit,
      onEnterBack: playEntrance,
      onLeaveBack: playExit,
    });

    return () => st.kill();
  }, [section.id, section.isFinal]);

  const isRight = section.align === 'right';
  const isCenter = section.align === 'center';
  const isFinal = section.isFinal;

  const alignClasses = isCenter
    ? 'items-center justify-center text-center'
    : isRight
    ? 'items-center justify-end text-right'
    : 'items-center justify-start text-left';

  const textAlign = isCenter ? 'text-center' : isRight ? 'text-right' : 'text-left';
  const px = 'px-8 md:px-24 lg:px-36';

  return (
    <div
      ref={stageRef}
      className={`fixed inset-0 ${alignClasses} ${px} pointer-events-none select-none z-30 opacity-0`}
      style={{ display: 'none' }}
    >
      <div
        className={`max-w-sm md:max-w-md lg:max-w-xl flex flex-col ${
          isRight ? 'items-end' : isCenter ? 'items-center' : 'items-start'
        } ${textAlign}`}
      >
        {/* Editorial Heading */}
        <h2
          ref={headingRef}
          className={`text-4xl md:text-5xl xl:text-6xl leading-[1.06] tracking-tight mb-4 ${
            isFinal ? 'text-white font-medium mt-36' : 'text-neutral-900'
          } ${textAlign}`}
        >
          <span className={`block font-medium ${isFinal ? 'text-white' : 'text-neutral-900'}`}>
            {section.headingLight}
          </span>
          {section.headingBold && (
            <span className={`block font-medium ${isFinal ? 'text-white' : 'text-neutral-900'}`}>
              {section.headingBold}
            </span>
          )}
        </h2>

        {/* Editorial Paragraph */}
        <p
          ref={subtitleRef}
          className={`text-sm md:text-base font-normal mb-4 ${
            isFinal ? 'text-white/95 max-w-lg' : 'text-neutral-500 max-w-xs'
          } ${textAlign}`}
          style={{ margin: isCenter ? '0 auto 16px' : undefined }}
        >
          {section.subtitle}
        </p>
      </div>
    </div>
  );
};

const ProductStory = () => {
  return (
    <div className="relative w-full pointer-events-none select-none">
      {/* 1. Fixed Stationary Section Text Stages */}
      {sections.map((section) => (
        <SectionStage key={section.id} section={section} />
      ))}

      {/* 2. Document Flow Invisible Scroll Triggers */}
      {sections.map((section) => (
        <div
          key={`trigger-${section.id}`}
          id={section.id}
          className="w-full h-screen pointer-events-none"
        />
      ))}
    </div>
  );
};

export default ProductStory;
