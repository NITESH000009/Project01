/* =============================================================
   main.js — 3D PCB Portfolio  |  Three.js r128 + GSAP
   PERFORMANCE + SKILL SNAP — butter-smooth with pause at each skill
   ============================================================= */

/* Failsafe preloader dismiss */
setTimeout(function () {
  var p = document.getElementById('preloader');
  if (p && !p.classList.contains('done')) p.classList.add('done');
}, 4000);

(function () {
  'use strict';

  /* ========== CONFIG ========== */
  var BOARD = { w: 20, d: 14, h: 0.32 };

  var COMPS = [
    { id: 'ov-0', x: -5, z: -3, type: 'ic', glow: 0xFFD600 },
    { id: 'ov-1', x: -1, z: -3, type: 'cap', glow: 0x00E5FF },
    { id: 'ov-2', x: 3, z: -3, type: 'crystal', glow: 0x76FF03 },
    { id: 'ov-3', x: 6, z: 0, type: 'resistor', glow: 0xFF2D78 },
    { id: 'ov-4', x: 2, z: 1.5, type: 'led', glow: 0xFF9500 },
    { id: 'ov-5', x: -4, z: 3.5, type: 'connector', glow: 0xFF3B30 },
    { id: 'ov-6', x: 2, z: 3.5, type: 'soc', glow: 0xB388FF },
  ];

  var TRACES = [
    [{ x: -9.5, z: -3 }, { x: -5, z: -3 }],
    [{ x: -5, z: -3 }, { x: -1, z: -3 }],
    [{ x: -1, z: -3 }, { x: 3, z: -3 }],
    [{ x: 3, z: -3 }, { x: 6, z: -3 }, { x: 6, z: 0 }],
    [{ x: 6, z: 0 }, { x: 6, z: 1.5 }, { x: 2, z: 1.5 }],
    [{ x: 2, z: 1.5 }, { x: -2, z: 1.5 }, { x: -2, z: 3.5 }, { x: -4, z: 3.5 }],
    [{ x: -4, z: 3.5 }, { x: 2, z: 3.5 }],
    [{ x: 2, z: 3.5 }, { x: 9.5, z: 3.5 }],
  ];

  /* Camera stops — overview, then 7 skill views, then zoom-out */
  var STOPS = [
    { pos: [16, 13, 16], tgt: [0, 0, 0] },       // 0: overview
    { pos: [-3, 5.5, -1], tgt: [-5, 0.5, -3] },    // 1: AI/ML
    { pos: [1, 5.5, -1], tgt: [-1, 0.5, -3] },    // 2: UI/UX
    { pos: [5, 5.5, -1], tgt: [3, 0.5, -3] },     // 3: Data Sci
    { pos: [8, 5.5, 2], tgt: [6, 0.5, 0] },      // 4: Video
    { pos: [4, 5.5, 3.5], tgt: [2, 0.5, 1.5] },    // 5: Graphic
    { pos: [-2, 5.5, 5.5], tgt: [-4, 0.5, 3.5] },   // 6: Vibe Code
    { pos: [4, 5.5, 5.5], tgt: [2, 0.5, 3.5] },    // 7: AI Spec
    { pos: [0, 22, 0.5], tgt: [0, 0, 0] },         // 8: zoom-out
  ];

  /* ========== STATE ========== */
  var poweredOn = false;

  /* Lock scroll until power switch clicked */
  document.body.style.overflow = 'hidden';

  /* ========== MOBILE DETECTION ========== */
  var isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || innerWidth < 768;


  /* ========== THREE.JS — OPTIMIZED ========== */
  var canvas = document.getElementById('pcb-canvas');
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050505);
  scene.fog = new THREE.FogExp2(0x050505, 0.01);

  var camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.5, 200);
  camera.position.set(16, 13, 16);
  camera.lookAt(0, 0, 0);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: !isMobile, powerPreference: 'high-performance' });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.0 : 1.5));
  renderer.shadowMap.enabled = false;

  /* ---- Lights ---- */
  scene.add(new THREE.AmbientLight(0x303030, 0.8));
  var mainLight = new THREE.DirectionalLight(0xffffff, 0.9);
  mainLight.position.set(10, 18, 10);
  scene.add(mainLight);
  var rimLight = new THREE.DirectionalLight(0xFFD600, 0.15);
  rimLight.position.set(-8, 8, -5);
  scene.add(rimLight);

  /* ---- Materials ---- */
  var M = {
    board: new THREE.MeshStandardMaterial({ color: 0x0a5c1a, roughness: 0.65, metalness: 0.1 }),
    copper: new THREE.MeshStandardMaterial({ color: 0xb87333, roughness: 0.25, metalness: 0.9 }),
    darkCu: new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.42, metalness: 0.7, emissive: new THREE.Color(0xFFD600), emissiveIntensity: 0 }),
    icBody: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3, metalness: 0.12 }),
    pin: new THREE.MeshStandardMaterial({ color: 0xc0c0c0, roughness: 0.15, metalness: 0.95 }),
    capBlue: new THREE.MeshStandardMaterial({ color: 0x1155cc, roughness: 0.4, metalness: 0.32 }),
    capTop: new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.35, metalness: 0.6 }),
    crystal: new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.15, metalness: 0.9 }),
    resBdy: new THREE.MeshStandardMaterial({ color: 0x231f20, roughness: 0.48, metalness: 0.1 }),
    ledBase: new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.42, metalness: 0.3 }),
    conn: new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.42, metalness: 0.12 }),
    connSh: new THREE.MeshStandardMaterial({ color: 0xbbbbbb, roughness: 0.25, metalness: 0.85 }),
    soc: new THREE.MeshStandardMaterial({ color: 0x111118, roughness: 0.25, metalness: 0.18 }),
    smd: new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 0.62, metalness: 0.1 }),
    via: new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.25, metalness: 0.88 }),
    goldPin: new THREE.MeshStandardMaterial({ color: 0xd4a843, roughness: 0.15, metalness: 0.95 }),
  };

  /* ========== BOARD ========== */
  function pos(m, x, y, z) { m.position.set(x, y, z); return m; }
  function addGlow(g, hex, y) {
    var l = new THREE.PointLight(hex, 0, 6);
    l.position.y = y; g.add(l);
    g.userData.light = l;
  }

  function makeBoard() {
    var g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.BoxGeometry(BOARD.w, BOARD.h, BOARD.d), M.board));
    var hGeo = new THREE.CylinderGeometry(0.2, 0.2, BOARD.h + 0.02, 12);
    var rGeo = new THREE.TorusGeometry(0.3, 0.06, 6, 12);
    [[-9, -6], [9, -6], [-9, 6], [9, 6]].forEach(function (p) {
      g.add(pos(new THREE.Mesh(hGeo, M.via), p[0], 0, p[1]));
      var r = new THREE.Mesh(rGeo, M.copper); r.rotation.x = -Math.PI / 2;
      g.add(pos(r, p[0], BOARD.h / 2 + 0.01, p[1]));
    });
    return g;
  }

  /* ========== COMPONENT BUILDERS ========== */
  function buildIC(w, d, pps, gl) {
    var g = new THREE.Group(), bh = 0.35, by = BOARD.h / 2;
    var body = new THREE.Mesh(new THREE.BoxGeometry(w, bh, d), M.icBody);
    body.position.y = by + bh / 2; g.add(body);
    var dot = new THREE.Mesh(new THREE.CircleGeometry(0.08, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    dot.rotation.x = -Math.PI / 2; dot.position.set(-w / 2 + 0.2, by + bh + 0.002, -d / 2 + 0.2); g.add(dot);
    var pw = 0.04, ph = 0.02, pl = 0.35;
    var geoZ = new THREE.BoxGeometry(pw, ph, pl), geoX = new THREE.BoxGeometry(pl, ph, pw);
    var spy = by + ph / 2;
    for (var i = 0; i < pps; i++) {
      var px = -w / 2 + 0.1 + ((w - 0.2) / pps) * (i + 0.5);
      g.add(pos(new THREE.Mesh(geoZ, M.pin), px, spy, -d / 2 - pl / 2));
      g.add(pos(new THREE.Mesh(geoZ, M.pin), px, spy, d / 2 + pl / 2));
    }
    for (var j = 0; j < pps; j++) {
      var pz = -d / 2 + 0.1 + ((d - 0.2) / pps) * (j + 0.5);
      g.add(pos(new THREE.Mesh(geoX, M.pin), -w / 2 - pl / 2, spy, pz));
      g.add(pos(new THREE.Mesh(geoX, M.pin), w / 2 + pl / 2, spy, pz));
    }
    addGlow(g, gl, by + bh + 0.5);
    return g;
  }

  function buildCap(r, h, gl) {
    var g = new THREE.Group(), by = BOARD.h / 2;
    g.add(pos(new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 16), M.capBlue), 0, by + h / 2, 0));
    g.add(pos(new THREE.Mesh(new THREE.CylinderGeometry(r - 0.02, r - 0.02, 0.04, 16), M.capTop), 0, by + h + 0.02, 0));
    addGlow(g, gl, by + h + 0.5); return g;
  }
  function buildCrystal(w, d, gl) {
    var g = new THREE.Group(), by = BOARD.h / 2, h = 0.3;
    g.add(pos(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M.crystal), 0, by + h / 2, 0));
    addGlow(g, gl, by + h + 0.5); return g;
  }
  function buildResArray(w, d, gl) {
    var g = new THREE.Group(), by = BOARD.h / 2, h = 0.3;
    g.add(pos(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M.resBdy), 0, by + h / 2, 0));
    [0xcc0000, 0x0000aa, 0xcc8800, 0xd4a843].forEach(function (c, i) {
      g.add(pos(new THREE.Mesh(new THREE.BoxGeometry(0.06, h + 0.01, d + 0.01), new THREE.MeshBasicMaterial({ color: c })),
        -w / 2 + w * 0.2 + i * w * 0.18, by + h / 2, 0));
    });
    addGlow(g, gl, by + h + 0.5); return g;
  }
  function buildLED(r, gl) {
    var g = new THREE.Group(), by = BOARD.h / 2;
    g.add(pos(new THREE.Mesh(new THREE.CylinderGeometry(r + 0.06, r + 0.06, 0.14, 12), M.ledBase), 0, by + 0.07, 0));
    var domeMat = new THREE.MeshStandardMaterial({
      color: gl, roughness: 0.05, transparent: true, opacity: 0.8,
      emissive: new THREE.Color(gl), emissiveIntensity: 0
    });
    var dome = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
    dome.position.y = by + 0.14; g.add(dome);
    g.userData.dome = dome;
    addGlow(g, gl, by + r + 0.5); return g;
  }
  function buildConn(w, d, gl) {
    var g = new THREE.Group(), by = BOARD.h / 2, h = 0.5;
    g.add(pos(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M.conn), 0, by + h / 2, 0));
    g.add(pos(new THREE.Mesh(new THREE.BoxGeometry(w + 0.08, h + 0.04, d - 0.08), M.connSh), 0, by + h / 2, 0));
    addGlow(g, gl, by + h + 0.5); return g;
  }
  function buildSoC(sz, gl) {
    var g = new THREE.Group(), by = BOARD.h / 2, h = 0.42;
    g.add(pos(new THREE.Mesh(new THREE.BoxGeometry(sz, h, sz), M.soc), 0, by + h / 2, 0));
    g.add(pos(new THREE.Mesh(new THREE.BoxGeometry(sz * 0.48, 0.01, sz * 0.48), M.crystal), 0, by + h + 0.006, 0));
    var bg = new THREE.SphereGeometry(0.055, 4, 4);
    var grid = 5, sp = (sz - 0.6) / (grid - 1);
    for (var i = 0; i < grid; i++)
      for (var j = 0; j < grid; j++)
        g.add(pos(new THREE.Mesh(bg, M.pin), -sz / 2 + 0.3 + i * sp, by - 0.025, -sz / 2 + 0.3 + j * sp));
    addGlow(g, gl, by + h + 0.5); return g;
  }

  /* ========== PLACE COMPONENTS ========== */
  var compGroups = [];
  function placeAll() {
    COMPS.forEach(function (c) {
      var g;
      switch (c.type) {
        case 'ic': g = buildIC(2.2, 2.2, 10, c.glow); break;
        case 'cap': g = buildCap(0.45, 1.05, c.glow); break;
        case 'crystal': g = buildCrystal(1.2, 0.6, c.glow); break;
        case 'resistor': g = buildResArray(2.0, 0.5, c.glow); break;
        case 'led': g = buildLED(0.42, c.glow); break;
        case 'connector': g = buildConn(1.4, 0.8, c.glow); break;
        case 'soc': g = buildSoC(2.8, c.glow); break;
      }
      g.position.set(c.x, 0, c.z);
      scene.add(g);
      compGroups.push(g);
    });
  }

  /* ========== TRACES ========== */
  var traceSegs = [];
  function layTraces() {
    var th = 0.02, tw = 0.12, ty = BOARD.h / 2 + th / 2 + 0.002;
    TRACES.forEach(function (path) {
      var segs = [];
      for (var i = 0; i < path.length - 1; i++) {
        var a = path[i], b = path[i + 1];
        var dx = b.x - a.x, dz = b.z - a.z;
        var len = Math.sqrt(dx * dx + dz * dz);
        var ang = Math.atan2(dx, dz);
        var mat = M.darkCu.clone();
        var mesh = new THREE.Mesh(new THREE.BoxGeometry(tw, th, len + tw), mat);
        mesh.position.set((a.x + b.x) / 2, ty, (a.z + b.z) / 2);
        mesh.rotation.y = ang;
        scene.add(mesh);
        segs.push(mesh);
      }
      traceSegs.push(segs);
    });
  }

  /* ========== SCATTER ========== */
  function scatter() {
    var sGeo = new THREE.BoxGeometry(0.28, 0.11, 0.14);
    var by = BOARD.h / 2;
    var pts = [[-7, -5], [-6, -5], [-3, -5], [4, -5], [7, -2], [8, 3], [-6, 2], [-7, 5], [5, 5], [7, 5], [-2, -1], [3, 2], [-5, 1], [6, -4]];
    pts.forEach(function (p, i) {
      var b = new THREE.Mesh(sGeo, M.smd);
      b.position.set(p[0], by + 0.055, p[1]);
      b.rotation.y = (i & 1) * Math.PI / 2;
      scene.add(b);
    });
    var vGeo = new THREE.CylinderGeometry(0.08, 0.08, BOARD.h + 0.01, 6);
    [[-8, -3], [1, -3], [6, -1.5], [-1, 1.5], [0, 3.5], [4, 3.5], [7, 1], [-2, 5]].forEach(function (p) {
      scene.add(pos(new THREE.Mesh(vGeo, M.via), p[0], 0, p[1]));
    });
    for (var i = 0; i < 16; i++) {
      scene.add(pos(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.01, 0.65), M.goldPin), -4 + i * 0.55, by + 0.005, BOARD.d / 2 - 0.33));
    }
  }

  /* ========== ENVIRONMENT ========== */
  function addEnv() {
    var grid = new THREE.GridHelper(50, 50, 0x0a0a10, 0x060608);
    grid.position.y = -2;
    scene.add(grid);
    var n = isMobile ? 50 : 120, pa = new Float32Array(n * 3);
    for (var i = 0; i < n; i++) {
      pa[i * 3] = (Math.random() - 0.5) * 45;
      pa[i * 3 + 1] = Math.random() * 16 - 2;
      pa[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }
    var pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.Float32BufferAttribute(pa, 3));
    scene.add(new THREE.Points(pg, new THREE.PointsMaterial({
      color: 0xFFD600, size: 0.04, transparent: true, opacity: 0.15,
      blending: THREE.AdditiveBlending, depthWrite: false
    })));
  }

  /* ========== CURRENT FLOW ========== */
  var flowPts, flowPos, allPts = [];
  var sparkPts, sparkPos;

  function buildPath() {
    TRACES.forEach(function (seg, si) {
      seg.forEach(function (p, pi) {
        if (pi === 0 && si > 0) return;
        allPts.push(p);
      });
    });
  }
  function pathLen() {
    var l = 0;
    for (var i = 0; i < allPts.length - 1; i++) {
      var a = allPts[i], b = allPts[i + 1];
      l += Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.z - a.z) * (b.z - a.z));
    }
    return l;
  }
  function ptAtDist(d) {
    var acc = 0;
    for (var i = 0; i < allPts.length - 1; i++) {
      var a = allPts[i], b = allPts[i + 1];
      var s = Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.z - a.z) * (b.z - a.z));
      if (acc + s >= d) { var t = (d - acc) / s; return { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t }; }
      acc += s;
    }
    return allPts[allPts.length - 1];
  }

  function makeFlow() {
    buildPath();
    var n = isMobile ? 40 : 80, ty = BOARD.h / 2 + 0.06;
    var geo = new THREE.BufferGeometry();
    flowPos = new Float32Array(n * 3);
    for (var i = 0; i < n; i++) flowPos[i * 3 + 1] = ty;
    geo.setAttribute('position', new THREE.Float32BufferAttribute(flowPos, 3));
    flowPts = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0xFFDD44, size: 0.08, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false
    }));
    scene.add(flowPts);

    var sgeo = new THREE.BufferGeometry();
    sparkPos = new Float32Array((isMobile ? 5 : 10) * 3);
    for (var j = 0; j < (isMobile ? 5 : 10); j++) sparkPos[j * 3 + 1] = ty;
    sgeo.setAttribute('position', new THREE.Float32BufferAttribute(sparkPos, 3));
    sparkPts = new THREE.Points(sgeo, new THREE.PointsMaterial({
      color: 0xFFFFFF, size: 0.12, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false
    }));
    scene.add(sparkPts);
  }

  function tickFlow(prog) {
    if (!flowPts || prog < 0.02) {
      if (flowPts) flowPts.material.opacity = 0;
      if (sparkPts) sparkPts.material.opacity = 0;
      return;
    }
    var total = pathLen();
    var active = prog * total;
    flowPts.material.opacity = 0.55;
    var n = flowPos.length / 3;
    for (var i = 0; i < n; i++) {
      var p = ptAtDist((i / n) * active);
      flowPos[i * 3] = p.x;
      flowPos[i * 3 + 2] = p.z;
    }
    flowPts.geometry.attributes.position.needsUpdate = true;
    if (prog > 0.05 && prog < 0.93) {
      sparkPts.material.opacity = 0.8;
      var lead = ptAtDist(active);
      var sn = sparkPos.length / 3;
      for (var j = 0; j < sn; j++) {
        sparkPos[j * 3] = lead.x + (Math.random() - 0.5) * 0.15;
        sparkPos[j * 3 + 1] = BOARD.h / 2 + 0.06 + Math.random() * 0.08;
        sparkPos[j * 3 + 2] = lead.z + (Math.random() - 0.5) * 0.15;
      }
      sparkPts.geometry.attributes.position.needsUpdate = true;
    } else {
      sparkPts.material.opacity = 0;
    }
  }

  /* ========== BUILD SCENE ========== */
  scene.add(makeBoard());
  placeAll();
  layTraces();
  scatter();
  addEnv();
  makeFlow();

  /* ========== SCROLL-DRIVEN CAMERA WITH SKILL SNAP ========== */
  /* 
   * KEY DESIGN: Each skill stop has TWO phases in the timeline:
   * 1. MOVE phase (0.7 duration) — camera travels to the component
   * 2. HOLD phase (0.3 duration) — camera stays still, giving time to read
   * This creates a natural "snap" feeling at each skill
   */
  gsap.registerPlugin(ScrollTrigger);

  var camP = { x: 16, y: 13, z: 16 };
  var camT = { x: 0, y: 0, z: 0 };
  var scrollProg = 0, activeIdx = -1;

  var tl = gsap.timeline();
  var MOVE_DUR = 0.6;  /* time to move between stops */
  var HOLD_DUR = 0.4;  /* time to pause/hold at each stop (the "snap") */

  for (var s = 1; s < STOPS.length; s++) {
    var t = (s - 1) * (MOVE_DUR + HOLD_DUR);
    /* MOVE to the stop */
    tl.to(camP, { x: STOPS[s].pos[0], y: STOPS[s].pos[1], z: STOPS[s].pos[2], duration: MOVE_DUR, ease: 'power2.inOut' }, t);
    tl.to(camT, { x: STOPS[s].tgt[0], y: STOPS[s].tgt[1], z: STOPS[s].tgt[2], duration: MOVE_DUR, ease: 'power2.inOut' }, t);
    /* HOLD at the stop — camera doesnt move, but timeline progresses */
    if (s < STOPS.length - 1) {
      tl.to({}, { duration: HOLD_DUR }, t + MOVE_DUR);
    }
  }

  /* Skill progress elements */
  var skillProgressEl = document.getElementById('skill-progress');
  var skillDots = document.querySelectorAll('.skill-dot');
  var skillCounter = document.getElementById('skill-counter');

  function updateSkillProgress(idx) {
    skillDots.forEach(function (dot, i) {
      dot.classList.remove('active', 'passed');
      if (i < idx) dot.classList.add('passed');
      else if (i === idx) dot.classList.add('active');
    });
    if (skillCounter) skillCounter.textContent = (idx >= 0 ? (idx + 1) : 0) + ' / 7';
  }

  ScrollTrigger.create({
    trigger: '#pcb-spacer',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5,
    animation: tl,
    onUpdate: function (self) {
      scrollProg = self.progress;

      /* Calculate which stop we're at, accounting for MOVE+HOLD phases */
      var totalDur = tl.duration();
      var currentTime = scrollProg * totalDur;
      var stepDur = MOVE_DUR + HOLD_DUR;

      /* Determine active skill index */
      var idx = -1;
      for (var i = 0; i < 7; i++) {
        var stopStart = i * stepDur + MOVE_DUR;
        var stopEnd = stopStart + HOLD_DUR;
        if (currentTime >= stopStart - MOVE_DUR * 0.3 && currentTime <= stopEnd + MOVE_DUR * 0.3) {
          idx = i;
          break;
        }
      }

      /* Activate skill if within hold zone */
      if (idx >= 0 && idx < 7) {
        var stopMidpoint = idx * stepDur + MOVE_DUR + HOLD_DUR / 2;
        var distFromCenter = Math.abs(currentTime - stopMidpoint);
        if (distFromCenter < HOLD_DUR * 0.6 + MOVE_DUR * 0.2) {
          if (activeIdx !== idx) activate(idx);
        }
      } else {
        /* No skill active — FORCE HIDE ALL overlays (fixes scroll-back bug) */
        if (activeIdx !== -1) activate(-1);
      }

      /* Near the end — deactivate */
      if (scrollProg > 0.92 && activeIdx !== -1) {
        activate(-1);
      }

      /* Skill progress visibility */
      if (skillProgressEl) {
        skillProgressEl.classList.toggle('visible', scrollProg > 0.08 && scrollProg < 0.92);
      }

      /* Hero text + scroll cue */
      var bt = document.getElementById('board-title');
      var sc = document.getElementById('scroll-cue');
      if (bt) bt.style.opacity = scrollProg < 0.06 ? '1' : '0';
      if (sc) sc.style.opacity = scrollProg < 0.03 && poweredOn ? '1' : '0';

      /* Fade out canvas when reaching content */
      var cv = document.getElementById('pcb-canvas');
      var ov = document.getElementById('overlay-container');
      if (scrollProg >= 0.96) {
        cv.style.opacity = '0'; cv.style.transition = 'opacity .5s';
        ov.style.opacity = '0'; ov.style.transition = 'opacity .5s';
        if (skillProgressEl) skillProgressEl.classList.remove('visible');
      } else {
        cv.style.opacity = '1';
        ov.style.opacity = '1';
      }
    },
  });

  /* ========== ACTIVATION ========== */
  function hideAllOverlays() {
    /* Force-hide EVERY overlay — fixes scroll-back stacking bug */
    for (var i = 0; i < 7; i++) {
      var comp = compGroups[i];
      if (comp && comp.userData.light) gsap.to(comp.userData.light, { intensity: 0, duration: 0.4 });
      if (comp) gsap.to(comp.scale, { x: 1, y: 1, z: 1, duration: 0.35 });
      if (comp && comp.userData.dome) gsap.to(comp.userData.dome.material, { emissiveIntensity: 0, duration: 0.35 });
      var el = document.getElementById('ov-' + i);
      if (el) { el.style.opacity = '0'; el.classList.remove('active', 'ring-open'); }
    }
    /* Reset all traces to dark */
    var dark = new THREE.Color(0x6b4423);
    traceSegs.forEach(function (segs) {
      segs.forEach(function (m) {
        gsap.to(m.material.color, { r: dark.r, g: dark.g, b: dark.b, duration: 0.4 });
        gsap.to(m.material, { emissiveIntensity: 0, duration: 0.4 });
      });
    });
  }

  function activate(idx) {
    /* Deactivating — hide ALL overlays (not just previous) */
    if (idx === -1) {
      hideAllOverlays();
      activeIdx = -1;
      updateSkillProgress(-1);
      return;
    }
    /* Deactivate previous */
    if (activeIdx >= 0 && activeIdx < 7) {
      var prev = compGroups[activeIdx];
      if (prev.userData.light) gsap.to(prev.userData.light, { intensity: 0, duration: 0.5 });
      gsap.to(prev.scale, { x: 1, y: 1, z: 1, duration: 0.4 });
      if (prev.userData.dome) gsap.to(prev.userData.dome.material, { emissiveIntensity: 0, duration: 0.4 });
      var prevEl = document.getElementById('ov-' + activeIdx);
      if (prevEl) { prevEl.style.opacity = '0'; prevEl.classList.remove('active', 'ring-open'); }
    }
    activeIdx = idx;
    updateSkillProgress(idx);

    if (idx >= 0 && idx < 7) {
      var comp = compGroups[idx];
      if (comp.userData.light) gsap.to(comp.userData.light, { intensity: 2.5, duration: 0.6 });
      gsap.fromTo(comp.scale, { x: 0.92, y: 0.92, z: 0.92 }, { x: 1.06, y: 1.06, z: 1.06, duration: 0.6, ease: 'back.out(1.5)' });
      if (comp.userData.dome) gsap.to(comp.userData.dome.material, { emissiveIntensity: 0.8, duration: 0.4 });
      glowTraces(idx);
      var el = document.getElementById('ov-' + idx);
      if (el) {
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.4 });
        setTimeout(function () { el.classList.add('active', 'ring-open'); }, 200);
      }
    }
  }

  function glowTraces(upTo) {
    var bright = new THREE.Color(0xd4a040);
    var dark = new THREE.Color(0x6b4423);
    traceSegs.forEach(function (segs, ti) {
      var on = ti <= upTo + 1;
      segs.forEach(function (m) {
        var tc = on ? bright : dark;
        gsap.to(m.material.color, { r: tc.r, g: tc.g, b: tc.b, duration: 0.5 });
        gsap.to(m.material, { emissiveIntensity: on ? 0.25 : 0, duration: 0.5 });
      });
    });
  }

  /* ========== OVERLAY PROJECTION ========== */
  var ovEls = [];
  for (var i = 0; i < 7; i++) ovEls.push(document.getElementById('ov-' + i));
  var labelH = { ic: 2.0, cap: 2.4, crystal: 1.5, resistor: 1.5, led: 1.4, connector: 1.7, soc: 1.9 };

  function projectOverlays() {
    var w = innerWidth, h = innerHeight;
    COMPS.forEach(function (c, i) {
      var el = ovEls[i];
      if (!el) return;
      var p = new THREE.Vector3(c.x, BOARD.h / 2 + (labelH[c.type] || 1.5), c.z);
      p.project(camera);
      if (p.z > 1) { el.style.display = 'none'; return; }
      el.style.display = '';
      el.style.left = ((p.x * 0.5 + 0.5) * w) + 'px';
      el.style.top = ((-p.y * 0.5 + 0.5) * h) + 'px';
    });
  }

  /* ========== RENDER LOOP ========== */
  (function loop() {
    requestAnimationFrame(loop);
    camera.position.set(camP.x, camP.y, camP.z);
    camera.lookAt(camT.x, camT.y, camT.z);
    tickFlow(scrollProg);
    projectOverlays();
    renderer.render(scene, camera);
  })();

  /* ========== RESIZE ========== */
  window.addEventListener('resize', function () {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  /* ========== POWER SWITCH ========== */
  var powerSwitch = document.getElementById('power-switch');
  var switchBtn = document.getElementById('switch-btn');

  if (switchBtn) {
    switchBtn.addEventListener('click', function () {
      if (poweredOn) return;
      poweredOn = true;
      switchBtn.style.background = 'radial-gradient(circle at 35% 35%,#66ff66,#00cc00,#008800)';
      switchBtn.style.boxShadow = '0 0 50px rgba(0,255,0,.6),inset 0 -4px 8px rgba(0,0,0,.4)';
      gsap.to(powerSwitch, {
        opacity: 0, y: 20, duration: 0.5, onComplete: function () {
          powerSwitch.classList.add('hidden');
        }
      });
      document.body.style.overflow = '';
      document.getElementById('scroll-cue').style.opacity = '1';
    });
  }

  /* ========== HEADER ========== */
  var header = document.getElementById('header');
  ScrollTrigger.create({
    trigger: '#work',
    start: 'top 80%',
    onEnter: function () { header.classList.add('visible'); },
    onLeaveBack: function () { header.classList.remove('visible'); },
  });
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 100);
  });

  var menuBtn = document.getElementById('menu-toggle');
  var mobNav = document.getElementById('mobile-nav');
  if (menuBtn) menuBtn.addEventListener('click', function () {
    menuBtn.classList.toggle('active');
    mobNav.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-link').forEach(function (l) {
    l.addEventListener('click', function () { menuBtn.classList.remove('active'); mobNav.classList.remove('open'); });
  });
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ========== BELOW-FOLD GSAP ANIMATIONS ========== */
  gsap.utils.toArray('.project-card').forEach(function (el, i) {
    gsap.from(el, {
      y: 60, opacity: 0, duration: 0.8, ease: 'power2.out',
      delay: i * 0.12,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
  });
  gsap.utils.toArray('.section-header').forEach(function (el) {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });
  gsap.from('.portrait-wrap', {
    scale: 0.85, opacity: 0, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '.portrait-wrap', start: 'top 85%', once: true }
  });
  gsap.from('.about-lead', {
    y: 30, opacity: 0, duration: 0.7, ease: 'power2.out',
    scrollTrigger: { trigger: '.about-lead', start: 'top 88%', once: true }
  });
  gsap.utils.toArray('.stat-n').forEach(function (el) {
    var target = parseInt(el.dataset.count);
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: function () {
        gsap.to({ v: 0 }, {
          v: target, duration: 1.5, ease: 'power2.out',
          onUpdate: function () { el.textContent = Math.round(this.targets()[0].v); }
        });
      },
    });
  });
  gsap.from('.contact-heading', {
    y: 50, opacity: 0, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '.contact-heading', start: 'top 88%', once: true }
  });

  /* ========== PRELOADER ========== */
  function dismissPreloader() {
    var pre = document.getElementById('preloader');
    if (pre && !pre.classList.contains('done')) {
      pre.classList.add('done');
      canvas.classList.add('interactive');
      gsap.to('#board-title', { opacity: 1, duration: 1, delay: 0.2 });
      gsap.to(powerSwitch, {
        opacity: 1, duration: 0.6, delay: 0.6, onStart: function () {
          powerSwitch.classList.add('visible');
        }
      });
    }
  }
  if (document.readyState === 'complete') {
    setTimeout(dismissPreloader, 800);
  } else {
    window.addEventListener('load', function () { setTimeout(dismissPreloader, 800); });
    setTimeout(dismissPreloader, 3500);
  }
})();
