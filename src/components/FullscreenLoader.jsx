import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Premium Fullscreen Loader for Kreo
 * 
 * - Block size: 64px desktop / 40px mobile (matching homepage PixelDecorations)
 * - Kreo Logo: Pure crisp WHITE logo from start to finish
 * - Performance: Ultra-optimized Canvas 2D render loop (zero per-block shadow state mutation)
 * - Behavior: Organic random spawning of blocks snapping & welding together into 100% solid purple fill
 * - Timing: max(6 seconds, asset load completion)
 */
const FullscreenLoader = ({ onComplete, onReveal, isAssetReady = true }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const logoRef = useRef(null);

  const [loaderPhase, setLoaderPhase] = useState('assembling'); // 'assembling' | 'holding' | 'dissolving' | 'complete'

  const isModelReadyRef = useRef(isAssetReady);
  const minTimeReachedRef = useRef(false);

  useEffect(() => {
    isModelReadyRef.current = isAssetReady;
  }, [isAssetReady]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Canvas Size Setup
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Block size matching homepage PixelDecorations (64px desktop, 40px mobile)
    const blockSize = width >= 768 ? 64 : 40;
    const cols = Math.ceil(width / blockSize) + 1;
    const rows = Math.ceil(height / blockSize) + 1;
    const totalBlocks = cols * rows;

    const blockList = [];

    // Organic random shuffle
    const indices = Array.from({ length: totalBlocks }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    indices.forEach((shuffledIdx, seq) => {
      const col = shuffledIdx % cols;
      const row = Math.floor(shuffledIdx / cols);
      const seqNormalized = seq / totalBlocks;
      
      const clusterNoise = (Math.sin(col * 0.4) + Math.cos(row * 0.4)) * 0.08;
      const assembleDelay = Math.max(0, Math.min(2.0, seqNormalized * 1.8 + clusterNoise));
      const dissolveDelay = Math.max(0, Math.min(1.0, (1 - seqNormalized) * 0.85 + (Math.random() * 0.15)));

      const lVariant = Math.floor(Math.random() * 4);

      blockList.push({
        x: col * blockSize,
        y: row * blockSize,
        size: blockSize,
        assembleDelay,
        dissolveDelay,
        lVariant,
        assembleProgress: 0,
        dissolveProgress: 0,
        scale: 0.6,
        opacity: 0,
      });
    });

    let currentPhase = 'assembling';

    // Assembly GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        if (currentPhase === 'assembling') {
          currentPhase = 'holding';
          setLoaderPhase('holding');
          checkAndStartDissolve();
        }
      }
    });

    blockList.forEach((b) => {
      tl.to(
        b,
        {
          assembleProgress: 1,
          scale: 1,
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
        },
        b.assembleDelay
      );
    });

    // Minimum 6s Timer
    const minTimer = setTimeout(() => {
      minTimeReachedRef.current = true;
      checkAndStartDissolve();
    }, 6000);

    const checkAndStartDissolve = () => {
      if (minTimeReachedRef.current && isModelReadyRef.current && (currentPhase === 'assembling' || currentPhase === 'holding')) {
        startDissolvePhase();
      }
    };

    const statusInterval = setInterval(() => {
      if (minTimeReachedRef.current && isModelReadyRef.current && (currentPhase === 'assembling' || currentPhase === 'holding')) {
        startDissolvePhase();
      }
    }, 100);

    const startDissolvePhase = () => {
      if (currentPhase === 'dissolving' || currentPhase === 'complete') return;

      currentPhase = 'dissolving';
      setLoaderPhase('dissolving');
      clearInterval(statusInterval);

      if (onReveal) {
        onReveal();
      }

      const dissolveTl = gsap.timeline({
        onComplete: () => {
          currentPhase = 'complete';
          setLoaderPhase('complete');
          if (onComplete) onComplete();
        }
      });

      blockList.forEach((b) => {
        dissolveTl.to(
          b,
          {
            dissolveProgress: 1,
            scale: 0.65,
            opacity: 0,
            duration: 0.5,
            ease: 'power3.inOut',
          },
          b.dissolveDelay
        );
      });
    };

    // Ultra-Fast 60 FPS Render Loop
    const render = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const purpleColor = '#685ACA';

      if (currentPhase === 'assembling' || currentPhase === 'holding') {
        // Solid white canvas background during assembly
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = purpleColor;

        for (let i = 0; i < totalBlocks; i++) {
          const b = blockList[i];
          if (b.assembleProgress <= 0) continue;

          const size = b.size;
          const alpha = b.opacity;
          const scale = b.scale;
          const prog = b.assembleProgress;

          ctx.save();
          ctx.globalAlpha = alpha;

          const centerX = b.x + size / 2;
          const centerY = b.y + size / 2;
          ctx.translate(centerX, centerY);
          ctx.scale(scale, scale);
          ctx.translate(-centerX, -centerY);

          if (prog < 0.85) {
            // L-shape block (Ref 1)
            const half = size / 2;
            switch (b.lVariant) {
              case 0:
                ctx.fillRect(b.x, b.y, half, half);
                ctx.fillRect(b.x, b.y + half, half, half);
                ctx.fillRect(b.x + half, b.y + half, half, half);
                break;
              case 1:
                ctx.fillRect(b.x + half, b.y, half, half);
                ctx.fillRect(b.x, b.y + half, half, half);
                ctx.fillRect(b.x + half, b.y + half, half, half);
                break;
              case 2:
                ctx.fillRect(b.x, b.y, half, half);
                ctx.fillRect(b.x + half, b.y, half, half);
                ctx.fillRect(b.x + half, b.y + half, half, half);
                break;
              default:
                ctx.fillRect(b.x, b.y, half, half);
                ctx.fillRect(b.x + half, b.y, half, half);
                ctx.fillRect(b.x, b.y + half, half, half);
                break;
            }
          } else {
            // Solid block welding into 100% solid purple viewport
            ctx.fillRect(b.x - 0.5, b.y - 0.5, size + 1, size + 1);
          }

          ctx.restore();
        }
      } else if (currentPhase === 'dissolving') {
        // Transparent background during dissolve reveal
        ctx.fillStyle = purpleColor;

        for (let i = 0; i < totalBlocks; i++) {
          const b = blockList[i];
          const alpha = 1 - b.dissolveProgress;
          if (alpha <= 0.01) continue;

          const size = b.size;
          const scale = b.scale;
          const dProg = b.dissolveProgress;

          ctx.save();
          ctx.globalAlpha = Math.max(0, alpha);

          const centerX = b.x + size / 2;
          const centerY = b.y + size / 2;
          ctx.translate(centerX, centerY);
          ctx.scale(scale, scale);
          ctx.translate(-centerX, -centerY);

          if (dProg > 0.45) {
            const half = size / 2;
            ctx.fillRect(b.x, b.y, half, half);
            ctx.fillRect(b.x + half, b.y + half, half, half);
          } else {
            ctx.fillRect(b.x - 0.5, b.y - 0.5, size + 1, size + 1);
          }

          ctx.restore();
        }
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(minTimer);
      clearInterval(statusInterval);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      tl.kill();
    };
  }, []);

  if (loaderPhase === 'complete') {
    return null;
  }

  const isDissolving = loaderPhase === 'dissolving';

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 overflow-hidden select-none transition-colors duration-300 ${
        isDissolving ? 'bg-transparent pointer-events-none' : 'bg-white pointer-events-auto'
      }`}
    >
      {/* High Performance Pixel Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-10" />

      {/* Centered Brand Kreo Logo - PURE WHITE THROUGHOUT */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div
          ref={logoRef}
          className="relative transition-all duration-300 ease-out"
        >
          {/* Always Pure Crisp White Logo */}
          <img
            src="/images/kreologo.svg"
            alt="Kreo Logo"
            className="w-28 sm:w-36 md:w-44 h-auto transition-all duration-300"
            style={{
              filter: 'brightness(0) invert(1)',
              opacity: isDissolving ? 0 : 1,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FullscreenLoader;
