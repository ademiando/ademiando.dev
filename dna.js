// script.js
document.addEventListener('DOMContentLoaded', function() {

  // =========================
  // 1. THREE.JS BACKGROUND
  // =========================
  // buat container fixed di belakang
  const bgContainer = document.createElement('div');
  bgContainer.id = 'three-bg';
  Object.assign(bgContainer.style, {
    position: 'fixed',
    top: '0', left: '0',
    width: '100%', height: '100%',
    zIndex: '-1'
  });
  document.body.prepend(bgContainer);

  // inisialisasi scene, camera, renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 50);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  bgContainer.appendChild(renderer.domElement);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // === DNA HELIX 3D ===
  const helixCurve = new THREE.Curve();
  helixCurve.getPoint = t => {
    const radius = 2, pitch = 0.5;
    const theta = t * Math.PI * 4; // 2 putaran
    return new THREE.Vector3(
      Math.cos(theta)*radius,
      (t - 0.5)*pitch*20,
      Math.sin(theta)*radius
    );
  };
  const helixGeo = new THREE.TubeGeometry(helixCurve, 300, 0.15, 12, false);
  const helixMat = new THREE.MeshStandardMaterial({
    color: 0x00ffcc,
    emissive: 0x002222,
    metalness: 0.2,
    roughness: 0.4
  });
  const helixMesh = new THREE.Mesh(helixGeo, helixMat);
  scene.add(helixMesh);

  // === GLOBE BUMI MALAM ===
  const globeGeo = new THREE.SphereGeometry(10, 64, 64);
  const globeMat = new THREE.MeshPhongMaterial({
    map:        new THREE.TextureLoader().load('earth_nightmap.jpg'),
    specularMap:new THREE.TextureLoader().load('earth_specular.jpg'),
    specular:   new THREE.Color(0x222222),
    shininess:  5,
    emissive:   new THREE.Color(0x111111)
  });
  const globeMesh = new THREE.Mesh(globeGeo, globeMat);
  globeMesh.rotation.y = Math.PI;
  scene.add(globeMesh);

  // === LIGHTS ===
  const ambient = new THREE.AmbientLight(0x404040, 1.1);
  const point  = new THREE.PointLight(0xffffff, 1);
  point.position.set(50, 50, 50);
  scene.add(ambient, point);

  // === ANIMATE 3D SCENE ===
  function animate3D() {
    requestAnimationFrame(animate3D);
    // helix muter & nge-bob
    helixMesh.rotation.y += 0.006;
    helixMesh.position.y = Math.sin(Date.now()/800) * 2;
    // globe pelan
    globeMesh.rotation.y += 0.001;
    renderer.render(scene, camera);
  }
  animate3D();

  // =========================
  // 2. CUBE INTERAKTIF 3D
  // =========================
  const cube = document.querySelector('.cube');
  let angleX = 0, angleY = 0, angleZ = 0;
  let autoRotate = true, autoRotateTimeout;
  const AUTO_ROTATE_DELAY = 2000;

  if (cube) {
    function enableAutoRotate() { autoRotate = true; }
    function delayAutoRotate() {
      clearTimeout(autoRotateTimeout);
      autoRotateTimeout = setTimeout(enableAutoRotate, AUTO_ROTATE_DELAY);
    }
    function handleUserInteraction() {
      autoRotate = false;
      delayAutoRotate();
    }

    setInterval(() => {
      if (autoRotate) {
        angleX = 15 + 5 * Math.sin(Date.now() / 5000);
        angleY += 1;
        cube.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
      }
    }, 20);

    let dragging = false, lastX, lastY;
    const parent = cube.parentElement;

    // mouse + touch start
    ['mousedown','touchstart'].forEach(evt => {
      parent.addEventListener(evt, e => {
        dragging = true;
        lastX = e.clientX || e.touches[0].clientX;
        lastY = e.clientY || e.touches[0].clientY;
        handleUserInteraction();
      });
    });

    // move
    ['mousemove','touchmove'].forEach(evt => {
      window.addEventListener(evt, e => {
        if (!dragging) return;
        const x = e.clientX || e.touches[0].clientX;
        const y = e.clientY || e.touches[0].clientY;
        angleY += (x - lastX) * 0.8;
        angleX -= (y - lastY) * 0.8;
        cube.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg) rotateZ(${angleZ}deg)`;
        lastX = x; lastY = y;
      });
    });

    // end
    ['mouseup','touchend'].forEach(evt => {
      window.addEventListener(evt, () => {
        if (dragging) {
          dragging = false;
          handleUserInteraction();
        }
      });
    });
  }

  // =========================
  // 3. Particles.js
  // =========================
  particlesJS('particles-js', {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: '#00ffcc' },
      shape: { type: 'circle', stroke: { width: 0, color: '#000' } },
      opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
      size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1 } },
      line_linked: { enable: true, distance: 150, color: '#00ffcc', opacity: 0.2, width: 1 },
      move: { enable: true, speed: 1, random: true, out_mode: 'out' }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
      modes: { grab: { distance: 140, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } }
    },
    retina_detect: true
  });

  // =========================
  // 4. Smooth scroll, accordion, menu, observer, form
  // =========================
  document.querySelectorAll('a[href^=\"#\"]').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const tgt=document.querySelector(a.getAttribute('href'));
      if(tgt) window.scrollTo({ top: tgt.offsetTop-70, behavior: 'smooth' });
    });
  });
  document.querySelectorAll('.accordion-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      btn.classList.toggle('active');
      const p=btn.nextElementSibling;
      p.style.maxHeight = p.style.maxHeight ? null : p.scrollHeight+'px';
    });
  });
  const ham=document.querySelector('.hamburger'), nav=document.querySelector('.nav-links');
  if(ham&&nav) ham.addEventListener('click', ()=>{ ham.classList.toggle('active'); nav.classList.toggle('active'); });
  const obs=new IntersectionObserver((e,o)=>{ e.forEach(it=>{ if(it.isIntersecting){ it.target.classList.add('animated'); o.unobserve(it.target); } }); }, {threshold:0.1});
  document.querySelectorAll('.section, .hero-section, .portfolio-card, .paket-card').forEach(el=>obs.observe(el));
  const form=document.querySelector('form');
  if(form) form.addEventListener('submit', e=>{
    e.preventDefault();
    fetch(form.action,{ method: form.method, body:new FormData(form), headers:{'Accept':'application/json'} })
      .then(r=>{ if(r.ok){ alert('Pesan berhasil dikirim!'); form.reset(); } else throw ''; })
      .catch(_=>{ alert('Terjadi kesalahan. Silakan coba lagi.'); });
  });

});