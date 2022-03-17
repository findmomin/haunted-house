import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './style.css';

// Elements
const canvas = document.querySelector('.webgl') as HTMLCanvasElement;

// Variables
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const cursor = {
  x: 0,
  y: 0,
};

const textureLoader = new THREE.TextureLoader();

// Textures
const doorColorTexture = textureLoader.load('textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load(
  'textures/door/ambientOcclusion.jpg'
);
const doorNormalTexture = textureLoader.load('textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('textures/door/roughness.jpg');
const doorHeightTexture = textureLoader.load('textures/door/height.jpg');

const bricksColorTexture = textureLoader.load('textures/bricks/color.jpg');
const bricksAmbientOcclusionTexture = textureLoader.load(
  'textures/bricks/ambientOcclusion.jpg'
);
const bricksNormalTexture = textureLoader.load('textures/bricks/normal.jpg');
const bricksRoughnessTexture = textureLoader.load(
  'textures/bricks/roughness.jpg'
);

const grassColorTexture = textureLoader.load('textures/grass/color.jpg');
const grassAmbientOcclusionTexture = textureLoader.load(
  'textures/grass/ambientOcclusion.jpg'
);
const grassNormalTexture = textureLoader.load('textures/grass/normal.jpg');
const grassRoughnessTexture = textureLoader.load(
  'textures/grass/roughness.jpg'
);

grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

// Scene
const scene = new THREE.Scene();

// Fog
const fog = new THREE.Fog('#262837', 2, 15);

// Ghost
const ghostOne = new THREE.PointLight('#ff00ff', 2, 3);
const ghostTwo = new THREE.PointLight('#00ffff', 2, 3);
const ghostThree = new THREE.PointLight('#ffff00', 2, 3);

// House
const house = new THREE.Group();

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);
walls.position.y = 1.25;
walls.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: '#b35f45' })
);
roof.position.y = 3;
roof.rotation.y = Math.PI / 4;

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.z = 2.001;
door.position.y = 1;

// Bush
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });

const bushOne = new THREE.Mesh(bushGeometry, bushMaterial);
bushOne.scale.set(0.5, 0.5, 0.5);
bushOne.position.set(0.8, 0.2, 2.2);

const bushTwo = new THREE.Mesh(bushGeometry, bushMaterial);
bushTwo.scale.set(0.25, 0.25, 0.25);
bushTwo.position.set(1.4, 0.1, 2.1);

const bushThree = new THREE.Mesh(bushGeometry, bushMaterial);
bushThree.scale.set(0.4, 0.4, 0.4);
bushThree.position.set(-0.8, 0.1, 2.2);

const bushFour = new THREE.Mesh(bushGeometry, bushMaterial);
bushFour.scale.set(0.15, 0.15, 0.15);
bushFour.position.set(-1, 0.05, 2.6);

// Graves
const graves = new THREE.Group();

const graveGeometry = new THREE.BoxGeometry(0.6, 1, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * 6 + 3;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);

  grave.position.set(Math.sin(angle) * radius, 0.2, Math.cos(angle) * radius);
  grave.rotation.set(0, (Math.random() - 0.5) * 0.4, Math.random() - 0.5);
  grave.castShadow = true;

  graves.add(grave);
}

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
floor.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);

// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
moonLight.position.set(4, 5, -2);

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1.7);
doorLight.position.set(0, 2.2, 2.7);

house.add(bushOne, bushTwo, bushThree, bushFour, walls, roof, door, doorLight);

// Shadows
moonLight.castShadow = true;
doorLight.castShadow = true;
ghostOne.castShadow = true;
ghostTwo.castShadow = true;
ghostThree.castShadow = true;

walls.castShadow = true;
bushOne.castShadow = true;
bushTwo.castShadow = true;
bushThree.castShadow = true;
bushFour.castShadow = true;

floor.receiveShadow = true;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghostOne.shadow.mapSize.width = 256;
ghostOne.shadow.mapSize.height = 256;
ghostOne.shadow.camera.far = 7;

ghostTwo.shadow.mapSize.width = 256;
ghostTwo.shadow.mapSize.height = 256;
ghostTwo.shadow.camera.far = 7;

ghostThree.shadow.mapSize.width = 256;
ghostThree.shadow.mapSize.height = 256;
ghostThree.shadow.camera.far = 7;

// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

scene.add(
  camera,
  house,
  floor,
  ambientLight,
  moonLight,
  graves,
  ghostOne,
  ghostTwo,
  ghostThree
);
scene.fog = fog;

// Renderer
const renderer = new THREE.WebGL1Renderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#262837');
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('mousemove', event => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
});

const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update ghosts
  ghostOne.position.set(
    Math.cos(elapsedTime * 0.5) * 4,
    Math.sin(elapsedTime * 3),
    Math.sin(elapsedTime * 0.5) * 4
  );

  ghostTwo.position.set(
    Math.cos(elapsedTime * 0.32) * 5,
    Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5),
    Math.sin(elapsedTime * 0.32) * 5
  );

  ghostThree.position.set(
    Math.cos(elapsedTime * 0.18) * (7 + Math.sign(elapsedTime * 0.32)),
    Math.sin(elapsedTime * 0.18) * (7 + Math.sin(elapsedTime * 0.5)),
    Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2)
  );

  controls.update();

  renderer.render(scene, camera);

  return requestAnimationFrame(animate);
};

animate();
