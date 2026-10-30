'use client';
import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { buildObject, disposeGroup } from '@/lib/three-objects';
import type { ObjectKind } from '@/lib/data';
import Placeholder from './Placeholder';

type Props = {
  kind: ObjectKind;
  /** 0..1 scroll progress; when given the object turns with the scroll (product story) */
  progress?: MutableRefObject<number>;
  /** idle spin + mouse parallax (hero) */
  idle?: boolean;
  scale?: number;
  className?: string;
};

export default function Scene3D({ kind, progress, idle = false, scale = 1, className }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return; // no WebGL: the placeholder stays visible
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
    camera.position.set(0, 0.35, 7.2);

    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xd4ff24, 2.4);
    rim.position.set(-4, 1.5, -3);
    scene.add(rim);
    const blue = new THREE.PointLight(0x2a6fe0, 18, 14);
    blue.position.set(-3, -1, 3);
    scene.add(blue);

    const object = buildObject(kind);
    const holder = new THREE.Group();
    holder.add(object);
    holder.scale.setScalar(scale);
    scene.add(holder);

    const size = () => {
      const w = el.clientWidth || 300;
      const h = el.clientHeight || 300;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(el);

    const mouse = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      mouse.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    if (idle) window.addEventListener('pointermove', onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(el);

    let raf = 0;
    let rotY = 0.6;
    let smooth = 0;
    const clock = new THREE.Clock();
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      if (progress) {
        smooth += (progress.current - smooth) * Math.min(1, dt * 6);
        holder.rotation.y = 0.55 + smooth * Math.PI * 2;
        holder.rotation.x = Math.sin(smooth * Math.PI) * 0.45 - 0.08;
        holder.position.y = Math.sin(t * 1.2) * 0.05;
        holder.scale.setScalar(scale * (0.92 + Math.sin(smooth * Math.PI) * 0.16));
      } else {
        rotY += dt * (reduced ? 0 : 0.35);
        holder.rotation.y += (rotY + mouse.x * 0.5 - holder.rotation.y) * Math.min(1, dt * 4);
        holder.rotation.x += (mouse.y * 0.25 - 0.1 - holder.rotation.x) * Math.min(1, dt * 4);
        holder.position.y = reduced ? 0 : Math.sin(t * 1.1) * 0.09;
      }
      renderer.render(scene, camera);
    };
    frame();
    // first frame drawn -> hide the placeholder
    requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      disposeGroup(holder);
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [kind, idle, scale, progress]);

  return (
    <div ref={host} className={className} style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
      {!ready && <Placeholder kind={kind} label={false} />}
    </div>
  );
}
