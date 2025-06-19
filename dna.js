// script.js
document.addEventListener('DOMContentLoaded', function() {
  // --- THREE.JS Backdrop: DNA Helix ---
  const bg = document.createElement('div');
  bg.id = 'three-bg';
  Object.assign(bg.style, {
    position: 'fixed', top:0, left:0, width:'100%', height:'100%', zIndex:'-1'
  });
  document.body.prepend(bg);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  bg.appendChild(renderer.domElement);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const helixCurve = new THREE.Curve();
  helixCurve.getPoint = t => {
    const r = 2, p = 0.5;
    const θ = t * Math.PI * 4;
    return new THREE.Vector3(Math.cos(θ)*r, (t-0.5)*p*20, Math.sin(θ)*r);
  };
  const helixGeo = new THREE.TubeGeometry(helixCurve, 300, 0.15, 12, false);
  const helixMat = new THREE.MeshStandardMaterial({
    color: 0x00ffcc, emissive: 0x002222, metalness:0.2, roughness:0.4
  });
  const helixMesh = new THREE.Mesh(helixGeo, helixMat);
  scene.add(helixMesh);

  const ambient = new THREE.AmbientLight(0x404040, 1.1);
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(50, 50, 50);
  scene.add(ambient, pointLight);

  function animate3D() {
    requestAnimationFrame(animate3D);
    helixMesh.rotation.y += 0.006;
    helixMesh.position.y = Math.sin(Date.now()/800)*2;
    renderer.render(scene, camera);
  }
  animate3D();

  // --- Particles.js: DNA Spiral Variant ---
  particlesJS('particles-js', {
    particles: {
      number: { value: 200, density: { enable: true, value_area: 1200 } },
      color: { value: '#00ffcc' },
      shape: { type: 'edge', stroke: { width: 0.5, color: '#00ffcc' } },
      opacity: { value: 0.7, random: true },
      size: { value: 4, random: true },
      line_linked: { enable: true, distance: 60, color: '#00ffcc', opacity: 0.3, width: 1 },
      move: { enable: true, speed: 0.5, direction: 'none', random: true, out_mode: 'out' }
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

  // --- Replace cube interaktif with Globe Earth ---
  const globe = document.createElement('div');
  globe.id = 'globe-container';
  globe.style = `position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:300px; height:300px;`;
  document.body.appendChild(globe);

  const globeScene = new THREE.Scene();
  const globeCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  globeCamera.position.z = 3;

  const globeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  globeRenderer.setSize(300, 300);
  globe.appendChild(globeRenderer.domElement);

  const sphereGeo = new THREE.SphereGeometry(1, 64, 64);
  const sphereMat = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load('earth_nightmap.jpg'),
    specularMap: new THREE.TextureLoader().load('earth_specular.jpg'),
    specular: new THREE.Color(0x222222),
    shininess: 5,
    emissive: new THREE.Color(0x111111)
  });
  const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
  sphereMesh.rotation.y = Math.PI;
  globeScene.add(sphereMesh);
  globeScene.add(new THREE.AmbientLight(0x404040, 1.1));
  const globeLight = new THREE.PointLight(0xffffff, 1);
  globeLight.position.set(5,5,5);
  globeScene.add(globeLight);

  let isDragging = false, lastX, lastY, rotX=0, rotY=0;
  globeRenderer.domElement.addEventListener('mousedown', e => { isDragging=true; lastX=e.clientX; lastY=e.clientY; });
  window.addEventListener('mousemove', e => {
    if(isDragging){
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      rotY += dx*0.005;
      rotX -= dy*0.005;
      lastX = e.clientX; lastY = e.clientY;
    }
  });
  window.addEventListener('mouseup', ()=>isDragging=false);
  
  function animateGlobe() {
    requestAnimationFrame(animateGlobe);
    sphereMesh.rotation.y += 0.0005;
    sphereMesh.rotation.x = rotX;
    sphereMesh.rotation.y = rotY;
    globeRenderer.render(globeScene, globeCamera);
  }
  animateGlobe();

  // --- Utility (scroll, form, etc) bebas copy dari kamu sebelumnya ---
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