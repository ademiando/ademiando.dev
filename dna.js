// script.js
document.addEventListener('DOMContentLoaded', function() {

  // =========================
  // 1. THREE.JS BACKGROUND
  // =========================
  const bgContainer = document.createElement('div');
  bgContainer.id = 'three-bg';
  Object.assign(bgContainer.style, {
    position: 'fixed',
    top: '0', left: '0',
    width: '100%', height: '100%',
    zIndex: '-1',
  });
  document.body.prepend(bgContainer);

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

  // =========================
  // 2. DNA HELIX 3D ANIMATION
  // =========================
  const dnaCurve = new THREE.Curve();
  dnaCurve.getPoint = function(t) {
    const radius = 2, pitch = 0.5;
    const theta = t * Math.PI * 4; // 2 turns
    return new THREE.Vector3(
      Math.cos(theta) * radius,
      (t - 0.5) * pitch * 20,
      Math.sin(theta) * radius
    );
  };
  const dnaGeo = new THREE.TubeGeometry(dnaCurve, 200, 0.2, 8, false);
  const dnaMat = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x006666,
    metalness: 0.1,
    roughness: 0.5,
    // map: new THREE.TextureLoader().load('dna_texture.png'),
  });
  const dnaMesh = new THREE.Mesh(dnaGeo, dnaMat);
  scene.add(dnaMesh);

  // =========================
  // 3. GLOBE BUMI MALAM TEKNOLOGI
  // =========================
  const earthGeo = new THREE.SphereGeometry(10, 64, 64);
  const earthMat = new THREE.MeshPhongMaterial({
    map:        new THREE.TextureLoader().load('earth_nightmap.jpg'),
    specularMap:new THREE.TextureLoader().load('earth_specular.jpg'),
    specular:   new THREE.Color(0x222222),
    shininess:  5,
    emissive:   new THREE.Color(0x111111),
  });
  const earthMesh = new THREE.Mesh(earthGeo, earthMat);
  earthMesh.rotation.y = Math.PI;
  scene.add(earthMesh);

  // =========================
  // 4. LIGHTING SETUP
  // =========================
  const ambientLight = new THREE.AmbientLight(0x404040, 1.2);
  const pointLight   = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(50, 50, 50);
  scene.add(ambientLight, pointLight);

  // =========================
  // 5. RENDER LOOP
  // =========================
  function animate() {
    requestAnimationFrame(animate);
    // Gerakkan DNA helix
    dnaMesh.rotation.y += 0.005;
    dnaMesh.position.y = Math.sin(Date.now() / 1000) * 2;
    // Rotasi globe pelan
    earthMesh.rotation.y += 0.001;
    renderer.render(scene, camera);
  }
  animate();

  // ===========================================
  // 6. CUBE INTERAKTIF 3D (existing logic)
  // ===========================================
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

    ['mousedown','touchstart'].forEach(evt => {
      parent.addEventListener(evt, e => {
        dragging = true;
        lastX = e.clientX || e.touches[0].clientX;
        lastY = e.clientY || e.touches[0].clientY;
        handleUserInteraction();
      });
    });

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
  // 7. Particles.js INIT
  // =========================
  particlesJS('particles-js', {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: '#FFD700' },
      shape: { type: 'circle', stroke: { width: 0, color: '#000' } },
      opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
      size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1, sync: false } },
      line_linked: { enable: true, distance: 150, color: '#FFD700', opacity: 0.2, width: 1 },
      move: { enable: true, speed: 1, random: true, out_mode: 'out' }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
      modes: { grab: { distance: 140, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } }
    },
    retina_detect: true
  });

  // =========================
  // 8. Utility: Smooth Scroll, Accordion, Menu
  // =========================
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const tgt = document.querySelector(a.getAttribute('href'));
      if (tgt) window.scrollTo({ top: tgt.offsetTop - 70, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const panel = btn.nextElementSibling;
      panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + 'px';
    });
  });

  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        obs.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px', threshold: 0.1 });
  document.querySelectorAll('.section, .hero-section, .portfolio-card, .paket-card')
    .forEach(el => observer.observe(el));

  // =========================
  // 9. Form Submission Handler
  // =========================
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(form);
      fetch(form.action, { method: form.method, body: data, headers: { 'Accept': 'application/json' } })
        .then(res => {
          if (res.ok) {
            alert('Pesan berhasil dikirim! Kami akan menghubungi Anda segera.');
            form.reset();
          } else throw new Error('Network response was not ok.');
        })
        .catch(err => {
          console.error('Error:', err);
          alert('Terjadi kesalahan. Silakan coba lagi atau hubungi kami via WhatsApp.');
        });
    });
  }

});