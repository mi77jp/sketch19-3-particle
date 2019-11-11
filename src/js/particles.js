import '../scss/style.scss';
import * as THREE from 'three';
import * as controls from 'three-orbit-controls';
const OrbitControls = controls.default(THREE);

(function () {

  // 1. Scene
  const scene = new THREE.Scene();

  // 2. Camera
  const camera = new THREE.PerspectiveCamera(90, 1);// (視野角, アスペクト比, near, far)
  camera.position.z = 1500;

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
  const SIZE = 2000;// 配置する範囲
  const LENGTH = 1000;// 配置する個数
  const material = new THREE.PointsMaterial({
    size: 8,
    color: 0xFFFFFF,
  });
  const mesh = new THREE.Points(geometry, material);
  scene.add(mesh);

  // 11. Run
  const randomVertices = [];
  let timer = 0;

  for (let i = 0; i < LENGTH; i++) {
    randomVertices[i] = new THREE.Vector3(
      SIZE * (Math.random() - 0.5),
      SIZE * (Math.random() - 0.5),
      SIZE * (Math.random() - 0.5)
    );
    geometry.vertices[i] = randomVertices[i];
  }

  // 11. Run the world
  requestAnimationFrame( run );

  function run () {
    geometry.verticesNeedUpdate = true;
    timer ++;
    //
    for (let i = 0; i < LENGTH; i++) {
      let targetVector;
      let particleVector;
      switch (getParam('mode')) {

        case 'spiral':
        const circleSize = LENGTH/10;
        targetVector = new THREE.Vector3(
          SIZE/4 * (Math.cos(i * circleSize)),
          SIZE/4 * (Math.sin(i * circleSize)),
          SIZE * (i/LENGTH - 0.5),
        );
        break;

        default:
          targetVector = randomVertices[i];
        break;
      }
      const shiftCoefficient = 28;
      particleVector = new THREE.Vector3(
        geometry.vertices[i].x + (targetVector.x - geometry.vertices[i].x)/shiftCoefficient,
        geometry.vertices[i].y + (targetVector.y - geometry.vertices[i].y)/shiftCoefficient,
        geometry.vertices[i].z + (targetVector.z - geometry.vertices[i].z)/shiftCoefficient
      );
      geometry.vertices[i] = particleVector;
    }
    //
    const radian = timer/2 * Math.PI / 180;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.position.x = SIZE/2 * Math.cos(radian);
    camera.position.z = SIZE/2 * Math.sin(radian);
    //
    renderer.render(scene, camera);
    requestAnimationFrame( run );
  }

  function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

})();
