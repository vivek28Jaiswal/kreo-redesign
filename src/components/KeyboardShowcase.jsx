import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';

const KeyboardShowcase = () => {
  const mountRef = useRef(null);
  const modelRef = useRef(null);
  const pivotGroupRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Three.js Scene
    const scene = new THREE.Scene();

    // 2. Camera Setup (Perspective tuned for 3-quarter product shot)
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    camera.position.set(0, 0.2, 7.4);
    camera.lookAt(0, 0, 0);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 4. Premium Studio Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(3, 8, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa5b4fc, 2.0);
    rimLight.position.set(-6, -3, 5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.6);
    fillLight.position.set(0, 0, 10);
    scene.add(fillLight);

    // 5. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;

    // 6. Pivot Group for Centered Composition
    const pivotGroup = new THREE.Group();
    scene.add(pivotGroup);
    pivotGroupRef.current = pivotGroup;

    // Locked position matching vertical diagonal reference shot
    const initialRotX = 0.0;
    const initialRotY = 0.0;
    const initialRotZ = -0.35;       // ~20 deg clockwise screen plane tilt

    // 8. GLTFLoader
    const loader = new GLTFLoader();
    loader.load(
      '/model/keyboard-model.glb',
      (gltf) => {
        const model = gltf.scene;

        // Orient model so keys face front towards camera and stand vertical
        model.rotation.set(0.20, Math.PI / 2, 1.84);

        // Bounding Box Calculation for Dead-Center Alignment
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Center origin at geometry centroid
        model.position.sub(center);

        // Scale to fit canvas perfectly (slightly smaller)
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 3.75 / maxDim;
        pivotGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);

        pivotGroup.add(model);

        pivotGroup.rotation.set(initialRotX, initialRotY, initialRotZ);
        pivotGroup.position.set(
          0.15,   // slightly right in hero area
         -0.02,   // centered vertically
          0
        );

        modelRef.current = pivotGroup;

        // GSAP Floating Animation
        gsap.to(pivotGroup.position, {
          y: '+=0.08',
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      },
      undefined,
      (error) => {
        console.error('Error loading 3D GLB model:', error);
      }
    );

    // 9. Parallax Mouse Movement
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      mouseX = (clientX / window.innerWidth - 0.5) * 0.22;
      mouseY = (clientY / window.innerHeight - 0.5) * 0.22;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 10. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();

      if (pivotGroupRef.current) {
        const targetRotY = initialRotY + mouseX;
        const targetRotX = initialRotX + mouseY;
        pivotGroupRef.current.rotation.y += (targetRotY - pivotGroupRef.current.rotation.y) * 0.06;
        pivotGroupRef.current.rotation.x += (targetRotX - pivotGroupRef.current.rotation.x) * 0.06;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 11. Window Resize Listener
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-10 overflow-hidden">
      <div ref={mountRef} className="w-full h-full max-w-[720px] max-h-[720px] relative cursor-grab active:cursor-grabbing" />
    </div>
  );
};

export default KeyboardShowcase;
