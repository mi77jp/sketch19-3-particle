import '../scss/style.scss';
import * as THREE from 'three';
import * as controls from 'three-orbit-controls';
const OrbitControls = controls.default(THREE);

(function () {

  // 1. Scene
  const scene = new THREE.Scene();

  // 2. Camera
  const camera = new THREE.PerspectiveCamera(50, 1);// (視野角, アスペクト比, near, far)
  //camera.position.z = 1500;

  // 7. Renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(
    800,//window.innerWidth,
    800//window.innerHeight
  );
  renderer.shadowMap.enabled = true;

  // 8. Append objects to DOM
  document.getElementById('wrapper').appendChild( renderer.domElement );

  // 9. Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = false;

  // 10. Particles
  const geometry = new THREE.Geometry();
  const SIZE = 1000;// 配置する範囲
  const LENGTH = 5000;// 配置する個数
  for (let i = 0; i < LENGTH; i++) {
    geometry.vertices.push(new THREE.Vector3(
      SIZE * (Math.random() - 0.5),
      SIZE * (Math.random() - 0.5),
      SIZE * (Math.random() - 0.5),
    ));
  }
  const material = new THREE.PointsMaterial({
    size: 5,
    color: 0xFFFFFF,
  });

  const mesh = new THREE.Points(geometry, material);
  scene.add(mesh);

  // 11. Run the world
  requestAnimationFrame( run );

  function run () {
    renderer.render(scene, camera);

  }

})();
