import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RefreshCw, Sparkles, Palette } from 'lucide-react';

export default function ThreeDCanvas({ currentRgb = '#06b6d4', isExploded = false }) {
  const mountRef = useRef(null);
  const [rgbColor, setRgbColor] = useState(currentRgb);
  const [autoRotate, setAutoRotate] = useState(true);
  const sceneRef = useRef(null);
  const fansRef = useRef([]);
  const lightsRef = useRef([]);
  const explodedGroupRef = useRef(null);

  // Sync state if props change
  useEffect(() => {
    setRgbColor(currentRgb);
  }, [currentRgb]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(4, 3, 6);

    // 2. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const bluePointLight = new THREE.PointLight(rgbColor, 4, 10);
    bluePointLight.position.set(0, 0.5, 0.5);
    scene.add(bluePointLight);
    lightsRef.current.push(bluePointLight);

    const purplePointLight = new THREE.PointLight('#7c3aed', 3, 10);
    purplePointLight.position.set(-1, -0.5, -0.5);
    scene.add(purplePointLight);

    // 4. PC Build Group
    const pcGroup = new THREE.Group();
    explodedGroupRef.current = pcGroup;
    scene.add(pcGroup);

    // Main Case Chassis (Pearl White / Clear Glass)
    const caseGeo = new THREE.BoxGeometry(2.2, 3.2, 2.6);
    const caseMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      metalness: 0.1,
      roughness: 0.2,
      transmission: 0.6, // Glass transparency
      thickness: 0.5,
      transparent: true,
      opacity: 0.85,
    });
    const pcCase = new THREE.Mesh(caseGeo, caseMat);
    pcGroup.add(pcCase);

    // Aluminum Frame Edges
    const frameGeo = new THREE.BoxGeometry(2.25, 3.25, 2.65);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      metalness: 0.8,
      roughness: 0.3,
      wireframe: true,
    });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    pcGroup.add(frame);

    // Motherboard Plate (Backplate)
    const mbGeo = new THREE.BoxGeometry(2.0, 3.0, 0.1);
    const mbMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.5,
      roughness: 0.4,
    });
    const mb = new THREE.Mesh(mbGeo, mbMat);
    mb.position.set(0, 0, -1.1);
    pcGroup.add(mb);

    // GPU (Graphics Card)
    const gpuGeo = new THREE.BoxGeometry(1.8, 0.5, 1.2);
    const gpuMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.2,
    });
    const gpu = new THREE.Mesh(gpuGeo, gpuMat);
    gpu.position.set(0, -0.4, 0);
    gpu.name = "gpu_mesh";
    pcGroup.add(gpu);

    // GPU RGB Accent Line
    const gpuRgbGeo = new THREE.BoxGeometry(1.82, 0.08, 0.08);
    const gpuRgbMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(rgbColor) });
    const gpuRgb = new THREE.Mesh(gpuRgbGeo, gpuRgbMat);
    gpuRgb.position.set(0, -0.4, 0.61);
    gpu.add(gpuRgb);

    // CPU AIO Cooler Block
    const coolerGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 32);
    const coolerMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.8,
      roughness: 0.2,
      emissive: new THREE.Color(rgbColor),
      emissiveIntensity: 0.6,
    });
    const cooler = new THREE.Mesh(coolerGeo, coolerMat);
    cooler.rotation.x = Math.PI / 2;
    cooler.position.set(-0.2, 0.5, -0.85);
    cooler.name = "cooler_mesh";
    pcGroup.add(cooler);

    // RAM Sticks (DDR5 RGB)
    for (let i = 0; i < 2; i++) {
      const ramGeo = new THREE.BoxGeometry(0.08, 0.8, 0.25);
      const ramMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.7,
      });
      const ram = new THREE.Mesh(ramGeo, ramMat);
      ram.position.set(0.4 + i * 0.15, 0.5, -0.85);

      // Light bar on top of RAM
      const ramLightGeo = new THREE.BoxGeometry(0.09, 0.82, 0.04);
      const ramLightMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(rgbColor) });
      const ramLight = new THREE.Mesh(ramLightGeo, ramLightMat);
      ramLight.position.set(0, 0, 0.12);
      ram.add(ramLight);
      pcGroup.add(ram);
    }

    // ARGB Cooling Fans (Front 2, Top 2, Rear 1)
    const fanPositions = [
      [0.9, 0.7, 0.4],
      [0.9, -0.7, 0.4],
      [-0.4, 1.45, 0],
      [0.4, 1.45, 0],
      [-0.9, 0.5, -0.8]
    ];

    const fanGroupList = [];
    fanPositions.forEach((pos) => {
      const fanRingGeo = new THREE.TorusGeometry(0.35, 0.04, 16, 32);
      const fanRingMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(rgbColor) });
      const fanRing = new THREE.Mesh(fanRingGeo, fanRingMat);
      fanRing.position.set(...pos);

      if (pos[1] > 1.4) {
        fanRing.rotation.x = Math.PI / 2;
      } else if (pos[0] > 0.8) {
        fanRing.rotation.y = Math.PI / 2;
      }

      // Blades
      const bladesGroup = new THREE.Group();
      for (let b = 0; b < 7; b++) {
        const bladeGeo = new THREE.BoxGeometry(0.3, 0.08, 0.02);
        const bladeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.rotation.z = (b * Math.PI * 2) / 7;
        bladesGroup.add(blade);
      }
      fanRing.add(bladesGroup);
      pcGroup.add(fanRing);
      fanGroupList.push(bladesGroup);
    });
    fansRef.current = fanGroupList;

    // 5. Mouse Interactive Camera Drag / Tilt
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      pcGroup.rotation.y += deltaX * 0.008;
      pcGroup.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // 6. Render Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate fan blades
      fansRef.current.forEach((blades) => {
        blades.rotation.z += 0.15;
      });

      // Auto Orbit PC Case
      if (autoRotate && !isDragging) {
        pcGroup.rotation.y += 0.004;
      }

      // Exploded View Mesh offset animation
      if (isExploded) {
        pcGroup.children.forEach((child) => {
          if (child.name === "gpu_mesh") {
            child.position.z = THREE.MathUtils.lerp(child.position.z, 1.2, 0.05);
          } else if (child.name === "cooler_mesh") {
            child.position.z = THREE.MathUtils.lerp(child.position.z, 0.6, 0.05);
          }
        });
      } else {
        pcGroup.children.forEach((child) => {
          if (child.name === "gpu_mesh") {
            child.position.z = THREE.MathUtils.lerp(child.position.z, 0, 0.05);
          } else if (child.name === "cooler_mesh") {
            child.position.z = THREE.MathUtils.lerp(child.position.z, -0.85, 0.05);
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRotate, isExploded]);

  // Update RGB light colors dynamically when rgbColor state changes
  useEffect(() => {
    if (!lightsRef.current.length) return;
    lightsRef.current.forEach(light => {
      light.color.set(rgbColor);
    });
  }, [rgbColor]);

  const presetColors = [
    { name: "Cyan Ice", hex: "#06b6d4" },
    { name: "Sapphire", hex: "#2563eb" },
    { name: "Neon Purple", hex: "#7c3aed" },
    { name: "Emerald", hex: "#10b981" },
    { name: "Amber Glow", hex: "#f59e0b" },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '420px' }}>
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {/* Floating Controls Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        border: '1px solid #e2e8f0',
        borderRadius: '999px',
        boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.1)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '8px' }}>
          <Palette size={14} color="#2563eb" />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Đổi màu ARGB:</span>
        </div>

        {presetColors.map((c) => (
          <button
            key={c.hex}
            onClick={() => setRgbColor(c.hex)}
            title={c.name}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: c.hex,
              border: rgbColor === c.hex ? '2px solid #0f172a' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              transform: rgbColor === c.hex ? 'scale(1.25)' : 'scale(1)'
            }}
          />
        ))}

        <div style={{ width: '1px', height: '16px', backgroundColor: '#e2e8f0', margin: '0 6px' }} />

        <button
          onClick={() => setAutoRotate(!autoRotate)}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: autoRotate ? '#2563eb' : '#64748b',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={14} className={autoRotate ? "animate-spin" : ""} style={{ animationDuration: '4s' }} />
          <span>{autoRotate ? 'Xoay tự động' : 'Đã khóa'}</span>
        </button>
      </div>

      {/* Floating Badge Instruction */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(239, 246, 255, 0.9)',
        border: '1px solid rgba(37, 99, 235, 0.2)',
        padding: '6px 12px',
        borderRadius: '12px',
        fontSize: '0.75rem',
        color: '#2563eb',
        fontWeight: 600
      }}>
        <Sparkles size={14} />
        <span>Kéo chuột để xoay 360°</span>
      </div>
    </div>
  );
}
