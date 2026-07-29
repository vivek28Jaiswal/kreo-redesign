import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ─────────────────────────────────────────────────────────────────────────
   Aurora Mesh Gradient Overlay — Light & Subtle on Pure White Base
   
   • Pure white base (#FFFFFF)
   • Animated organic aurora mesh with soft pastel overlays (blush, peach, lavender, mint)
   • Crisp, light aesthetic that stays clean white while moving fluidly with mouse
───────────────────────────────────────────────────────────────────────── */

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
precision highp float;

varying vec2 vUv;
uniform float  uTime;
uniform vec2   uResolution;
uniform vec2   uMouse;

#define PI 3.14159265359

float hash21(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 31.41);
  return fract(p.x * p.y);
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i),             hash21(i + vec2(1,0)), u.x),
    mix(hash21(i + vec2(0,1)), hash21(i + vec2(1,1)), u.x),
    u.y
  );
}

float fbm(vec2 p, int oct) {
  float val = 0.0, amp = 0.5, freq = 1.0;
  for (int i = 0; i < 6; i++) {
    if (i >= oct) break;
    val  += amp * noise2(p * freq);
    amp  *= 0.5;
    freq *= 2.0;
  }
  return val;
}

float auroraBlob(
  vec2  uv,
  vec2  center,
  float scale,
  float angle,
  float waveAmp,
  float waveFreq,
  float blur,
  float timeOffset,
  float speed
) {
  float t     = uTime * speed + timeOffset;
  float ang   = radians(angle);
  float cosA  = cos(ang), sinA = sin(ang);

  vec2 d = uv - center;
  vec2 r = vec2(cosA * d.x - sinA * d.y,
                sinA * d.x + cosA * d.y);

  float ellipseAspect = 1.6;
  r.x /= ellipseAspect;

  float theta    = atan(d.y, d.x);
  float waveDist = waveAmp * sin(waveFreq * theta + t * 2.0 + fbm(d * 2.5 + t * 0.25, 3) * 1.8);

  float dist = length(r) - scale + waveDist;
  return 1.0 - smoothstep(-blur, blur, dist);
}

void main() {
  vec2 uv = vUv;

  // Pure White Base Background (#FFFFFF)
  vec3 col = vec3(1.0, 1.0, 1.0);

  // Mouse tracking with soft spring feel
  vec2 mouse = vec2(uMouse.x * 0.5 + 0.5, uMouse.y * 0.5 + 0.5);
  vec2 trackOffset1 = (mouse - 0.5) * 0.14;
  vec2 trackOffset2 = (mouse - 0.5) * 0.09;

  // Soft Pastel Palette (Subtle Overlay, won't turn screen purple/blue)
  vec3 softLavender = vec3(0.91, 0.88, 0.98); // Soft dreamy periwinkle/lavender
  vec3 softBlush    = vec3(0.99, 0.89, 0.88); // Gentle blush pink
  vec3 softPeach    = vec3(1.00, 0.93, 0.84); // Warm light peach
  vec3 softMint     = vec3(0.89, 0.96, 0.93); // Airy sage/mint

  // Aurora 1 — Soft Lavender Drift (Top Left to Center)
  float a1 = auroraBlob(uv, vec2(0.22, 0.45) + trackOffset1, 0.42, 105.0, 0.05, 3.2, 0.22, 0.0, 0.18);
  float a1b = auroraBlob(uv, vec2(0.60, 0.30) + trackOffset1 * 0.6, 0.35, 105.0, 0.04, 2.5, 0.25, 1.5, 0.15);
  float totalA1 = clamp(a1 * 0.75 + a1b * 0.50, 0.0, 1.0);
  col = mix(col, softLavender, totalA1 * 0.32);

  // Aurora 2 — Soft Blush Pink & Peach Drift (Center to Right)
  float a2 = auroraBlob(uv, vec2(0.35, 0.55) + trackOffset2, 0.38, 115.0, 0.055, 3.8, 0.20, 0.8, 0.19);
  float a2b = auroraBlob(uv, vec2(0.78, 0.40) + trackOffset2 * 0.5, 0.32, 115.0, 0.04, 2.8, 0.24, 3.5, 0.14);
  float totalA2 = clamp(a2 * 0.70 + a2b * 0.55, 0.0, 1.0);
  col = mix(col, softBlush, totalA2 * 0.35);

  // Aurora 3 — Warm Peach Glow (Bottom Center)
  float a3 = auroraBlob(uv, vec2(0.50, 0.70) + trackOffset1 * 0.3, 0.30, 90.0, 0.035, 2.2, 0.25, 2.2, 0.12);
  col = mix(col, softPeach, a3 * 0.30);

  // Aurora 4 — Light Airy Mint Accent (Top Right)
  float a4 = auroraBlob(uv, vec2(0.82, 0.25) + trackOffset2 * 0.4, 0.28, 120.0, 0.03, 3.0, 0.22, 4.2, 0.16);
  col = mix(col, softMint, a4 * 0.25);

  // Subtle turbulent grain for tactile feel
  float grainStrength = 0.015;
  float grain = (hash21(uv * uResolution * 0.5 + fract(uTime * 29.0)) - 0.5) * grainStrength;
  col += grain;

  col = clamp(col, 0.0, 1.0);
  gl_FragColor = vec4(col, 1.0);
}
`;

export default function HeroGradient({ className = '' }) {
  const canvasRef  = useRef(null);
  const mouseRef   = useRef({ x: 0, y: 0 });
  const targetRef  = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    const scene  = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime:       { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uMouse:      { value: new THREE.Vector2(0, 0) },
    };

    const geo = new THREE.PlaneGeometry(2, 2);
    const mat = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    scene.add(new THREE.Mesh(geo, mat));

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(
        w * renderer.getPixelRatio(),
        h * renderer.getPixelRatio()
      );
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMouseMove = (e) => {
      targetRef.current.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
      targetRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    let rafId;
    const clock = new THREE.Clock();

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.035;
      mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * 0.035;

      uniforms.uTime.value  = clock.getElapsedTime();
      uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      ro.disconnect();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
