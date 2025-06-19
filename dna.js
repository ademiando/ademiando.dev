// dna.js
document.addEventListener('DOMContentLoaded', function() {
  // =========================
  // 1. THREE.JS BACKGROUND
  // =========================
  const bgContainer = document.createElement('div');
  bgContainer.id = 'three-bg';
  Object.assign(bgContainer.style, {
    position: 'fixed', top: 0, left: 0,
    width: '100%', height: '100%',
    zIndex: '-1'
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
  // 2. DNA HELIX 3D
  // =========================
  const helixCurve = new THREE.Curve();
  helixCurve.getPoint = t => {
    const r = 2, p = 0.5;
    const theta = t * Math.PI * 4;  // 2 putaran
    return new THREE.Vector3(
      Math.cos(theta) * r,
      (t - 0.5) * p * 20,
      Math.sin(theta) * r
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

  // =========================
  // 3. GLOBE BUMI NIGHT
  // =========================
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

  // lighting
  scene.add(new THREE.AmbientLight(0x404040, 1.1));
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(50,50,50);
  scene.add(pointLight);

  // animate 3D
  function animate3D() {
    requestAnimationFrame(animate3D);
    helixMesh.rotation.y += 0.006;
    helixMesh.position.y = Math.sin(Date.now()/800) * 2;
    globeMesh.rotation.y += 0.001;
    renderer.render(scene, camera);
  }
  animate3D();

  // =========================
  // 4. PARTICLES.JS: DNA SPIRAL
  // =========================
  particlesJS('particles-js', {
    particles: {
      number: { value: 200, density: { enable: true, value_area: 1200 } },
      color: { value: '#00ffcc' },
      shape: {
        type: 'edge',
        stroke: { width: 0.5, color: '#00ffcc' }
      },
      opacity: { value: 0.7, random: true },
      size: { value: 4, random: true },
      line_linked: {
        enable: true,
        distance: 60,
        color: '#00ffcc',
        opacity: 0.3,
        width: 1
      },
      move: {
        enable: true,
        speed: 0.5,
        random: true,
        out_mode: 'out'
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: true, mode: 'grab' },
        onclick: { enable: true, mode: 'push' }
      },
      modes: {
        grab: { distance: 120, line_linked: { opacity: 0.6 } },
        push: { particles_nb: 5 }
      }
    },
    retina_detect: true
  });

  // =========================
  // 5. INTERAKSI GLOBE DRAG
  // =========================
  let dragging = false, lastX, lastY, rotX = 0, rotY = 0;
  const canvas = renderer.domElement;
  canvas.addEventListener('mousedown', e => { dragging = true; lastX = e.clientX; lastY = e.clientY; });
  window.addEventListener('mousemove', e => {
    if (dragging) {
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      rotY += dx * 0.005;
      rotX -= dy * 0.005;
      lastX = e.clientX; lastY = e.clientY;
      globeMesh.rotation.x = rotX;
      globeMesh.rotation.y = rotY + Math.PI;
    }
  });
  window.addEventListener('mouseup', () => dragging = false);

    // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });

  // Accordion functionality
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      this.classList.toggle('active');
      const panel = this.nextElementSibling;

      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  // Add animation on scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe sections
  document.querySelectorAll('.section, .hero-section, .portfolio-card, .paket-card').forEach(section => {
    observer.observe(section);
  });

  // Form submission handling
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Form submission logic
      const formData = new FormData(this);

      // Simulate form submission
      fetch(this.action, {
        method: this.method,
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          alert('Pesan berhasil dikirim! Kami akan menghubungi Anda segera.');
          form.reset();
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Terjadi kesalahan. Silakan coba lagi atau hubungi kami via WhatsApp.');
      });
    });
  }
});



