import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Rover3DProps {
  visible: boolean;
  phase: string;
}

/* ============================================================
   HADES rover — procedural Three.js model that rolls out of the
   lander after touchdown. Gold/brass body, flat solar panel,
   six rocker-bogie wheels with grouser treads + bolt-circle
   hubcaps, silver articulated suspension. Rendered on a
   transparent canvas overlaid on the Mars feed.
   ============================================================ */
function buildRover() {
  const rover = new THREE.Group();

  const gold = new THREE.MeshStandardMaterial({ color: 0xcfa23a, roughness: 0.42, metalness: 0.72 });
  const goldLight = new THREE.MeshStandardMaterial({ color: 0xe6c25a, roughness: 0.38, metalness: 0.7 });
  const silver = new THREE.MeshStandardMaterial({ color: 0xcdd2d8, roughness: 0.35, metalness: 0.9 });
  const steel = new THREE.MeshStandardMaterial({ color: 0xc2c6cc, roughness: 0.28, metalness: 0.95 });
  const grouserMat = new THREE.MeshStandardMaterial({ color: 0x8f969f, roughness: 0.45, metalness: 0.85 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x23262b, roughness: 0.6, metalness: 0.5 });

  // ---- Solar panel texture (dark photovoltaic grid) ----
  const cv = document.createElement("canvas");
  cv.width = 256; cv.height = 192;
  const cx = cv.getContext("2d")!;
  cx.fillStyle = "#0a1430"; cx.fillRect(0, 0, 256, 192);
  const cols = 8, rows = 6, gap = 2, cw = 256 / cols, ch = 192 / rows;
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const g = cx.createLinearGradient(i * cw, j * ch, i * cw + cw, j * ch + ch);
    g.addColorStop(0, "#16285f"); g.addColorStop(0.5, "#0c1838"); g.addColorStop(1, "#1c3274");
    cx.fillStyle = g; cx.fillRect(i * cw + gap, j * ch + gap, cw - gap * 2, ch - gap * 2);
  }
  const solarTex = new THREE.CanvasTexture(cv);
  solarTex.colorSpace = THREE.SRGBColorSpace;
  const solarMat = new THREE.MeshStandardMaterial({ map: solarTex, roughness: 0.28, metalness: 0.6, emissive: 0x0a1840, emissiveIntensity: 0.08 });

  // ---- Chassis (gold body box) ----
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.7, 1.8), gold);
  body.position.y = 0.2; body.castShadow = true; rover.add(body);
  // foil side panels
  const f1 = new THREE.Mesh(new THREE.BoxGeometry(2.62, 0.62, 0.04), goldLight); f1.position.set(0, 0.2, 0.91); rover.add(f1);
  const f2 = f1.clone(); f2.position.z = -0.91; rover.add(f2);
  // warm electronics box (one end)
  const web = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 1.4), goldLight); web.position.set(-1.28, 0.18, 0); rover.add(web);
  // mission emblem
  const emblem = new THREE.Mesh(new THREE.CircleGeometry(0.2, 32),
    new THREE.MeshStandardMaterial({ color: 0xb5471f, roughness: 0.5, metalness: 0.3 }));
  emblem.position.set(0.8, 0.22, 0.92); rover.add(emblem);

  // ---- Flat solar panel on top ----
  const frame = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.04, 2.26), silver);
  frame.position.set(0, 0.6, 0); frame.castShadow = true; rover.add(frame);
  const panel = new THREE.Mesh(new THREE.BoxGeometry(2.92, 0.05, 2.18), solarMat);
  panel.position.set(0, 0.625, 0); panel.castShadow = true; rover.add(panel);

  // ---- Wheel factory: drum + grouser fins + bolt-circle hubcap ----
  const wheels: THREE.Object3D[] = [];
  function makeWheel() {
    const g = new THREE.Group();
    const R = 0.36, W = 0.3;
    // solid closed drum so the wheel reads as a filled metal cylinder
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(R, R, W, 40), steel);
    drum.rotation.z = Math.PI / 2; drum.castShadow = true; g.add(drum);
    // dense, low-profile grouser treads around the rim
    const N = 44;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const fin = new THREE.Mesh(new THREE.BoxGeometry(W * 0.96, 0.022, 0.04), grouserMat);
      fin.position.set(0, Math.sin(a) * (R + 0.006), Math.cos(a) * (R + 0.006));
      fin.rotation.x = a; drum.add(fin);
    }
    function cap(sign: number) {
      const grp = new THREE.Group(); grp.position.x = sign * (W / 2 + 0.006); grp.rotation.y = Math.PI / 2;
      grp.add(new THREE.Mesh(new THREE.CircleGeometry(R * 0.92, 32),
        new THREE.MeshStandardMaterial({ color: 0xd6dadf, roughness: 0.22, metalness: 0.96, side: THREE.DoubleSide })));
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.05, 16), steel);
      hub.rotation.x = Math.PI / 2; hub.position.z = 0.02 * sign; grp.add(hub);
      for (let k = 0; k < 3; k++) {
        const a = (k / 3) * Math.PI * 2;
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.03, 6), darkMat);
        bolt.rotation.x = Math.PI / 2; bolt.position.set(Math.cos(a) * 0.14, Math.sin(a) * 0.14, 0.02 * sign); grp.add(bolt);
      }
      return grp;
    }
    drum.add(cap(1)); drum.add(cap(-1));
    (g.userData as any).drum = drum;
    wheels.push(g);
    return g;
  }

  // ---- Rocker-bogie suspension (one per side) ----
  function makeSide(sign: number) {
    const side = new THREE.Group(); side.position.set(0, 0, sign * 1.05);
    const rb = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.08), silver); rb.position.set(0.1, 0, 0); side.add(rb);
    const farm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.08), silver); farm.position.set(1.2, -0.25, 0); side.add(farm);
    const fw = makeWheel(); fw.position.set(1.2, -0.5, 0); side.add(fw);
    const bogie = new THREE.Group(); bogie.position.set(-0.9, -0.15, 0); side.add(bogie);
    const bb = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.07, 0.07), silver); bogie.add(bb);
    const ml = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.06), silver); ml.position.set(-0.5, -0.17, 0); bogie.add(ml);
    const mw = makeWheel(); mw.position.set(-0.5, -0.35, 0); bogie.add(mw);
    const mr = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.06), silver); mr.position.set(0.5, -0.17, 0); bogie.add(mr);
    const rw = makeWheel(); rw.position.set(0.5, -0.35, 0); bogie.add(rw);
    return side;
  }
  rover.add(makeSide(1)); rover.add(makeSide(-1));

  return { rover, wheels };
}

export function Rover3D({ visible, phase }: Rover3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ visible, phase });
  stateRef.current = { visible, phase };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(4.6, 1.7, 6.9);
    camera.lookAt(0, 0.2, 0);

    // Lights — warm Mars key + cool fill
    scene.add(new THREE.HemisphereLight(0xffe6cc, 0x442218, 1.0));
    scene.add(new THREE.AmbientLight(0x6a4a3a, 0.5));
    const sun = new THREE.DirectionalLight(0xffd9b0, 1.6);
    sun.position.set(-4, 6, 5); sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 1; sun.shadow.camera.far = 30;
    sun.shadow.camera.left = -6; sun.shadow.camera.right = 6;
    sun.shadow.camera.top = 6; sun.shadow.camera.bottom = -6;
    sun.shadow.bias = -0.0004;
    scene.add(sun);

    const { rover, wheels } = buildRover();
    scene.add(rover);

    // Soft contact shadow (radial gradient sprite under the rover)
    const scv = document.createElement("canvas"); scv.width = scv.height = 128;
    const sctx = scv.getContext("2d")!;
    const grd = sctx.createRadialGradient(64, 64, 4, 64, 64, 60);
    grd.addColorStop(0, "rgba(0,0,0,0.5)"); grd.addColorStop(1, "rgba(0,0,0,0)");
    sctx.fillStyle = grd; sctx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(scv);
    const contact = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 2.4),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
    contact.rotation.x = -Math.PI / 2; contact.position.y = -0.86;
    rover.add(contact);

    const OFFSCREEN_X = 9;
    rover.position.set(OFFSCREEN_X, 0, 0);
    let wheelAngle = 0;
    let lastX = OFFSCREEN_X;

    const resize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05); last = now; elapsed += dt;
      const { visible: vis, phase: ph } = stateRef.current;

      // Roll in from the right after landing; retract off-screen when hidden.
      const targetX = vis ? 0 : OFFSCREEN_X;
      rover.position.x += (targetX - rover.position.x) * Math.min(1, dt * 2.2);

      // Wheel rotation: roll with travel + steady creep during deploy.
      const dx = rover.position.x - lastX; lastX = rover.position.x;
      wheelAngle += -dx / 0.36;
      if (ph === "DEPLOY" || ph === "ROVER") wheelAngle += dt * 1.6;
      wheels.forEach((w) => { (w.userData as any).drum.rotation.x = wheelAngle; });

      // Gentle settle/bob
      rover.rotation.z = Math.sin(elapsed * 1.2) * 0.012;
      rover.visible = rover.position.x < OFFSCREEN_X - 0.05;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else if (mat) mat.dispose();
      });
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div ref={mountRef} className="absolute inset-0" />
      {visible && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center">
          <span className="text-xs font-display tracking-widest text-secondary opacity-80 bg-black/30 px-2 py-0.5 rounded">
            {phase === "ROVER" ? "ROVER ROLLOUT" : phase === "DEPLOY" ? "MOBILITY DEPLOY" : "SURFACE OPS"}
          </span>
        </div>
      )}
    </div>
  );
}
