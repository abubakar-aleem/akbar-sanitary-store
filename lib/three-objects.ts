import * as THREE from 'three';
import type { ObjectKind } from './data';

// Procedural stand-in 3D objects (no model files needed). When you later add real 3D models or
// photos, only this file / the Scene3D component needs to change.
const COBALT = 0x1558c9;
const LIME = 0xd4ff24;

export function materials() {
  return {
    body: new THREE.MeshStandardMaterial({ color: COBALT, metalness: 0.78, roughness: 0.26 }),
    chrome: new THREE.MeshStandardMaterial({ color: 0xdfe6f2, metalness: 1, roughness: 0.14 }),
    lime: new THREE.MeshStandardMaterial({ color: LIME, metalness: 0.15, roughness: 0.38 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x0a1226, metalness: 0.6, roughness: 0.4 }),
  };
}

const cyl = (r: number, h: number, m: THREE.Material, seg = 48) => new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), m);

export function buildObject(kind: ObjectKind): THREE.Group {
  const M = materials();
  const g = new THREE.Group();

  switch (kind) {
    case 'pipe': {
      const body = cyl(0.46, 2.6, M.body);
      body.rotation.z = Math.PI / 2;
      g.add(body);
      for (const x of [-1.3, 1.3]) {
        const ring = cyl(0.58, 0.3, M.lime);
        ring.rotation.z = Math.PI / 2;
        ring.position.x = x;
        g.add(ring);
      }
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.47, 0.04, 12, 48), M.chrome);
      band.rotation.y = Math.PI / 2;
      g.add(band);
      break;
    }
    case 'elbow': {
      const arc = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.44, 32, 64, Math.PI / 2), M.body);
      arc.position.set(-0.47, -0.47, 0);
      g.add(arc);
      const c1 = cyl(0.56, 0.3, M.lime);
      c1.position.set(0.48, -0.47, 0);
      g.add(c1);
      const c2 = cyl(0.56, 0.3, M.lime);
      c2.rotation.z = Math.PI / 2;
      c2.position.set(-0.47, 0.48, 0);
      g.add(c2);
      break;
    }
    case 'tee': {
      const h = cyl(0.42, 2.4, M.body);
      h.rotation.z = Math.PI / 2;
      g.add(h);
      const v = cyl(0.42, 1.3, M.body);
      v.position.y = -0.65;
      g.add(v);
      for (const x of [-1.2, 1.2]) {
        const r = cyl(0.54, 0.28, M.lime);
        r.rotation.z = Math.PI / 2;
        r.position.x = x;
        g.add(r);
      }
      const r = cyl(0.54, 0.28, M.lime);
      r.position.y = -1.28;
      g.add(r);
      g.position.y = 0.3;
      break;
    }
    case 'valve': {
      const pipe = cyl(0.38, 2.3, M.body);
      pipe.rotation.z = Math.PI / 2;
      g.add(pipe);
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.66, 48, 32), M.body);
      g.add(ball);
      const stem = cyl(0.14, 0.9, M.chrome, 24);
      stem.position.y = 0.85;
      g.add(stem);
      const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.09, 16, 48), M.lime);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.y = 1.3;
      g.add(wheel);
      const spoke = cyl(0.05, 1.1, M.lime, 12);
      spoke.rotation.z = Math.PI / 2;
      spoke.position.y = 1.3;
      g.add(spoke);
      for (const x of [-1.15, 1.15]) {
        const r = cyl(0.5, 0.26, M.lime);
        r.rotation.z = Math.PI / 2;
        r.position.x = x;
        g.add(r);
      }
      g.position.y = -0.4;
      break;
    }
    case 'faucet': {
      const base = cyl(0.42, 1.3, M.chrome);
      base.position.y = -0.55;
      g.add(base);
      const foot = cyl(0.62, 0.18, M.dark);
      foot.position.y = -1.18;
      g.add(foot);
      const neck = cyl(0.24, 1.1, M.chrome);
      neck.position.y = 0.55;
      g.add(neck);
      const spout = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.22, 24, 48, Math.PI), M.chrome);
      spout.position.set(0.62, 1.1, 0);
      g.add(spout);
      const tip = cyl(0.24, 0.5, M.body);
      tip.position.set(1.24, 0.85, 0);
      g.add(tip);
      for (const z of [-0.62, 0.62]) {
        const k = cyl(0.17, 0.4, M.lime, 24);
        k.rotation.x = Math.PI / 2;
        k.position.set(0, -0.15, z);
        g.add(k);
      }
      g.position.set(-0.5, 0, 0);
      break;
    }
    case 'tank': {
      const body = cyl(0.9, 2.0, M.body, 64);
      g.add(body);
      for (const y of [-0.55, 0.15, 0.7]) {
        const rib = new THREE.Mesh(new THREE.TorusGeometry(0.905, 0.045, 12, 64), M.dark);
        rib.rotation.x = Math.PI / 2;
        rib.position.y = y;
        g.add(rib);
      }
      const lid = cyl(0.55, 0.28, M.lime);
      lid.position.y = 1.1;
      g.add(lid);
      const knob = cyl(0.12, 0.2, M.chrome, 24);
      knob.position.y = 1.35;
      g.add(knob);
      break;
    }
    case 'socket': {
      const body = cyl(0.56, 1.7, M.body);
      body.rotation.z = Math.PI / 2;
      g.add(body);
      for (const x of [-0.85, 0.85]) {
        const r = cyl(0.72, 0.34, M.lime);
        r.rotation.z = Math.PI / 2;
        r.position.x = x;
        g.add(r);
      }
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.05, 12, 48), M.chrome);
      band.rotation.y = Math.PI / 2;
      g.add(band);
      break;
    }
    case 'bowl': {
      const pts = [
        [0.0, -0.8], [0.5, -0.78], [0.95, -0.6], [1.25, -0.25], [1.4, 0.2], [1.42, 0.45],
      ].map(([x, y]) => new THREE.Vector2(x, y));
      const bowl = new THREE.Mesh(new THREE.LatheGeometry(pts, 64), new THREE.MeshStandardMaterial({ color: 0xeef2f8, metalness: 0.05, roughness: 0.25, side: THREE.DoubleSide }));
      g.add(bowl);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.07, 16, 64), M.lime);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.45;
      g.add(rim);
      const drain = cyl(0.14, 0.05, M.chrome, 24);
      drain.position.y = -0.76;
      g.add(drain);
      g.position.y = -0.1;
      g.scale.setScalar(0.85);
      break;
    }
    case 'lock': {
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.7, 0.6), M.body);
      body.position.y = -0.2;
      g.add(body);
      const shackle = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.13, 16, 48, Math.PI), M.chrome);
      shackle.position.y = 0.62;
      g.add(shackle);
      const hole = cyl(0.17, 0.08, M.lime, 24);
      hole.rotation.x = Math.PI / 2;
      hole.position.set(0, -0.2, 0.32);
      g.add(hole);
      break;
    }
    default: {
      const box = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.7, 1.7), M.body);
      g.add(box);
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.3, 1.74), M.lime);
      stripe.position.y = 0.3;
      g.add(stripe);
    }
  }
  return g;
}

export function disposeGroup(g: THREE.Object3D) {
  g.traverse((o: any) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m: THREE.Material) => m.dispose());
  });
}
