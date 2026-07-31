import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { GUI } from 'lil-gui';

/* ─────────────────────────────────────────────────────────────────────────
   Procedural Studio Softbox Environment Map for Studio Highlights
───────────────────────────────────────────────────────────────────────── */
function createStudioEnvironment(renderer) {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x202124);

  const panelGeo = new THREE.PlaneGeometry(12, 12);

  // Main Studio Key Softbox
  const keyMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const keyPanel = new THREE.Mesh(panelGeo, keyMat);
  keyPanel.position.set(6, 9, 6);
  keyPanel.rotation.set(-0.8, -0.5, 0);
  envScene.add(keyPanel);

  // Soft Sky Fill Panel
  const fillMat = new THREE.MeshBasicMaterial({ color: 0xe2e8ff, side: THREE.DoubleSide });
  const fillPanel = new THREE.Mesh(panelGeo, fillMat);
  fillPanel.position.set(-7, 5, 5);
  fillPanel.rotation.set(0.5, 0.8, 0);
  envScene.add(fillPanel);

  // Top Overhead Light Panel
  const topMat = new THREE.MeshBasicMaterial({ color: 0xeaeeff, side: THREE.DoubleSide });
  const topPanel = new THREE.Mesh(panelGeo, topMat);
  topPanel.position.set(0, 12, 0);
  topPanel.rotation.x = Math.PI / 2;
  envScene.add(topPanel);

  // Soft Lavender Rim Light Panel (Harmonizes with hero canvas)
  const rimMat = new THREE.MeshBasicMaterial({ color: 0xc8bcf0, side: THREE.DoubleSide });
  const rimPanel = new THREE.Mesh(panelGeo, rimMat);
  rimPanel.position.set(-6, -4, -6);
  rimPanel.rotation.set(0.6, -0.6, 0);
  envScene.add(rimPanel);

  const envMap = pmremGenerator.fromScene(envScene).texture;
  pmremGenerator.dispose();
  return envMap;
}

const KeyboardShowcase = ({ onModelLoaded, isRevealed }) => {
  const mountRef = useRef(null);
  const modelRef = useRef(null);
  const pivotGroupRef = useRef(null);
  const innerModelRef = useRef(null);
  const hasAnimatedEntryRef = useRef(false);
  const scaleFactorRef = useRef(1);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Three.js Scene
    const scene = new THREE.Scene();

    // 2. Camera Setup (Telephoto 28° FOV for luxury commercial product perspective)
    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 1000);
    camera.position.set(0, 0.2, 9.8);
    camera.lookAt(0, 0, 0);

    // 3. WebGL Renderer with Filmic Exposure
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Studio Environment Map for Specular Metallic Reflections
    const studioEnvMap = createStudioEnvironment(renderer);
    scene.environment = studioEnvMap;

    // 4. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xfff6ee, 1.6);
    fillLight.position.set(-4, 3, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc8bcf0, 2.2);
    rimLight.position.set(-5, -2, -4);
    scene.add(rimLight);

    const overheadLight = new THREE.DirectionalLight(0xffffff, 1.4);
    overheadLight.position.set(0, 8, 0);
    scene.add(overheadLight);

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

    // Dev Configuration Params for lil-gui
    const params = {
      // Pivot Position
      posX: 0.15,
      posY: -0.02,
      posZ: 0.0,

      // Pivot Base Rotation
      rotX: -0.022,
      rotY: -0.182,
      rotZ: -0.412,

      // Inner Model Rotation
      modelRotX: 0.4,
      modelRotY: 1.8,
      modelRotZ: 1.25,

      // Scale factor
      scale: 3.75,

      // Camera
      camX: 0,
      camY: 0.2,
      camZ: 9.8,

      // Behaviors
      enableFloat: true,
      enableParallax: true,
      enableOrbit: false,

      // Helper to log and copy settings
      copyConfig: () => {
        const configText = `// Keyboard Positioning Config
pivotGroup.position.set(${params.posX.toFixed(3)}, ${params.posY.toFixed(3)}, ${params.posZ.toFixed(3)});
pivotGroup.rotation.set(${params.rotX.toFixed(3)}, ${params.rotY.toFixed(3)}, ${params.rotZ.toFixed(3)});
model.rotation.set(${params.modelRotX.toFixed(3)}, ${params.modelRotY.toFixed(3)}, ${params.modelRotZ.toFixed(3)});
const scaleFactor = ${params.scale.toFixed(3)} / maxDim;
camera.position.set(${params.camX.toFixed(3)}, ${params.camY.toFixed(3)}, ${params.camZ.toFixed(3)});`;

        console.log('--- LIL-GUI KEYBOARD CONFIG ---');
        console.log(configText);

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(configText).then(() => {
            alert('Config copied to clipboard & printed in Console!');
          }).catch(() => {
            alert('Config printed in Console!');
          });
        } else {
          alert('Config printed in Console!');
        }
      }
    };

    let floatTween = null;
    let maxDim = 1;

    const startFloatAnimation = () => {
      if (floatTween) floatTween.kill();
      if (!pivotGroupRef.current) return;
      if (params.enableFloat) {
        floatTween = gsap.to(pivotGroupRef.current.position, {
          y: params.posY + 0.08,
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      } else {
        pivotGroupRef.current.position.y = params.posY;
      }
    };

    // 7. lil-gui Setup
    const gui = new GUI({ title: 'Keyboard Dev Controls' });

    const posFolder = gui.addFolder('Position (Pivot)');
    posFolder.add(params, 'posX', -3, 3, 0.01).name('Position X').onChange((val) => {
      if (pivotGroupRef.current) pivotGroupRef.current.position.x = val;
    });
    posFolder.add(params, 'posY', -3, 3, 0.01).name('Position Y').onChange(() => {
      startFloatAnimation();
    });
    posFolder.add(params, 'posZ', -3, 3, 0.01).name('Position Z').onChange((val) => {
      if (pivotGroupRef.current) pivotGroupRef.current.position.z = val;
    });

    const rotFolder = gui.addFolder('Rotation (Pivot Base)');
    rotFolder.add(params, 'rotX', -Math.PI, Math.PI, 0.01).name('Rotation X');
    rotFolder.add(params, 'rotY', -Math.PI, Math.PI, 0.01).name('Rotation Y');
    rotFolder.add(params, 'rotZ', -Math.PI, Math.PI, 0.01).name('Rotation Z');

    const modelRotFolder = gui.addFolder('Inner Model Rotation');
    modelRotFolder.add(params, 'modelRotX', -Math.PI * 2, Math.PI * 2, 0.01).name('Model Rot X').onChange(() => {
      if (innerModelRef.current) innerModelRef.current.rotation.x = params.modelRotX;
    });
    modelRotFolder.add(params, 'modelRotY', -Math.PI * 2, Math.PI * 2, 0.01).name('Model Rot Y').onChange(() => {
      if (innerModelRef.current) innerModelRef.current.rotation.y = params.modelRotY;
    });
    modelRotFolder.add(params, 'modelRotZ', -Math.PI * 2, Math.PI * 2, 0.01).name('Model Rot Z').onChange(() => {
      if (innerModelRef.current) innerModelRef.current.rotation.z = params.modelRotZ;
    });

    const scaleCamFolder = gui.addFolder('Scale & Camera');
    scaleCamFolder.add(params, 'scale', 0.5, 10, 0.05).name('Scale Factor').onChange((val) => {
      if (pivotGroupRef.current && maxDim) {
        const factor = val / maxDim;
        pivotGroupRef.current.scale.set(factor, factor, factor);
      }
    });
    scaleCamFolder.add(params, 'camX', -10, 10, 0.1).name('Camera X').onChange(() => {
      camera.position.x = params.camX;
    });
    scaleCamFolder.add(params, 'camY', -10, 10, 0.1).name('Camera Y').onChange(() => {
      camera.position.y = params.camY;
    });
    scaleCamFolder.add(params, 'camZ', 1, 25, 0.1).name('Camera Z').onChange(() => {
      camera.position.z = params.camZ;
    });

    const behaviorFolder = gui.addFolder('Behaviors');
    behaviorFolder.add(params, 'enableFloat').name('Float Anim').onChange(() => {
      startFloatAnimation();
    });
    behaviorFolder.add(params, 'enableParallax').name('Mouse Parallax');
    behaviorFolder.add(params, 'enableOrbit').name('Orbit Controls').onChange((val) => {
      controls.enableRotate = val;
      controls.enableZoom = val;
      controls.enablePan = val;
    });

    gui.add(params, 'copyConfig').name('📋 Copy Config');

    // Raycaster & Physical KeyGroup tracking
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(-1000, -1000);
    const raycastTargets = [];
    const physicalKeyGroups = [];
    let currentlyHoveredKeyGroup = null;

    // 8. GLTFLoader
    const loader = new GLTFLoader();
    loader.load(
      '/model/keyboard-model.glb',
      (gltf) => {
        const model = gltf.scene;
        innerModelRef.current = model;

        // Soft Satin Anodized Purple Material for Orange Accents
        const purpleAccentMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#9584b7'),
          metalness: 0.75,
          roughness: 0.24,
          sheen: 0.85,
          sheenColor: new THREE.Color('#685ACA'),
          sheenRoughness: 0.20,
          clearcoat: 0.22,
          clearcoatRoughness: 0.15,
          envMapIntensity: 1.4,
        });

        // 1. Separate keycap top shell anchors (Plastic_1, Plastic_2) from legend sub-meshes (Plastic_4, Plastic_5)
        const topShellSubMeshes = [];
        const legendSubMeshes = [];

        // Process model in next tick to prevent main-thread frame drops on loader animation
        setTimeout(() => {
          model.traverse((child) => {
            if (child.isMesh && child.geometry) {
              const matName = child.material ? child.material.name : '';

              // Only clone material when necessary
              if (matName === 'Plastic_2') {
                child.material = purpleAccentMaterial.clone();
              } else if (child.material && child.material.envMapIntensity !== undefined) {
                child.material.envMapIntensity = 1.35;
              }

              // EXCLUDE keyboard frame, body casing, screen, rotary knob, trim
              if (matName !== 'Plastic_3' && matName !== 'Custom_1' && matName !== 'Metal_1' && matName !== 'Metal_2') {
                if (!child.geometry.boundingBox) {
                  child.geometry.computeBoundingBox();
                }
                const bbox = child.geometry.boundingBox;
                const sizeX = bbox.max.x - bbox.min.x;
                const sizeY = bbox.max.y - bbox.min.y;

                if (sizeX < 18 && sizeY < 18) {
                  const center = new THREE.Vector3();
                  bbox.getCenter(center);

                  const item = { mesh: child, center: center, matName: matName };

                  if (matName === 'Plastic_1' || matName === 'Plastic_2') {
                    topShellSubMeshes.push(item);
                  } else {
                    legendSubMeshes.push(item);
                  }
                }
              }
            }
          });

          // 2. Cluster top shell anchors into distinct physical keycaps
          topShellSubMeshes.forEach((item) => {
            let match = physicalKeyGroups.find((kc) => kc.center.distanceToSquared(item.center) < 0.64);
            if (match) {
              match.subMeshes.push(item.mesh);
            } else {
              physicalKeyGroups.push({
                id: physicalKeyGroups.length + 1,
                center: item.center.clone(),
                subMeshes: [item.mesh],
                isHovered: false,
              });
            }
          });

          // 3. Assign legends, side-walls, and stems to their nearest physical keycap anchor
          legendSubMeshes.forEach((item) => {
            let closestKeycap = null;
            let minDistSq = Infinity;

            physicalKeyGroups.forEach((kc) => {
              const distSq = kc.center.distanceToSquared(item.center);
              if (distSq < minDistSq) {
                minDistSq = distSq;
                closestKeycap = kc;
              }
            });

            if (closestKeycap && minDistSq < 6.25) {
              closestKeycap.subMeshes.push(item.mesh);
            }
          });

          // 4. Link sub-meshes to their parent Physical Key and populate raycastTargets
          physicalKeyGroups.forEach((physicalKey) => {
            physicalKey.subMeshes.forEach((mesh) => {
              mesh.userData.parentPhysicalKey = physicalKey;
              mesh.userData.originalPosition = mesh.position.clone();

              if (mesh.material) {
                mesh.userData.originalEnvMapIntensity = mesh.material.envMapIntensity || 1.35;
                mesh.userData.originalClearcoat = mesh.material.clearcoat || 0;
                mesh.userData.originalRoughness = mesh.material.roughness || 0.3;
              }

              raycastTargets.push(mesh);
            });
          });
        }, 0);

        // Orient model so keys face front towards camera and stand vertical
        model.rotation.set(params.modelRotX, params.modelRotY, params.modelRotZ);

        // Bounding Box Calculation for Dead-Center Alignment
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Center origin at geometry centroid
        model.position.sub(center);

        // Scale to fit canvas perfectly
        maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = params.scale / maxDim;
        scaleFactorRef.current = scaleFactor;
        pivotGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);

        pivotGroup.add(model);

        pivotGroup.rotation.set(params.rotX, params.rotY, params.rotZ);
        pivotGroup.position.set(params.posX, params.posY, params.posZ);

        modelRef.current = pivotGroup;

        // Start Floating Animation
        startFloatAnimation();

        if (onModelLoaded) {
          onModelLoaded();
        }
      },
      undefined,
      (error) => {
        console.error('Error loading 3D GLB model:', error);
      }
    );

    // 9. Parallax Mouse Movement & Keycap Raycasting
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      mouseX = (clientX / window.innerWidth - 0.5) * 0.22;
      mouseY = (clientY / window.innerHeight - 0.5) * 0.22;

      if (container) {
        const rect = container.getBoundingClientRect();
        pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      }
    };

    const handleMouseLeave = () => {
      pointer.set(-1000, -1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 10. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();

      if (pivotGroupRef.current) {
        if (params.enableParallax) {
          const targetRotY = params.rotY + mouseX;
          const targetRotX = params.rotX + mouseY;
          pivotGroupRef.current.rotation.y += (targetRotY - pivotGroupRef.current.rotation.y) * 0.06;
          pivotGroupRef.current.rotation.x += (targetRotX - pivotGroupRef.current.rotation.x) * 0.06;
          pivotGroupRef.current.rotation.z = params.rotZ;
        } else {
          pivotGroupRef.current.rotation.set(params.rotX, params.rotY, params.rotZ);
        }

        if (!params.enableFloat) {
          pivotGroupRef.current.position.set(params.posX, params.posY, params.posZ);
        } else {
          pivotGroupRef.current.position.x = params.posX;
          pivotGroupRef.current.position.z = params.posZ;
        }
      }

      // ── Raycasting & Unified Physical Key Elevation (Lockstep Sub-mesh Motion) ──
      if (raycastTargets.length > 0 && camera) {
        // Temporarily reset all key sub-meshes to original rest positions during raycasting to prevent float/displacement flicker
        for (let i = 0; i < raycastTargets.length; i++) {
          const m = raycastTargets[i];
          if (m.userData.currentAnimatedPos) {
            m.position.copy(m.userData.originalPosition);
            m.updateMatrixWorld();
          }
        }

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(raycastTargets, false);

        let targetKey = null;
        if (intersects.length > 0) {
          targetKey = intersects[0].object.userData.parentPhysicalKey || null;
        }

        // Restore active animated positions for rendering
        for (let i = 0; i < raycastTargets.length; i++) {
          const m = raycastTargets[i];
          if (m.userData.currentAnimatedPos) {
            m.position.copy(m.userData.currentAnimatedPos);
          }
        }

        if (targetKey !== currentlyHoveredKeyGroup) {
          // Un-hover previous physical key: Return all sub-meshes of this key together as ONE rigid object
          if (currentlyHoveredKeyGroup) {
            const prevKey = currentlyHoveredKeyGroup;
            prevKey.isHovered = false;

            prevKey.subMeshes.forEach((mesh) => {
              const endPos = mesh.userData.originalPosition;

              gsap.to(mesh.position, {
                x: endPos.x,
                y: endPos.y,
                z: endPos.z,
                duration: 0.15, // 150ms soft ease-out
                ease: 'power1.out',
                overwrite: 'auto',
                onUpdate: () => {
                  mesh.userData.currentAnimatedPos = mesh.position.clone();
                },
                onComplete: () => {
                  delete mesh.userData.currentAnimatedPos;
                }
              });

              if (mesh.material) {
                gsap.to(mesh.material, {
                  envMapIntensity: mesh.userData.originalEnvMapIntensity || 1.35,
                  clearcoat: mesh.userData.originalClearcoat || 0,
                  roughness: mesh.userData.originalRoughness || 0.3,
                  duration: 0.15,
                  ease: 'power1.out',
                  overwrite: 'auto',
                });
              }
            });
          }

          // Hover new physical key: Move ALL sub-meshes of this key together as ONE solid rigid keycap
          if (targetKey) {
            const key = targetKey;
            key.isHovered = true;

            // Calculate subtle forward displacement out of keyboard plate face towards camera
            const worldForward = new THREE.Vector3(0, 0.025, 0.10); // Subtle, clean tactile bump
            const localForward = worldForward.clone().transformDirection(innerModelRef.current.matrixWorld.clone().invert());

            key.subMeshes.forEach((mesh) => {
              const targetPos = mesh.userData.originalPosition.clone().add(localForward);

              gsap.to(mesh.position, {
                x: targetPos.x,
                y: targetPos.y,
                z: targetPos.z,
                duration: 0.15,                     // 150ms soft ease-out
                ease: 'power1.out',
                overwrite: 'auto',
                onUpdate: () => {
                  mesh.userData.currentAnimatedPos = mesh.position.clone();
                }
              });

              if (mesh.material) {
                gsap.to(mesh.material, {
                  envMapIntensity: (mesh.userData.originalEnvMapIntensity || 1.35) * 1.7,
                  clearcoat: 0.40,
                  roughness: Math.max((mesh.userData.originalRoughness || 0.3) - 0.08, 0.14),
                  duration: 0.15,
                  ease: 'power1.out',
                  overwrite: 'auto',
                });
              }
            });

            container.style.cursor = 'pointer';
          } else {
            container.style.cursor = 'grab';
          }

          currentlyHoveredKeyGroup = targetKey;
        }
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
      gui.destroy();
      if (floatTween) floatTween.kill();
      window.removeEventListener('mousemove', handleMouseMove);
      if (container) {
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      studioEnvMap.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Trigger 3D Keyboard Entry Animation upon reveal
  useEffect(() => {
    if (isRevealed && pivotGroupRef.current && !hasAnimatedEntryRef.current) {
      hasAnimatedEntryRef.current = true;

      const pivot = pivotGroupRef.current;
      const targetPosY = -0.02;
      const targetRotY = -0.182;
      const targetScale = scaleFactorRef.current || 1;

      gsap.fromTo(
        pivot.position,
        { y: targetPosY - 0.45 },
        { y: targetPosY, duration: 1.4, delay: 0.35, ease: 'power3.out' }
      );
      gsap.fromTo(
        pivot.rotation,
        { y: targetRotY - 0.28 },
        { y: targetRotY, duration: 1.4, delay: 0.35, ease: 'power3.out' }
      );
      gsap.fromTo(
        pivot.scale,
        { x: targetScale * 0.84, y: targetScale * 0.84, z: targetScale * 0.84 },
        { x: targetScale, y: targetScale, z: targetScale, duration: 1.4, delay: 0.35, ease: 'power3.out' }
      );
    }
  }, [isRevealed]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-10 overflow-hidden">
      <div ref={mountRef} className="w-full h-full max-w-[720px] max-h-[720px] relative cursor-grab active:cursor-grabbing" />
    </div>
  );
};

export default KeyboardShowcase;


