/**
 * Kreo Redesign - Tactile Sound Design Engine
 * Hyper-realistic Web Audio API synthesis + Custom MP3 Audio File support.
 * Pixabay Reference: "film-special-effects-keyboard-sound-satisfying-304411"
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = false; // UNMUTED BY DEFAULT as requested!
    this.lastHoverTime = 0;
    this.lastDetentTime = 0;
    this.customAudios = {};

    // Auto-resume AudioContext on first user interaction gesture (click/scroll/hover/keypress)
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended' && !this.isMuted) {
          this.ctx.resume();
        }
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('wheel', unlockAudio);
      };
      window.addEventListener('pointerdown', unlockAudio);
      window.addEventListener('keydown', unlockAudio);
      window.addEventListener('wheel', unlockAudio);
    }
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      // Master gain tuned for crisp, audible, realistic mechanical acoustics
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.45, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended' && !muted) {
      this.ctx.resume();
    }
    if (this.masterGain && this.ctx) {
      const targetGain = muted ? 0 : 0.45;
      this.masterGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.08);
    }
  }

  getMuted() {
    return this.isMuted;
  }

  // --- Helper to play custom MP3 if present in public/sounds/, else fallback to Web Audio synthesis ---
  playCustomAudio(soundPath, fallbackFn) {
    if (this.isMuted) return;
    try {
      const audio = new Audio(soundPath);
      audio.volume = 0.5;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          fallbackFn();
        });
      }
    } catch (e) {
      fallbackFn();
    }
  }

  // --- 1. Satisfying Tactile Keyboard Click (Pixabay 304411 Reference Profile) ---
  playKeyHover() {
    if (this.isMuted) return;
    const now = Date.now();
    if (now - this.lastHoverTime < 50) return; // Throttle fast mouse glides
    this.lastHoverTime = now;

    this.playCustomAudio('/sounds/keyboard-click.mp3', () => {
      this.playSwitchPress();
    });
  }

  // --- 2. Key Ripple Wave Keystroke (Gentle Organic Cascade) ---
  playKeyRipple(progressRatio = 0.5) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const pitchOffset = (progressRatio * 80) - 40; // Soft pitch variation

    // Muted soft top tap
    const snapOsc = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snapOsc.type = 'sine';
    snapOsc.frequency.setValueAtTime(950 + pitchOffset, t);
    snapOsc.frequency.exponentialRampToValueAtTime(380, t + 0.015);

    snapGain.gain.setValueAtTime(0.2, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

    // Warm deep thock body
    const thockOsc = this.ctx.createOscillator();
    const thockGain = this.ctx.createGain();
    thockOsc.type = 'sine';
    thockOsc.frequency.setValueAtTime(145 + pitchOffset * 0.1, t);
    thockOsc.frequency.exponentialRampToValueAtTime(45, t + 0.035);

    thockGain.gain.setValueAtTime(0.24, t);
    thockGain.gain.exponentialRampToValueAtTime(0.001, t + 0.038);

    snapOsc.connect(snapGain);
    thockOsc.connect(thockGain);

    snapGain.connect(this.masterGain);
    thockGain.connect(this.masterGain);

    snapOsc.start(t);
    thockOsc.start(t);

    snapOsc.stop(t + 0.02);
    thockOsc.stop(t + 0.04);
  }

  // --- 3. Graywood Switch Soft Lift ---
  playSwitchLift() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    const stemOsc = this.ctx.createOscillator();
    const stemGain = this.ctx.createGain();
    stemOsc.type = 'sine';
    stemOsc.frequency.setValueAtTime(220, t);
    stemOsc.frequency.exponentialRampToValueAtTime(480, t + 0.1);

    stemGain.gain.setValueAtTime(0.02, t);
    stemGain.gain.linearRampToValueAtTime(0.35, t + 0.03);
    stemGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    stemOsc.connect(stemGain);
    stemGain.connect(this.masterGain);

    stemOsc.start(t);
    stemOsc.stop(t + 0.11);
  }

  // --- 4. Switch Tactile Press / Snap (Signature Graywood V4 Click & Thock) ---
  playSwitchPress() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Crisp high snap
    const snapOsc = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snapOsc.type = 'triangle';
    snapOsc.frequency.setValueAtTime(1850, t);
    snapOsc.frequency.exponentialRampToValueAtTime(520, t + 0.014);

    snapGain.gain.setValueAtTime(0.55, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

    // Deep bottom out thock
    const thockOsc = this.ctx.createOscillator();
    const thockGain = this.ctx.createGain();
    thockOsc.type = 'sine';
    thockOsc.frequency.setValueAtTime(160, t);
    thockOsc.frequency.exponentialRampToValueAtTime(48, t + 0.038);

    thockGain.gain.setValueAtTime(0.6, t);
    thockGain.gain.exponentialRampToValueAtTime(0.001, t + 0.042);

    snapOsc.connect(snapGain);
    thockOsc.connect(thockGain);

    snapGain.connect(this.masterGain);
    thockGain.connect(this.masterGain);

    snapOsc.start(t);
    thockOsc.start(t);

    snapOsc.stop(t + 0.02);
    thockOsc.stop(t + 0.045);
  }

  // --- 5. Hyper-Realistic Knurled Aluminum Rotary Encoder Dial ---
  playRotaryDialSequence() {
    if (this.isMuted) return;
    this.init();

    this.playCustomAudio('/sounds/rotary-click.mp3', () => {
      if (!this.ctx) return;
      // Trigger 5 realistic metallic detent clicks as dial rotates
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          if (!this.isMuted && this.ctx) {
            const t = this.ctx.currentTime;

            // Metallic Spring-Ball Snap
            const snapOsc = this.ctx.createOscillator();
            const snapGain = this.ctx.createGain();
            snapOsc.type = 'triangle';
            snapOsc.frequency.setValueAtTime(2200 + (i % 2) * 80, t);
            snapOsc.frequency.exponentialRampToValueAtTime(750, t + 0.008);

            snapGain.gain.setValueAtTime(0.48, t);
            snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.01);

            // Aluminum Knob Body Resonance
            const knobOsc = this.ctx.createOscillator();
            const knobGain = this.ctx.createGain();
            knobOsc.type = 'sine';
            knobOsc.frequency.setValueAtTime(680, t);
            knobOsc.frequency.exponentialRampToValueAtTime(240, t + 0.015);

            knobGain.gain.setValueAtTime(0.35, t);
            knobGain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

            snapOsc.connect(snapGain);
            knobOsc.connect(knobGain);

            snapGain.connect(this.masterGain);
            knobGain.connect(this.masterGain);

            snapOsc.start(t);
            knobOsc.start(t);

            snapOsc.stop(t + 0.012);
            knobOsc.stop(t + 0.02);
          }
        }, i * 110);
      }
    });
  }

  // --- 6. Metallic Glare Shimmer ---
  playMetallicShimmer() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(1650, t);
    osc2.frequency.setValueAtTime(2200, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.14, t + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.75);
    osc2.stop(t + 0.75);
  }

  // --- 7. Single Luxury Crystal Light Beam Sweep ---
  playLatencyLightSweep() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    this.playCustomAudio('/sounds/light-sweep.mp3', () => {
      const t = this.ctx.currentTime;
      const duration = 1.4; // Single continuous 1.4s sweep matching light motion

      // Smooth Crystal Harmonics (Glides gracefully from 880Hz to 1760Hz)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(880, t);
      osc1.frequency.exponentialRampToValueAtTime(1760, t + duration);

      osc2.frequency.setValueAtTime(1320, t);
      osc2.frequency.exponentialRampToValueAtTime(2640, t + duration);

      // Lowpass Filter for silky, non-harsh warm tone
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, t);

      // Gentle fade-in and smooth fade-out over 1.4s
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(t);
      osc2.start(t);

      osc1.stop(t + duration + 0.05);
      osc2.stop(t + duration + 0.05);
    });
  }

  // --- 8. Magnetic Snap (Acoustic Stack Reassembly) ---
  playMagneticSnap() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    const snapOsc = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snapOsc.type = 'triangle';
    snapOsc.frequency.setValueAtTime(2400, t);
    snapOsc.frequency.exponentialRampToValueAtTime(550, t + 0.012);

    snapGain.gain.setValueAtTime(0.5, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);

    const bodyOsc = this.ctx.createOscillator();
    const bodyGain = this.ctx.createGain();
    bodyOsc.type = 'sine';
    bodyOsc.frequency.setValueAtTime(170, t);
    bodyOsc.frequency.exponentialRampToValueAtTime(48, t + 0.035);

    bodyGain.gain.setValueAtTime(0.55, t);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.038);

    snapOsc.connect(snapGain);
    bodyOsc.connect(bodyGain);

    snapGain.connect(this.masterGain);
    bodyGain.connect(this.masterGain);

    snapOsc.start(t);
    bodyOsc.start(t);

    snapOsc.stop(t + 0.02);
    bodyOsc.stop(t + 0.04);
  }
}

export const soundEngine = new SoundEngine();
