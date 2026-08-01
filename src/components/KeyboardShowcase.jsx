import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GUI } from "lil-gui";

gsap.registerPlugin(ScrollTrigger);

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
    const keyMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
    });
    const keyPanel = new THREE.Mesh(panelGeo, keyMat);
    keyPanel.position.set(6, 9, 6);
    keyPanel.rotation.set(-0.8, -0.5, 0);
    envScene.add(keyPanel);

    // Soft Sky Fill Panel
    const fillMat = new THREE.MeshBasicMaterial({
        color: 0xe2e8ff,
        side: THREE.DoubleSide,
    });
    const fillPanel = new THREE.Mesh(panelGeo, fillMat);
    fillPanel.position.set(-7, 5, 5);
    fillPanel.rotation.set(0.5, 0.8, 0);
    envScene.add(fillPanel);

    // Top Overhead Light Panel
    const topMat = new THREE.MeshBasicMaterial({
        color: 0xeaeeff,
        side: THREE.DoubleSide,
    });
    const topPanel = new THREE.Mesh(panelGeo, topMat);
    topPanel.position.set(0, 12, 0);
    topPanel.rotation.x = Math.PI / 2;
    envScene.add(topPanel);

    // Soft Lavender Rim Light Panel
    const rimMat = new THREE.MeshBasicMaterial({
        color: 0xc8bcf0,
        side: THREE.DoubleSide,
    });
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
    const controlsRef = useRef(null);

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        // 1. Three.js Scene
        const scene = new THREE.Scene();

        // 2. Camera Setup (Telephoto 28° FOV for luxury commercial product perspective)
        const camera = new THREE.PerspectiveCamera(
            28,
            width / height,
            0.1,
            1000,
        );
        camera.position.set(0, 0.2, 10);
        camera.lookAt(0, 0, 0);

        // 3. WebGL Renderer with Filmic Exposure
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
        });
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
        controlsRef.current = controls;

        // 6. Pivot Group for Centered Composition (Driven by GSAP)
        const pivotGroup = new THREE.Group();
        scene.add(pivotGroup);
        pivotGroupRef.current = pivotGroup;

        // 7. Wobble Group for Parallax and Floating (Independent of GSAP)
        const wobbleGroup = new THREE.Group();
        pivotGroup.add(wobbleGroup);
        const wobbleGroupRef = { current: wobbleGroup };

        // Dev Configuration Params for lil-gui
        const params = {
            posX: 0.15,
            posY: -0.02,
            posZ: 0.0,
            rotX: -0.022,
            rotY: -0.182,
            rotZ: -0.412,
            modelRotX: 0.4,
            modelRotY: 1.8,
            modelRotZ: 1.25,
            scale: 3.375,
            camX: 0,
            camY: 0.2,
            camZ: 9.8,
            enableFloat: true,
            enableParallax: true,
            enableOrbit: false,
            copyConfig: () => {
                const configText = `// Keyboard Positioning Config
pivotGroup.position.set(${params.posX.toFixed(3)}, ${params.posY.toFixed(3)}, ${params.posZ.toFixed(3)});
pivotGroup.rotation.set(${params.rotX.toFixed(3)}, ${params.rotY.toFixed(3)}, ${params.rotZ.toFixed(3)});
model.rotation.set(${params.modelRotX.toFixed(3)}, ${params.modelRotY.toFixed(3)}, ${params.modelRotZ.toFixed(3)});
const scaleFactor = ${params.scale.toFixed(3)} / maxDim;
camera.position.set(${params.camX.toFixed(3)}, ${params.camY.toFixed(3)}, ${params.camZ.toFixed(3)});`;

                console.log("--- LIL-GUI KEYBOARD CONFIG ---");
                console.log(configText);

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard
                        .writeText(configText)
                        .then(() => {
                            alert(
                                "Config copied to clipboard & printed in Console!",
                            );
                        })
                        .catch(() => {
                            alert("Config printed in Console!");
                        });
                } else {
                    alert("Config printed in Console!");
                }
            },
        };

        let floatTween = null;
        let maxDim = 1;

        const startFloatAnimation = () => {
            if (floatTween) floatTween.kill();
            if (params.enableFloat) {
                floatTween = gsap.to(wobbleGroup.position, {
                    y: 0.08,
                    duration: 2.8,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                });
            } else {
                wobbleGroup.position.y = 0;
            }
        };

        // lil-gui Setup
        const gui = new GUI({ title: "Keyboard Dev Controls" });
        const posFolder = gui.addFolder("Position (Pivot)");
        posFolder
            .add(params, "posX", -3, 3, 0.01)
            .name("Position X")
            .onChange((val) => {
                if (pivotGroupRef.current)
                    pivotGroupRef.current.position.x = val;
            });
        posFolder
            .add(params, "posY", -3, 3, 0.01)
            .name("Position Y")
            .onChange((val) => {
                if (pivotGroupRef.current)
                    pivotGroupRef.current.position.y = val;
            });
        posFolder
            .add(params, "posZ", -3, 3, 0.01)
            .name("Position Z")
            .onChange((val) => {
                if (pivotGroupRef.current)
                    pivotGroupRef.current.position.z = val;
            });

        const rotFolder = gui.addFolder("Rotation (Pivot Base)");
        rotFolder
            .add(params, "rotX", -Math.PI, Math.PI, 0.01)
            .name("Rotation X");
        rotFolder
            .add(params, "rotY", -Math.PI, Math.PI, 0.01)
            .name("Rotation Y");
        rotFolder
            .add(params, "rotZ", -Math.PI, Math.PI, 0.01)
            .name("Rotation Z");

        const modelRotFolder = gui.addFolder("Inner Model Rotation");
        modelRotFolder
            .add(params, "modelRotX", -Math.PI * 2, Math.PI * 2, 0.01)
            .name("Model Rot X")
            .onChange(() => {
                if (innerModelRef.current)
                    innerModelRef.current.rotation.x = params.modelRotX;
            });
        modelRotFolder
            .add(params, "modelRotY", -Math.PI * 2, Math.PI * 2, 0.01)
            .name("Model Rot Y")
            .onChange(() => {
                if (innerModelRef.current)
                    innerModelRef.current.rotation.y = params.modelRotY;
            });
        modelRotFolder
            .add(params, "modelRotZ", -Math.PI * 2, Math.PI * 2, 0.01)
            .name("Model Rot Z")
            .onChange(() => {
                if (innerModelRef.current)
                    innerModelRef.current.rotation.z = params.modelRotZ;
            });

        const scaleCamFolder = gui.addFolder("Scale & Camera");
        scaleCamFolder
            .add(params, "scale", 0.5, 10, 0.05)
            .name("Scale Factor")
            .onChange((val) => {
                if (maxDim) {
                    const factor = val / maxDim;
                    wobbleGroup.scale.set(factor, factor, factor);
                }
            });
        scaleCamFolder
            .add(params, "camX", -10, 10, 0.1)
            .name("Camera X")
            .onChange(() => {
                camera.position.x = params.camX;
            });
        scaleCamFolder
            .add(params, "camY", -10, 10, 0.1)
            .name("Camera Y")
            .onChange(() => {
                camera.position.y = params.camY;
            });
        scaleCamFolder
            .add(params, "camZ", 1, 25, 0.1)
            .name("Camera Z")
            .onChange(() => {
                camera.position.z = params.camZ;
            });

        const behaviorFolder = gui.addFolder("Behaviors");
        behaviorFolder
            .add(params, "enableFloat")
            .name("Float Anim")
            .onChange(() => {
                startFloatAnimation();
            });
        behaviorFolder.add(params, "enableParallax").name("Mouse Parallax");
        behaviorFolder
            .add(params, "enableOrbit")
            .name("Orbit Controls")
            .onChange((val) => {
                controls.enableRotate = val;
                controls.enableZoom = val;
                controls.enablePan = val;
            });

        gui.add(params, "copyConfig").name("📋 Copy Config");

        // Trackers
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2(-1000, -1000);
        const raycastTargets = [];
        const physicalKeyGroups = [];
        let currentlyHoveredKeyGroup = null;
        let rotaryKnobMesh = null;
        const rotaryKnobMeshes = [];
        const layersMap = {};

        // GLTFLoader
        const loader = new GLTFLoader();
        loader.load(
            "/model/keyboard-model.glb",
            (gltf) => {
                const model = gltf.scene;
                innerModelRef.current = model;

                const purpleAccentMaterial = new THREE.MeshPhysicalMaterial({
                    color: new THREE.Color("#9584b7"),
                    metalness: 0.75,
                    roughness: 0.24,
                    sheen: 0.85,
                    sheenColor: new THREE.Color("#685ACA"),
                    clearcoat: 0.22,
                    envMapIntensity: 1.4,
                });

                const topShellSubMeshes = [];
                const legendSubMeshes = [];

                // Set model rotation & fit to scene BEFORE setTimeout mesh parsing
                model.rotation.set(
                    params.modelRotX,
                    params.modelRotY,
                    params.modelRotZ,
                );

                const box = new THREE.Box3().setFromObject(model);
                const boxCenter = box.getCenter(new THREE.Vector3());
                const boxSize = box.getSize(new THREE.Vector3());
                model.position.sub(boxCenter);

                maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z);
                const scaleFactor = params.scale / maxDim;
                scaleFactorRef.current = scaleFactor;
                wobbleGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);
                wobbleGroup.add(model);
                modelRef.current = wobbleGroup;

                pivotGroup.position.set(params.posX, params.posY, params.posZ);
                pivotGroup.rotation.set(params.rotX, params.rotY, params.rotZ);

                startFloatAnimation();
                if (onModelLoaded) onModelLoaded();

                // ── MESH GROUPING + ALL GSAP SETUP INSIDE setTimeout ──
                // setTimeout(0) defers to next tick so bounding-box geometry
                // computations finish, then physicalKeyGroups is fully populated
                // before any GSAP ScrollTrigger timeline is created.
                setTimeout(() => {
                    model.traverse((child) => {
                        if (child.isMesh && child.geometry) {
                            child.userData.originalPosition =
                                child.position.clone();

                            const matName = child.material
                                ? child.material.name
                                : "";

                            // ── NORMAL MATERIAL SETUP ──
                            if (matName === "Plastic_2") {
                                child.material = purpleAccentMaterial.clone();
                            } else if (
                                child.material &&
                                child.material.envMapIntensity !== undefined
                            ) {
                                child.material.envMapIntensity = 1.35;
                            }

                            // ── COLLECT DIAL MESHES ──
                            // Plastic_3 small caps = dial top caps
                            // Metal_1 = dial metal shafts
                            if (
                                matName === "Plastic_3" ||
                                matName === "Metal_1"
                            ) {
                                if (!child.geometry.boundingBox)
                                    child.geometry.computeBoundingBox();
                                const bbox = child.geometry.boundingBox;
                                const sizeX = bbox.max.x - bbox.min.x;
                                const sizeY = bbox.max.y - bbox.min.y;
                                const sizeZ = bbox.max.z - bbox.min.z;
                                const maxDim = Math.max(sizeX, sizeY, sizeZ);
                                // Dial parts are compact — not the long keyboard shell
                                if (maxDim < 120) {
                                    child.userData.isDialPart = true;
                                }
                            }

                            if (
                                matName !== "Plastic_3" &&
                                matName !== "Custom_1" &&
                                matName !== "Metal_1" &&
                                matName !== "Metal_2"
                            ) {
                                if (!child.geometry.boundingBox) {
                                    child.geometry.computeBoundingBox();
                                }
                                const bbox = child.geometry.boundingBox;
                                const sizeX = bbox.max.x - bbox.min.x;
                                const sizeY = bbox.max.y - bbox.min.y;

                                if (sizeX < 18 && sizeY < 18) {
                                    const center = new THREE.Vector3();
                                    bbox.getCenter(center);
                                    const item = {
                                        mesh: child,
                                        center: center,
                                        matName: matName,
                                    };

                                    if (
                                        matName === "Plastic_1" ||
                                        matName === "Plastic_2"
                                    ) {
                                        topShellSubMeshes.push(item);
                                    } else {
                                        legendSubMeshes.push(item);
                                    }
                                }
                            }
                        }
                    });

                    // Track layers for Section 06 precision exploded view
                    const rootNode = model.getObjectByName("RootNode");
                    if (rootNode) {
                        rootNode.children.forEach((layerChild) => {
                            if (layerChild.name.startsWith("Layer")) {
                                layersMap[layerChild.name] = layerChild;
                                layerChild.userData.initialPosition =
                                    layerChild.position.clone();
                            }
                        });
                    }

                    // Group physical keycaps by proximity
                    topShellSubMeshes.forEach((item) => {
                        let match = physicalKeyGroups.find(
                            (kc) =>
                                kc.center.distanceToSquared(item.center) < 0.64,
                        );
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

                    legendSubMeshes.forEach((item) => {
                        let closestKeycap = null;
                        let minDistSq = Infinity;
                        physicalKeyGroups.forEach((kc) => {
                            const distSq = kc.center.distanceToSquared(
                                item.center,
                            );
                            if (distSq < minDistSq) {
                                minDistSq = distSq;
                                closestKeycap = kc;
                            }
                        });
                        if (closestKeycap && minDistSq < 6.25) {
                            closestKeycap.subMeshes.push(item.mesh);
                        }
                    });

                    physicalKeyGroups.forEach((physicalKey) => {
                        physicalKey.subMeshes.forEach((mesh) => {
                            mesh.userData.parentPhysicalKey = physicalKey;
                            mesh.userData.originalPosition =
                                mesh.position.clone();

                            if (mesh.material) {
                                mesh.userData.originalEnvMapIntensity =
                                    mesh.material.envMapIntensity || 1.35;
                                mesh.userData.originalClearcoat =
                                    mesh.material.clearcoat || 0;
                                mesh.userData.originalRoughness =
                                    mesh.material.roughness || 0.3;
                            }

                            raycastTargets.push(mesh);
                        });
                    });

                    // ── CENTER DIAL GEOMETRIES FOR IN-PLACE ROTATION ──
                    // Collect all dial parts, sort by world X (leftmost = dial 1)
                    const allDialMeshes = [];
                    model.traverse((c) => {
                        if (c.isMesh && c.userData.isDialPart)
                            allDialMeshes.push(c);
                    });

                    // Group into two knobs by X-proximity clustering
                    // Sort all parts left-to-right by local center X
                    allDialMeshes.sort((a, b) => {
                        const ca = new THREE.Vector3(),
                            cb = new THREE.Vector3();
                        a.geometry.boundingBox.getCenter(ca);
                        b.geometry.boundingBox.getCenter(cb);
                        return a.position.x + ca.x - (b.position.x + cb.x);
                    });

                    // For each dial part, center geometry at its own local origin so rotation is in-place
                    allDialMeshes.forEach((m) => {
                        if (!m.geometry.boundingBox)
                            m.geometry.computeBoundingBox();
                        const center = new THREE.Vector3();
                        m.geometry.boundingBox.getCenter(center);
                        m.geometry.translate(-center.x, -center.y, -center.z);
                        m.position.add(center);
                        m.userData.originalPosition = m.position.clone();
                        rotaryKnobMesh = m; // last one stored; array below is primary
                    });

                    // Store as rotaryKnobMeshes for the GSAP Section 04 animation
                    rotaryKnobMeshes.length = 0;
                    allDialMeshes.forEach((m) => rotaryKnobMeshes.push(m));
                    console.log(
                        "[DIALS FOUND]",
                        rotaryKnobMeshes.length,
                        "meshes",
                    );

                    const journeyContainer = document.getElementById(
                        "product-journey-container",
                    );
                    if (!journeyContainer) return;

                    const storyTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: journeyContainer,
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 1.2,
                        },
                    });

                    // Custom Motion Language Easings
                    const EASE_CAM_CINEMATIC = "cubic-bezier(0.45, 0, 0.15, 1)";
                    const EASE_KEY_DEPRESS = "cubic-bezier(0.32, 0.72, 0, 1)";
                    const EASE_KEY_RELEASE = "cubic-bezier(0.16, 1, 0.3, 1)";

                    // ── SECTION 01: MECHANICAL TYPING RIPPLE ──
                    // Camera tilts to see keyboard at a comfortable view angle
                    storyTl.to(
                        camera.position,
                        {
                            x: -0.3,
                            y: 0.35,
                            z: 8.2,
                            duration: 1,
                            ease: EASE_CAM_CINEMATIC,
                        },
                        1.0,
                    );
                    storyTl.to(
                        pivotGroup.rotation,
                        {
                            x: 0.38,
                            y: -0.24,
                            z: -0.06,
                            duration: 1,
                            ease: EASE_CAM_CINEMATIC,
                        },
                        1.0,
                    );

                    // Typing wave: sort keycap groups by their world X position (left → right)
                    const sortedGroups = [...physicalKeyGroups].sort(
                        (a, b) => a.center.x - b.center.x,
                    );
                    const keyCount = sortedGroups.length;

                    sortedGroups.forEach((group, idx) => {
                        // Wave travels left→right over 1.4 units of timeline
                        const waveDelay =
                            1.3 + (idx / Math.max(keyCount - 1, 1)) * 1.4;
                        group.subMeshes.forEach((mesh) => {
                            // Depress 1.0 units in local space, bounce back — simulates key travel
                            storyTl
                                .to(
                                    mesh.position,
                                    {
                                        z:
                                            mesh.userData.originalPosition.z -
                                            1.25,
                                        duration: 0.12,
                                        ease: "power1.inout",
                                    },
                                    waveDelay,
                                )
                                .to(
                                    mesh.position,
                                    {
                                        z: mesh.userData.originalPosition.z,
                                        duration: 0.18,
                                        ease: "power2.out",
                                    },
                                    waveDelay + 0.12,
                                );
                        });
                    });

                    // ── SECTION 02: GRAYWOOD SWITCH LIFT & DISASSEMBLY ──
                    // Camera zooms in smoothly to focus on center keycap disassembly
                    storyTl.to(
                        camera.position,
                        {
                            x: 0,
                            y: 0.3,
                            z: 6.4,
                            duration: 1.2,
                            ease: "power2.inOut",
                        },
                        3.0,
                    );
                    storyTl.to(
                        pivotGroup.rotation,
                        {
                            x: 0.55,
                            y: -0.15,
                            z: 0.04,
                            duration: 1.2,
                            ease: "power2.inOut",
                        },
                        3.0,
                    );

                    // Pick the prominent keycap in the exact center of the board
                    const centerGroup =
                        sortedGroups.length > 0
                            ? sortedGroups[Math.floor(sortedGroups.length / 2)]
                            : null;

                    if (centerGroup) {
                        centerGroup.subMeshes.forEach((mesh) => {
                            const orig = mesh.userData.originalPosition;
                            // 1. Lift keycap straight UP out of switch socket (+Z direction)
                            storyTl.to(
                                mesh.position,
                                {
                                    z: -(orig.z + 2),
                                    duration: 1.0,
                                    ease: "power2.out",
                                },
                                3.4,
                            );
                            // 2. Tactile actuation — stem depresses inward
                            storyTl.to(
                                mesh.position,
                                {
                                    z: orig.z,
                                    duration: 0.28,
                                    ease: "power3.in",
                                },
                                4.4,
                            );
                            // 3. Spring releases back up
                            storyTl.to(
                                mesh.position,
                                {
                                    z: orig.z + 0.2,
                                    duration: 0.22,
                                    ease: "back.out(2.5)",
                                },
                                4.68,
                            );
                            // 4. Keycap snaps back into socket
                            storyTl.to(
                                mesh.position,
                                {
                                    z: orig.z,
                                    duration: 0.7,
                                    ease: "power2.inOut",
                                },
                                4.9,
                            );
                        });
                    }

                    // ── SECTION 03: LUXURY MATERIALS — camera glides across aluminum body with striking metallic glare ──
                    // 1. Camera glides smoothly from left to right side of the chassis
                    storyTl.to(
                        camera.position,
                        {
                            x: -0.9,
                            y: 0.45,
                            z: 7.8,
                            duration: 1.0,
                            ease: "power2.inOut",
                        },
                        5.8,
                    );
                    storyTl.to(
                        camera.position,
                        {
                            x: 0.9,
                            y: 0.35,
                            z: 7.4,
                            duration: 1.2,
                            ease: "power2.inOut",
                        },
                        6.8,
                    );

                    // 2. Keyboard tilts horizontally to showcase 6063 CNC aluminum bevels
                    storyTl.to(
                        pivotGroup.rotation,
                        {
                            x: 0.72,
                            y: 0.45,
                            z: -0.22,
                            duration: 1.0,
                            ease: "power2.inOut",
                        },
                        5.8,
                    );
                    storyTl.to(
                        pivotGroup.rotation,
                        {
                            x: 0.65,
                            y: -0.42,
                            z: 0.18,
                            duration: 1.2,
                            ease: "power2.inOut",
                        },
                        6.8,
                    );

                    // 3. High-intensity specular light sweep creating noticeable glare across metallic finish
                    storyTl.to(
                        keyLight,
                        {
                            intensity: 7.5,
                            duration: 0.6,
                            ease: "power1.in",
                        },
                        5.8,
                    );
                    storyTl.to(
                        keyLight.position,
                        {
                            x: -12,
                            y: 6,
                            z: 8,
                            duration: 1.0,
                            ease: "power1.inOut",
                        },
                        5.8,
                    );
                    storyTl.to(
                        keyLight.position,
                        {
                            x: 12,
                            y: 8,
                            z: 4,
                            duration: 1.2,
                            ease: "power2.inOut",
                        },
                        6.8,
                    );
                    storyTl.to(
                        keyLight,
                        {
                            intensity: 3.2,
                            duration: 0.6,
                            ease: "power1.out",
                        },
                        7.6,
                    );
                    storyTl.to(
                        keyLight.position,
                        {
                            x: 4,
                            y: 7,
                            z: 5,
                            duration: 0.4,
                            ease: "power1.inOut",
                        },
                        7.8,
                    );

                    // ── SECTION 04: ROTARY DIAL — Camera glides to macro focus on dials ──
                    // Keyboard tilts to face top-left corner, camera moves close in
                    storyTl.to(
                        camera.position,
                        {
                            x: 6.5,
                            y: 2.4,
                            z: 0.6,
                            duration: 1.4,
                            ease: "power2.inOut",
                        },
                        8.3,
                    );
                    storyTl.to(
                        pivotGroup.rotation,
                        {
                            x: -0.65,
                            y: 0.55,
                            z: -1.08,
                            duration: 1.4,
                            ease: "power2.inOut",
                        },
                        8.3,
                    );

                    // ── SECTION 05: VISUALIZED LATENCY — cyan pulse races through keyboard ──
                    storyTl.to(
                        camera.position,
                        {
                            x: 0,
                            y: 0.5,
                            z: 8.4,
                            duration: 1.0,
                            ease: "power2.inOut",
                        },
                        10.2,
                    );
                    storyTl.to(
                        pivotGroup.rotation,
                        {
                            x: 0.2,
                            y: -0.4,
                            z: 0,
                            duration: 1.0,
                            ease: "power2.inOut",
                        },
                        10.2,
                    );

                    // Spawn a cyan point light that races under the keycaps
                    const pulseLight = new THREE.PointLight(0x00e5ff, 0, 20);
                    pulseLight.position.set(-22, 3.5, 2);
                    pivotGroup.add(pulseLight);

                    // Fade in
                    storyTl.to(
                        pulseLight,
                        { intensity: 28, duration: 0.4, ease: "power2.out" },
                        10.6,
                    );
                    // Slow sweep left → right (cinematic, clearly visible)
                    storyTl.to(
                        pulseLight.position,
                        { x: 22, duration: 2.2, ease: "power1.inOut" },
                        10.6,
                    );
                    // Fade out at end of sweep
                    storyTl.to(
                        pulseLight,
                        { intensity: 0, duration: 0.4, ease: "power2.in" },
                        12.4,
                    );

                    // ── SECTION 06: EXPLODED LAYER VIEW — acoustic stack separates ──
                    storyTl.to(
                        camera.position,
                        {
                            x: 0,
                            y: 1,
                            z: 8.5,
                            duration: 1.2,
                            ease: "power2.inOut",
                        },
                        12.2,
                    );
                    storyTl.to(
                        pivotGroup.rotation,
                        {
                            x: -0.9,
                            y: -0.2,
                            z: -0.9,
                            duration: 1.2,
                            ease: "power2.inOut",
                        },
                        12.2,
                    );

                    // ── EXPLODED VIEW: Separate by material layer (physical stack) ──
                    // Keycaps (Plastic_1/2)    → float UP     +Y
                    // Switch stems (Plastic_5) → float MID    +Y small
                    // Keyboard shell (Metal_1) → stays at 0
                    // Bottom plate (Plastic_4) → sink DOWN    -Y
                    const layerYOffsets = {
                        Plastic_1: 8,
                        Plastic_2: 8,
                        Plastic_3: 5, // dial caps / small bits
                        Plastic_5: 3, // switch stems
                        Metal_1: 0, // body shell stays
                        Metal_2: 0,
                        Plastic_4: -4, // bottom plate
                        Custom_1: 2,
                    };

                    model.traverse((child) => {
                        if (!child.isMesh || !child.userData.originalPosition)
                            return;
                        const matName = child.material
                            ? child.material.name
                            : "";
                        if (!(matName in layerYOffsets)) return;
                        const yOff = layerYOffsets[matName];
                        if (yOff === 0) return;

                        storyTl.to(
                            child.position,
                            {
                                z: -(child.userData.originalPosition.z + yOff),
                                duration: 1.4,
                                ease: "power2.out",
                            },
                            12.6,
                        );
                        // Magnetic snap back
                        storyTl.to(
                            child.position,
                            {
                                z: child.userData.originalPosition.z,
                                duration: 1.1,
                                ease: "back.out(1.4)",
                            },
                            14.2,
                        );
                    });

                    // ── SECTION 07: FINAL HERO — back to pristine studio shot ──
                    storyTl.to(
                        camera.position,
                        {
                            x: 0,
                            y: 0.2,
                            z: 10.0,
                            duration: 1.8,
                            ease: "power2.inOut",
                        },
                        15.5,
                    );
                    storyTl.to(
                        pivotGroup.rotation,
                        {
                            x: -0.2,
                            y: 0.1,
                            z: -(Math.PI / 1.9),
                            duration: 1.8,
                            ease: "power2.inOut",
                        },
                        15.5,
                    );
                    storyTl.to(
                        pivotGroup.position,
                        {
                            x: -0.1,
                            y: -0.02,
                            z: 0,
                            duration: 1.8,
                            ease: "power2.inOut",
                        },
                        15.5,
                    );

                    // Refresh ScrollTrigger so all new DOM / scroll context is recalculated
                    ScrollTrigger.refresh();
                }, 0); // end setTimeout
            }, // end loader.load onLoad callback
            undefined,
            (error) => console.error("Error loading GLB:", error),
        );

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

        window.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);

        // Animation Loop
        let animationFrameId;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            controls.update();

            const isAtBottom =
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 150;

            if (controlsRef.current) {
                if (isAtBottom || params.enableOrbit) {
                    controlsRef.current.enableRotate = true;
                    if (container)
                        container.style.cursor =
                            controlsRef.current.state === -1
                                ? "grab"
                                : "grabbing";
                } else {
                    controlsRef.current.enableRotate = false;
                }
            }

            // Parallax and float independent of GSAP ScrollTrigger
            if (wobbleGroup) {
                if (window.scrollY < 100 || isAtBottom) {
                    if (params.enableParallax) {
                        wobbleGroup.rotation.y +=
                            (mouseX - wobbleGroup.rotation.y) * 0.06;
                        wobbleGroup.rotation.x +=
                            (mouseY - wobbleGroup.rotation.x) * 0.06;
                    } else {
                        wobbleGroup.rotation.y +=
                            (0 - wobbleGroup.rotation.y) * 0.06;
                        wobbleGroup.rotation.x +=
                            (0 - wobbleGroup.rotation.x) * 0.06;
                    }
                }
            }

            // Raycasting & Physical Key Group Hover (Active at Hero view)
            if (raycastTargets.length > 0 && camera && window.scrollY < 100) {
                for (let i = 0; i < raycastTargets.length; i++) {
                    const m = raycastTargets[i];
                    if (m.userData.currentAnimatedPos) {
                        m.position.copy(m.userData.originalPosition);
                        m.updateMatrixWorld();
                    }
                }

                raycaster.setFromCamera(pointer, camera);
                const intersects = raycaster.intersectObjects(
                    raycastTargets,
                    false,
                );

                let targetKey = null;
                if (intersects.length > 0) {
                    targetKey =
                        intersects[0].object.userData.parentPhysicalKey || null;
                }

                for (let i = 0; i < raycastTargets.length; i++) {
                    const m = raycastTargets[i];
                    if (m.userData.currentAnimatedPos) {
                        m.position.copy(m.userData.currentAnimatedPos);
                    }
                }

                if (targetKey !== currentlyHoveredKeyGroup) {
                    if (currentlyHoveredKeyGroup) {
                        const prevKey = currentlyHoveredKeyGroup;
                        prevKey.isHovered = false;

                        prevKey.subMeshes.forEach((mesh) => {
                            const endPos = mesh.userData.originalPosition;
                            gsap.to(mesh.position, {
                                x: endPos.x,
                                y: endPos.y,
                                z: endPos.z,
                                duration: 0.15,
                                ease: "power1.out",
                                overwrite: "auto",
                                onUpdate: () => {
                                    mesh.userData.currentAnimatedPos =
                                        mesh.position.clone();
                                },
                                onComplete: () => {
                                    delete mesh.userData.currentAnimatedPos;
                                },
                            });
                        });
                    }

                    if (targetKey) {
                        const key = targetKey;
                        key.isHovered = true;
                        const worldForward = new THREE.Vector3(0, 0.025, 0.1);
                        const localForward = worldForward
                            .clone()
                            .transformDirection(
                                innerModelRef.current.matrixWorld
                                    .clone()
                                    .invert(),
                            );

                        key.subMeshes.forEach((mesh) => {
                            const targetPos = mesh.userData.originalPosition
                                .clone()
                                .add(localForward);
                            gsap.to(mesh.position, {
                                x: targetPos.x,
                                y: targetPos.y,
                                z: targetPos.z,
                                duration: 0.15,
                                ease: "power1.out",
                                overwrite: "auto",
                                onUpdate: () => {
                                    mesh.userData.currentAnimatedPos =
                                        mesh.position.clone();
                                },
                            });
                        });
                        container.style.cursor = "pointer";
                    } else {
                        container.style.cursor = "grab";
                    }

                    currentlyHoveredKeyGroup = targetKey;
                }
            }

            renderer.render(scene, camera);
        };
        animate();

        // Resize Listener
        const handleResize = () => {
            if (!container) return;
            const newW = container.clientWidth;
            const newH = container.clientHeight;
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            gui.destroy();
            if (floatTween) floatTween.kill();
            window.removeEventListener("mousemove", handleMouseMove);
            if (container) {
                container.removeEventListener("mouseleave", handleMouseLeave);
            }
            window.removeEventListener("resize", handleResize);
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
        if (
            isRevealed &&
            pivotGroupRef.current &&
            !hasAnimatedEntryRef.current
        ) {
            hasAnimatedEntryRef.current = true;

            const pivot = pivotGroupRef.current;
            const targetPosY = -0.02;
            const targetRotY = -0.182;
            const targetScale = scaleFactorRef.current || 1;

            gsap.fromTo(
                pivot.position,
                { y: targetPosY - 0.45 },
                {
                    y: targetPosY,
                    duration: 1.4,
                    delay: 0.35,
                    ease: "power3.out",
                },
            );
            gsap.fromTo(
                pivot.rotation,
                { y: targetRotY - 0.28 },
                {
                    y: targetRotY,
                    duration: 1.4,
                    delay: 0.35,
                    ease: "power3.out",
                },
            );
            gsap.fromTo(
                pivot.scale,
                { x: 0.84, y: 0.84, z: 0.84 },
                {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 1.4,
                    delay: 0.35,
                    ease: "power3.out",
                },
            );
        }
    }, [isRevealed]);

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-auto z-10 overflow-hidden">
            <div
                ref={mountRef}
                className="w-full h-full relative cursor-grab active:cursor-grabbing"
            />
        </div>
    );
};

export default KeyboardShowcase;
