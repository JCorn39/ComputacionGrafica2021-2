// Imports
import * as THREE from 'https://cdn.skypack.dev/three@0.131.3';
import * as dat from 'dat.gui';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.131.3/examples/jsm/controls/OrbitControls.js';

// Configuracion basica
let gui = undefined;
let size = 0;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer();

// Paleta de colores
const palette = {
  bgColor: '#34495e', // CSS String
};

let plane = undefined;
let spotLight;

// Variables generales
let countCube = undefined;
let countSphere = undefined;
let countSpotLight = undefined;
let countAmbientLight = undefined;
let countDirectLight = undefined;
let countPointLight = undefined;
let GUIFolderCube = 1;
let GUIFolderSphere = 1;
let GUIFolderSpotLight =1;
let GUIFolderAmbientLight =1;
let GUIFolderDirectLight =1;
let GUIFolderPointLight =1;

const objectsCube = [];
const objectsSpotLight = [];
const objectsSphere=[];
const objectsAmbientLight=[];
const objectsDirectLight=[];
const objectsPointLight=[];

//Dimensionar pantalla
window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, true);
};

//Resetear escena
export function reset() {
  scene.children = [];
  renderer.setSize(0, 0, true);
  countCube = 0;
  GUIFolderCube = 1;
}

// Main
export function main(optionSize) {
  size = optionSize;
  // Configuracion inicial
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(palette.bgColor, 1);
  document.body.appendChild(renderer.domElement);

  camera.position.z = 15;
  camera.position.y = 15;

  // Controls
  new OrbitControls(camera, renderer.domElement);

  // Plano por defecto
  defaultPlane(optionSize);

  // GUI
  loadGUI();

  // Light
  setupLights();
  
  // Render
  animate();
}

//Plano
function defaultPlane(size){
  const geometryPlane = new THREE.PlaneGeometry(size, size, size, size);
  const materialPlane = new THREE.MeshPhongMaterial({
    color: '#42434c',
    side: THREE.DoubleSide,
    wireframe: false,
  });
  plane = new THREE.Mesh(geometryPlane, materialPlane);
  scene.add(plane);
  plane.receiveShadow = true;
  plane.rotation.x = Math.PI / 2;
}

function loadGUI() {
  gui = new dat.GUI();
  gui = gui.addFolder('Color Fondo');
  gui.open();	

  gui.addColor(palette, 'bgColor');

}
// Limpia el GUI
export function cleanGUI() {
  const dom = document.querySelector('.dg.main');
  if (dom) dom.remove();
}
//Animate
function animate() {
  requestAnimationFrame(animate);
  updateElements();
  renderer.render(scene, camera);
  renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
}
//Update
function updateElements() {
  updateCubo();
  updateSphere();
  updateSpotLights();
  updateAmbientLight();
  updateDirectLights();
  updatePointLights();
  renderer.setClearColor(palette.bgColor, 1);
}

//Cubo
function updateCubo(){
	Object.keys(objectsCube).forEach((i) => {
    const cubeSelected = objectsCube[i];
    //Material cubo
    cubeSelected.GUIcube.material == 'Basic'
      ? (cubeSelected.material = new THREE.MeshBasicMaterial({
          color: cubeSelected.GUIcube.materialColor,
          wireframe: cubeSelected.GUIcube.wireframe,
          transparent: cubeSelected.GUIcube.transparent,
          opacity: cubeSelected.GUIcube.opacity,
        }))
      : cubeSelected.GUIcube.material == 'Lambert'
      ? (cubeSelected.material = new THREE.MeshLambertMaterial({
          color: cubeSelected.GUIcube.materialColor,
          wireframe: cubeSelected.GUIcube.wireframe,
          transparent: cubeSelected.GUIcube.transparent,
          opacity: cubeSelected.GUIcube.opacity,
        }))
      : (cubeSelected.material = new THREE.MeshPhongMaterial({
          color: cubeSelected.GUIcube.materialColor,
          wireframe: cubeSelected.GUIcube.wireframe,
          transparent: cubeSelected.GUIcube.transparent,
          opacity: cubeSelected.GUIcube.opacity,
        }));

    //Escalar cubo
    cubeSelected.geometry = new THREE.BoxGeometry(
      cubeSelected.GUIcube.scaleX,
      cubeSelected.GUIcube.scaleY,
      cubeSelected.GUIcube.scaleZ,
    );

    //Posición
    cubeSelected.position.x = cubeSelected.GUIcube.posX;
    cubeSelected.position.y = cubeSelected.GUIcube.posY;
    cubeSelected.position.z = cubeSelected.GUIcube.posZ;
  });

}

export function createCubeGeneric() {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({
    color: 0xffaec0,
    wireframe: true,
  });
  const cube = new THREE.Mesh(geometry, material);

  scene.add(cube);
  objectsCube.push(cube);
  cube.position.y = 0.5;
  cube.castShadow = true;
  cube.receiveShadow = true;

  cube.GUIcube = cubeObject();
  createCubeGUI(cube.GUIcube);

  countCube = countCube + 1;
}

function cubeObject() {
  var GUIcube = {
    material: 'Basic',
    materialColor: 0xffaec0,
    wireframe: false,
    transparent: false,
    opacity: 1,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    posX: 0,
    posY: 0.5,
    posZ: 0,
  };

  return GUIcube;
}

function createCubeGUI(GUIcube) {
  const folder = gui.addFolder('Cubo # ' + GUIFolderCube);
  // Material
  folder.addColor(GUIcube, 'materialColor');
  folder.add(GUIcube, 'material', ['Basic', 'Phong', 'Lambert']);
  folder.add(GUIcube, 'wireframe');
  folder.add(GUIcube, 'transparent');
  folder.add(GUIcube, 'opacity', 0, 1);

  // Escala
  folder.add(GUIcube, 'scaleX').min(-50).max(50).step(1).listen();
  folder.add(GUIcube, 'scaleY').min(-50).max(50).step(1).listen();
  folder.add(GUIcube, 'scaleZ').min(-50).max(50).step(1).listen();

  // Posicion
  folder.add(GUIcube, 'posX').min(-50).max(50).step(1).listen();
  folder.add(GUIcube, 'posY').min(-50).max(50).step(1).listen();
  folder.add(GUIcube, 'posZ').min(-50).max(50).step(1).listen();

  GUIFolderCube = GUIFolderCube + 1;
}

//Esfera
function updateSphere(){
	Object.keys(objectsSphere).forEach((i) => {
    const sphereSelected = objectsSphere[i];
    //Material esfera
    sphereSelected.GUIsphere.material == 'Basic'
      ? (sphereSelected.material = new THREE.MeshBasicMaterial({
          color: sphereSelected.GUIsphere.materialColor,
          wireframe: sphereSelected.GUIsphere.wireframe,
          transparent: sphereSelected.GUIsphere.transparent,
          opacity: sphereSelected.GUIsphere.opacity,
        }))
      : sphereSelected.GUIsphere.material == 'Lambert'
      ? (sphereSelected.material = new THREE.MeshLambertMaterial({
        color: sphereSelected.GUIsphere.materialColor,
        wireframe: sphereSelected.GUIsphere.wireframe,
        transparent: sphereSelected.GUIsphere.transparent,
        opacity: sphereSelected.GUIsphere.opacity,
          
        }))
      : (sphereSelected.material = new THREE.MeshPhongMaterial({
        color: sphereSelected.GUIsphere.materialColor,
        wireframe: sphereSelected.GUIsphere.wireframe,
        transparent: sphereSelected.GUIsphere.transparent,
        opacity: sphereSelected.GUIsphere.opacity,
        }));

    //Escalar esfera
      sphereSelected.geometry = new THREE.SphereGeometry(
      sphereSelected.GUIsphere.scaleZ,
    );

    //Posición
    sphereSelected.position.x = sphereSelected.GUIsphere.posX;
    sphereSelected.position.y = sphereSelected.GUIsphere.posY;
    sphereSelected.position.z = sphereSelected.GUIsphere.posZ;
  });

}

export function createSphereGeneric() {
  const SphereGeometry = new THREE.SphereGeometry();
  const SphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x4091e0,
    wireframe: true,
  });
  const sphere = new THREE.Mesh(SphereGeometry, SphereMaterial);
  scene.add(sphere);
  objectsSphere.push(sphere);
  sphere.position.y = 1;
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  
  sphere.GUIsphere = sphereObject();
  createSphereGUI(sphere.GUIsphere);

  countSphere = countSphere + 1;
}

function sphereObject() {
  var GUIsphere = {
    material: 'Basic',
    materialColor: 0x4091e0,
    wireframe: false,
    transparent: false,
    opacity: 1,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    posX: 0,
    posY: 1,
    posZ: 0,
  };

  return GUIsphere;
}

function createSphereGUI(GUIsphere) {
  const folder2 = gui.addFolder('Esfera # ' + GUIFolderSphere);
  // Material
  folder2.addColor(GUIsphere, 'materialColor');
  folder2.add(GUIsphere, 'material', ['Basic', 'Phong', 'Lambert']);
  folder2.add(GUIsphere, 'wireframe');
  folder2.add(GUIsphere, 'transparent');
  folder2.add(GUIsphere, 'opacity', 0, 1);

  // Escala
  folder2.add(GUIsphere, 'scaleZ').min(-50).max(50).step(1).listen();

  // Posicion
  folder2.add(GUIsphere, 'posX').min(-50).max(50).step(1).listen();
  folder2.add(GUIsphere, 'posY').min(-50).max(50).step(1).listen();
  folder2.add(GUIsphere, 'posZ').min(-50).max(50).step(1).listen();

  GUIFolderSphere = GUIFolderSphere + 1;
}

//Luces

//SpotLight
export function createSpoLightGeneric() {
  const SpotLight = new THREE.SpotLight(0xA71F8B, 1); 
  SpotLight.position.set(0, 10, 0);
  SpotLight.angle = Math.PI / 4;
  SpotLight.penumbra = 0.1;
  SpotLight.decay = 2;
  SpotLight.distance = 200;
  SpotLight.castShadow = true;


  objectsSpotLight.push(SpotLight)
  scene.add(SpotLight);


 SpotLight.GUISpotLight = SpotLightObject();
 createSpotLightGUI(SpotLight.GUISpotLight);

 countSpotLight = countSpotLight + 1;
}

function SpotLightObject() {
  var GUISpotLight = {
    color: 0xFFFAF0,
    intensity: 1,
    transparent: false,
    opacity: 1,
    castShadow: true,
    posX: 0,
    posY: 10,
    posZ: 0,
    angle: Math.PI / 4,
    penumbra: 0.1,
    decay: 2,
    distance: 200,
    };
  
  return GUISpotLight;
}

function createSpotLightGUI(GUISpotLight) {
    const folder = gui.addFolder('SpotLight ' + GUIFolderSpotLight);
    // Prede
    folder.addColor(GUISpotLight, 'color');
    folder.add(GUISpotLight, 'intensity', 0, 1);
    folder.add(GUISpotLight, 'penumbra', 0, 1);
    folder.add(GUISpotLight, 'decay', 1, 2);
    // Posicion
    folder.add(GUISpotLight, 'posX', -10, Math.PI * 10);
    folder.add(GUISpotLight, 'posY', 0, Math.PI * 2);
    folder.add(GUISpotLight, 'posZ', -6, Math.PI * 2);
    folder.add(GUISpotLight, 'angle', Math.PI / 4, Math.PI / 2);
   
    GUIFolderSpotLight = GUIFolderSpotLight + 1;
}

function updateSpotLights()    {
  Object.keys(objectsSpotLight).forEach((i) => {
   const SpotLightSelected = objectsSpotLight[i];
      
   SpotLightSelected.color.setHex(SpotLightSelected.GUISpotLight.color);
   SpotLightSelected.intensity = SpotLightSelected.GUISpotLight.intensity;
   SpotLightSelected.penumbra = SpotLightSelected.GUISpotLight.penumbra;
   SpotLightSelected.decay = SpotLightSelected.GUISpotLight.decay;
   //Posición
   SpotLightSelected.position.x = SpotLightSelected.GUISpotLight.posX;
   SpotLightSelected.position.y = SpotLightSelected.GUISpotLight.posY;
   SpotLightSelected.position.z = SpotLightSelected.GUISpotLight.posZ;
   SpotLightSelected.angle = SpotLightSelected.GUISpotLight.angle;
 });
}

//Luz Ambiental
export function createAmbientLightGeneric() {
  const AmbientLight = new THREE.AmbientLight(0xA71F8B); 
  scene.add( AmbientLight );

  objectsAmbientLight.push(AmbientLight)

  AmbientLight.GUIAmbientLight = AmbientLightObject();
  createAmbientLightGUI(AmbientLight.GUIAmbientLight);

 countAmbientLight = countAmbientLight + 1;
}

function AmbientLightObject() {
 var GUIAmbientLight = {
  color: 0xFFFAF0,
  intensity: 1,
  };

 return GUIAmbientLight;
}

function createAmbientLightGUI(GUIAmbientLight) {
  const folder = gui.addFolder('AmbientLight ' + GUIFolderAmbientLight);
  // Props
  folder.addColor(GUIAmbientLight, 'color');
  folder.add(GUIAmbientLight, 'intensity', 0, 1);

  GUIFolderAmbientLight = GUIFolderAmbientLight + 1;
}

function updateAmbientLight()    {
 Object.keys(objectsAmbientLight).forEach((i) => {
  const AmbientLightSelected = objectsAmbientLight[i];

  AmbientLightSelected.color.setHex(AmbientLightSelected.GUIAmbientLight.color);
  AmbientLightSelected.intensity = AmbientLightSelected.GUIAmbientLight.intensity;
  
 });
}

//Luz Direccional
export function createDirectLightGeneric() {
  const DirectLight = new THREE.DirectionalLight(0xA71F8B); 
  DirectLight.position.set( 0, 1, 0 );
  DirectLight.castShadow = true;

  objectsDirectLight.push(DirectLight)

 scene.add( DirectLight );
 DirectLight.GUIDirectLight = DirectLightObject();
 createDirectLightGUI(DirectLight.GUIDirectLight);

 countDirectLight = countDirectLight + 1;
}

function DirectLightObject() {
  var GUIDirectLight = {
    color: 0xFFFAF0,
    intensity: 1,
    castShadow: true,
    posX: 0,
    posY: 1,
    posZ: 0,
    };
  
  return GUIDirectLight;
}

function createDirectLightGUI(GUIDirectLight) {
    const folder = gui.addFolder('DirectionalLight ' + GUIFolderDirectLight);
    // Props
    folder.addColor(GUIDirectLight, 'color');
    folder.add(GUIDirectLight, 'intensity', 0, 1);
    // Posicion
    folder.add(GUIDirectLight, 'posX', -6, Math.PI * 2);
    folder.add(GUIDirectLight, 'posY', 0, Math.PI * 2);
    folder.add(GUIDirectLight, 'posZ', -6, Math.PI * 2);
    
    GUIFolderDirectLight = GUIFolderDirectLight + 1;
}

function updateDirectLights()    {
      Object.keys(objectsDirectLight).forEach((i) => {
        const DirectLightSelected = objectsDirectLight[i];
      
        DirectLightSelected.color.setHex(DirectLightSelected.GUIDirectLight.color);
        DirectLightSelected.intensity = DirectLightSelected.GUIDirectLight.intensity;
        

            //Posición
        DirectLightSelected.position.x = DirectLightSelected.GUIDirectLight.posX;
        DirectLightSelected.position.y = DirectLightSelected.GUIDirectLight.posY;
        DirectLightSelected.position.z = DirectLightSelected.GUIDirectLight.posZ;
      });
}

//Point Light
export function createPointLightGeneric() {
  const PointLight = new THREE.PointLight(0xA71F8B, 1, 100 ); 
  PointLight.position.set( 3, 3, 3 );
  scene.add( PointLight );
  objectsPointLight.push(PointLight)
  
  

 PointLight.GUIPointLight = PointLightObject();
 createPointLightGUI(PointLight.GUIPointLight);

 countPointLight = countPointLight + 1;
}

function PointLightObject() {
 var GUIPointLight = {
 color: 0xFFFAF0,
 intensity: 1,
 posX: 3,
 posY: 3,
 posZ: 3,
 decay: 1,
 distance: 0,
  };

 return GUIPointLight;
}

function createPointLightGUI(GUIPointLight) {
  const folder = gui.addFolder('PointLight ' + GUIFolderPointLight);
  // Material
  folder.addColor(GUIPointLight, 'color');
  folder.add(GUIPointLight, 'intensity', 0, 1);
  folder.add(GUIPointLight, 'posX', -6, Math.PI * 2);
  folder.add(GUIPointLight, 'posY', -5, Math.PI * 2);
  folder.add(GUIPointLight, 'posZ', -6, Math.PI * 2);
  folder.add(GUIPointLight, 'decay', 0, 2);
  folder.add(GUIPointLight, 'distance', 0, 1);

  GUIFolderPointLight = GUIFolderPointLight + 1;
}

function updatePointLights()    {
 Object.keys(objectsPointLight).forEach((i) => {
 const PointLightSelected = objectsPointLight[i];

  PointLightSelected.color.setHex(PointLightSelected.GUIPointLight.color);
  PointLightSelected.intensity = PointLightSelected.GUIPointLight.intensity;
  PointLightSelected.position.x = PointLightSelected.GUIPointLight.posX;
  PointLightSelected.position.y = PointLightSelected.GUIPointLight.posY;
  PointLightSelected.position.z = PointLightSelected.GUIPointLight.posZ;
  PointLightSelected.decay = PointLightSelected.GUIPointLight.decay;
  PointLightSelected.distance = PointLightSelected.GUIPointLight.distance;
 
 });
}
//Luz principal
function setupLights() {
  const ambient = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambient);

  spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(0, 20, 0);
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.1;
  spotLight.decay = 2;
  spotLight.distance = 200;

  spotLight.castShadow = false;
  scene.add(spotLight);
}



