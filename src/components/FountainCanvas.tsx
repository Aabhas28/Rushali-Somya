"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/** Generates a soft radial sprite once and caches it. */
function makeSprite(color: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, color);
  g.addColorStop(0.4, color.replace("1)", "0.6)"));
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * GPU particle systems layered over the palace poster:
 *  - fountain water spray (parabolic jets + gravity)
 *  - rising mist around the basin
 *  - ambient drifting pollen across the whole frame
 * Camera drifts with the pointer for parallax depth.
 */
export default function FountainCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const w = () => mount.clientWidth;
    const h = () => mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w() / h(), 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w(), h());
    mount.appendChild(renderer.domElement);

    const waterTex = makeSprite("rgba(255,255,255,1)");
    const mistTex = makeSprite("rgba(255,240,240,1)");
    const pollenTex = makeSprite("rgba(247,225,150,1)");

    // ---- fountain spray ----
    const SPRAY = 1400;
    const spos = new Float32Array(SPRAY * 3);
    const svel = new Float32Array(SPRAY * 3);
    // origin roughly where the fountain top is in the poster (slightly below centre)
    const ORIGIN = new THREE.Vector3(0, -1.6, 0);

    const seedDrop = (i: number) => {
      spos[i * 3] = ORIGIN.x + (Math.random() - 0.5) * 0.22;
      spos[i * 3 + 1] = ORIGIN.y + Math.random() * 0.2;
      spos[i * 3 + 2] = ORIGIN.z + (Math.random() - 0.5) * 0.22;
      const ang = Math.random() * Math.PI * 2;
      const spread = 0.005 + Math.random() * 0.014; // narrow, gentle
      svel[i * 3] = Math.cos(ang) * spread;
      svel[i * 3 + 1] = 0.04 + Math.random() * 0.035; // soft rise, not a jet
      svel[i * 3 + 2] = Math.sin(ang) * spread;
    };
    for (let i = 0; i < SPRAY; i++) seedDrop(i);

    const sprayGeo = new THREE.BufferGeometry();
    sprayGeo.setAttribute("position", new THREE.BufferAttribute(spos, 3));
    // soft, low-opacity droplets with normal blending → reads as a fine water
    // veil/mist rather than harsh white streaks
    const sprayMat = new THREE.PointsMaterial({
      size: 0.05,
      map: waterTex,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      blending: THREE.NormalBlending,
      color: new THREE.Color("#fff7f6"),
    });
    const spray = new THREE.Points(sprayGeo, sprayMat);
    scene.add(spray);

    // ---- mist ----
    const MIST = 220;
    const mpos = new Float32Array(MIST * 3);
    const mspeed = new Float32Array(MIST);
    const seedMist = (i: number, fresh = false) => {
      mpos[i * 3] = (Math.random() - 0.5) * 5;
      mpos[i * 3 + 1] = fresh ? -2.4 : -2.4 + Math.random() * 3;
      mpos[i * 3 + 2] = (Math.random() - 0.5) * 2;
      mspeed[i] = 0.004 + Math.random() * 0.01;
    };
    for (let i = 0; i < MIST; i++) seedMist(i);
    const mistGeo = new THREE.BufferGeometry();
    mistGeo.setAttribute("position", new THREE.BufferAttribute(mpos, 3));
    const mistMat = new THREE.PointsMaterial({
      size: 1.4,
      map: mistTex,
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const mist = new THREE.Points(mistGeo, mistMat);
    scene.add(mist);

    // ---- ambient pollen ----
    const POLLEN = 90;
    const ppos = new Float32Array(POLLEN * 3);
    const pphase = new Float32Array(POLLEN);
    for (let i = 0; i < POLLEN; i++) {
      ppos[i * 3] = (Math.random() - 0.5) * 22;
      ppos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      ppos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
      pphase[i] = Math.random() * Math.PI * 2;
    }
    const pollenGeo = new THREE.BufferGeometry();
    pollenGeo.setAttribute("position", new THREE.BufferAttribute(ppos, 3));
    const pollenMat = new THREE.PointsMaterial({
      size: 0.15,
      map: pollenTex,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const pollen = new THREE.Points(pollenGeo, pollenMat);
    scene.add(pollen);

    // ---- interaction / parallax ----
    const target = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 1.4;
      target.y = (e.clientY / window.innerHeight - 0.5) * 0.9;
    };
    window.addEventListener("pointermove", onMove);

    let scrollY = 0;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      camera.aspect = w() / h();
      camera.updateProjectionMatrix();
      renderer.setSize(w(), h());
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    let t = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.016;

      // spray physics — gentle gravity for a slow, realistic fall
      for (let i = 0; i < SPRAY; i++) {
        svel[i * 3 + 1] -= 0.0022;
        spos[i * 3] += svel[i * 3];
        spos[i * 3 + 1] += svel[i * 3 + 1];
        spos[i * 3 + 2] += svel[i * 3 + 2];
        if (spos[i * 3 + 1] < ORIGIN.y - 0.5) seedDrop(i);
      }
      sprayGeo.attributes.position.needsUpdate = true;

      // mist rises & fades upward
      for (let i = 0; i < MIST; i++) {
        mpos[i * 3 + 1] += mspeed[i];
        mpos[i * 3] += Math.sin(t * 0.5 + i) * 0.0015;
        if (mpos[i * 3 + 1] > 1.4) seedMist(i, true);
      }
      mistGeo.attributes.position.needsUpdate = true;

      // pollen drift
      for (let i = 0; i < POLLEN; i++) {
        ppos[i * 3] += Math.sin(t * 0.3 + pphase[i]) * 0.004;
        ppos[i * 3 + 1] += Math.cos(t * 0.25 + pphase[i]) * 0.003 + 0.002;
        if (ppos[i * 3 + 1] > 7) ppos[i * 3 + 1] = -7;
      }
      pollenGeo.attributes.position.needsUpdate = true;

      // parallax camera + slow scroll dolly
      camera.position.x += (target.x - camera.position.x) * 0.04;
      camera.position.y +=
        (-target.y - scrollY * 0.0009 - camera.position.y) * 0.04;
      camera.lookAt(0, -0.5, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      sprayGeo.dispose();
      mistGeo.dispose();
      pollenGeo.dispose();
      sprayMat.dispose();
      mistMat.dispose();
      pollenMat.dispose();
      waterTex.dispose();
      mistTex.dispose();
      pollenTex.dispose();
      if (renderer.domElement.parentNode)
        renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}
