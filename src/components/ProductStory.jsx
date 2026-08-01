import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ProductStory — Apple / Teenage Engineering / Awwwards style editorial overlay.
 *
 * Text enters: eyebrow fades up → heading word-by-word → subtitle fades.
 * Text exits: entire block fades out as the next section enters.
 * Zero cards, zero colored boxes. Pure whitespace + typography.
 */

const sections = [
  {
    id: 's01',
    align: 'left',
    eyebrow: '01 // Keybed Dynamics',
    headingLight: 'Tactile',
    headingBold: 'Precision.',
    headingBoldColor: 'text-gray-900',
    subtitle: 'Engineered key travel with zero stem wobble. Every keystroke delivers clean acoustic feedback.',
    spec: '3.6mm Travel · 40g Actuation',
    specColor: 'text-violet-500',
  },
  {
    id: 's02',
    align: 'right',
    eyebrow: '02 // Tactile Engine',
    headingLight: 'Graywood V4',
    headingBold: 'Switch Core.',
    headingBoldColor: 'text-violet-500',
    subtitle: 'Factory-lubed POM stem and PC housing — engineered for a signature deep marble thock.',
    spec: 'Pre-Lubed · Polycarbonate Housing',
    specColor: 'text-gray-400',
  },
  {
    id: 's03',
    align: 'left',
    eyebrow: '03 // Craftsmanship',
    headingLight: '6063 CNC',
    headingBold: 'Aluminum.',
    headingBoldColor: 'text-gray-900',
    subtitle: 'Hand-polished chamfered edges, micro-bead sandblasting, and durable double-shot PBT keycaps.',
    spec: 'Anodized Finish · Chamfered Edges',
    specColor: 'text-amber-500',
  },
  {
    id: 's04',
    align: 'right',
    eyebrow: '04 // Control',
    headingLight: 'Machined',
    headingBold: 'Rotary Dial.',
    headingBoldColor: 'text-emerald-500',
    subtitle: '32 tactile detents for instant volume, brightness, and audio media control. Knurled aluminum.',
    spec: '32 Detents · Infinite Scroll',
    specColor: 'text-gray-400',
  },
  {
    id: 's05',
    align: 'left',
    eyebrow: '05 // Speed',
    headingLight: 'Sub-1ms',
    headingBold: 'Response.',
    headingBoldColor: 'text-cyan-500',
    subtitle: '1000Hz polling rate. Zero perceptible input lag across 2.4GHz wireless and USB-C wired.',
    spec: '1000Hz Polling · 0.8ms Latency',
    specColor: 'text-cyan-500',
  },
  {
    id: 's06',
    align: 'right',
    eyebrow: '06 // Architecture',
    headingLight: 'Acoustic',
    headingBold: 'Stack.',
    headingBoldColor: 'text-violet-500',
    subtitle: '8-layer precision dampened construction absorbs every hollow resonance from the inside out.',
    spec: 'PORON Foam · IXPE Pad · FR4 Plate',
    specColor: 'text-gray-400',
  },
  {
    id: 's07',
    align: 'center',
    eyebrow: 'Industrial Masterpiece',
    headingLight: 'Kreo',
    headingBold: 'Mechanical.',
    headingBoldColor: 'text-gray-900',
    subtitle: 'Crafted for creators, gamers, and purists. Drag to inspect every detail.',
    spec: null,
    specColor: '',
  },
];

const Section = ({ section, index }) => {
  const containerRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const specRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    const eyebrow = eyebrowRef.current;
    const heading = headingRef.current;
    const subtitle = subtitleRef.current;
    const spec = specRef.current;

    if (!el) return;

    // Set initial hidden state
    gsap.set([eyebrow, heading, subtitle, spec].filter(Boolean), {
      opacity: 0,
      y: 28,
    });

    // Entry animation timeline — staggered reveal
    const entryTl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 72%',
        end: 'top 30%',
        toggleActions: 'play none none reverse',
      },
    });

    entryTl
      .to(eyebrow, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      .to(heading, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.3')
      .to(subtitle, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
      .to(spec, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.4');

    // Exit animation — fade out as section leaves upward
    const exitTl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'bottom 60%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });

    exitTl.to([eyebrow, heading, subtitle, spec].filter(Boolean), {
      opacity: 0,
      y: -18,
      duration: 0.5,
      ease: 'power2.in',
      stagger: 0.04,
    });

    return () => {
      entryTl.kill();
      exitTl.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill();
      });
    };
  }, []);

  const isRight = section.align === 'right';
  const isCenter = section.align === 'center';

  const alignClasses = isCenter
    ? 'items-center justify-center text-center'
    : isRight
    ? 'items-center justify-end'
    : 'items-center justify-start';

  const textAlign = isCenter ? 'text-center' : isRight ? 'text-right' : 'text-left';
  const px = 'px-8 md:px-24 lg:px-40';

  return (
    <section
      ref={containerRef}
      className={`relative w-full h-screen flex ${alignClasses} ${px}`}
    >
      <div className={`max-w-sm ${textAlign}`}>
        {/* Eyebrow */}
        <span
          ref={eyebrowRef}
          className="block text-[10px] uppercase tracking-[0.28em] font-mono text-gray-400 mb-4 will-change-transform"
        >
          {section.eyebrow}
        </span>

        {/* Heading */}
        <h2
          ref={headingRef}
          className="text-4xl md:text-5xl xl:text-[58px] leading-[1.05] tracking-tight mb-5 will-change-transform"
        >
          <span className="block font-extralight text-gray-900">{section.headingLight}</span>
          <span className={`block font-semibold ${section.headingBoldColor}`}>{section.headingBold}</span>
        </h2>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-sm text-gray-400 font-normal leading-[1.75] mb-5 max-w-[300px] will-change-transform"
          style={{ margin: isCenter ? '0 auto 20px' : undefined }}
        >
          {section.subtitle}
        </p>

        {/* Spec pill */}
        {section.spec && (
          <span
            ref={specRef}
            className={`text-[10px] font-mono tracking-[0.18em] uppercase ${section.specColor} will-change-transform`}
          >
            {section.spec}
          </span>
        )}
      </div>
    </section>
  );
};

const ProductStory = () => {
  return (
    <div className="relative w-full pointer-events-none select-none">
      {sections.map((section, i) => (
        <Section key={section.id} section={section} index={i} />
      ))}
    </div>
  );
};

export default ProductStory;
