import * as THREE from "https://cdn.jsdelivr.net/npm/three@v0.108.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@v0.108.0/examples/jsm/controls/OrbitControls.js";

// scene
let scene = new THREE.Scene();

// camera
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
let multiplier = 200;
let camera = new THREE.OrthographicCamera(canvasWidth/-multiplier, canvasWidth/multiplier, canvasHeight/multiplier, canvasHeight/-multiplier, 0.254, 50);

// renderer
let renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x444444, 1);
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

// controls
let controls = new OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.mouseButtons = {
	RIGHT: THREE.MOUSE.ROTATE
}

// THINGS TO ADD TO SCENE

// lights
let light = new THREE.PointLight( 0xffffff, 10, 100 );
light.position.set( 50, 50, 50 );
scene.add( light );

light = new THREE.PointLight( 0xffffff, 10, 100 );
light.position.set( -50, -50, -50 );
scene.add( light );

// textures & materials
const loadManager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader( loadManager );

let faces = {
	black: new THREE.MeshPhongMaterial({map: loader.load( "resources/textures_black.png" )}),
	blue: new THREE.MeshPhongMaterial({map: loader.load( "resources/textures_blue.png" )}),
	green: new THREE.MeshPhongMaterial({map: loader.load( "resources/textures_green.png" )}),
	orange: new THREE.MeshPhongMaterial({map: loader.load( "resources/textures_orange.png" )}),
	red: new THREE.MeshPhongMaterial({map: loader.load( "resources/textures_red.png" )}),
	white: new THREE.MeshPhongMaterial({map: loader.load( "resources/textures_white.png" )}),
	yellow: new THREE.MeshPhongMaterial({map: loader.load( "resources/textures_yellow.png" )})
}

Object.keys(faces).forEach(mat => {
	faces[mat].map.anisotropy = 16;
	faces[mat].shininess = 100;
});

// grid positions
let xPos = [...Array(3).keys()]; // [0,1,2]
let yPos = [...Array(3).keys()];
let zPos = [...Array(3).keys()];

// map faces to indices
let xNegColor = [faces.green, faces.black, faces.black];
let xPosColor = [faces.black, faces.black, faces.blue];
let yNegColor = [faces.orange, faces.black, faces.black];
let yPosColor = [faces.black, faces.black, faces.red];
let zNegColor = [faces.white, faces.black, faces.black];
let zPosColor = [faces.black, faces.black, faces.yellow];

// geometry
let cubes = [];
let geometry = new THREE.BoxGeometry();

// generate mesh and add to scene
loadManager.onLoad = () => {
	xPos.forEach(i => {
		yPos.forEach(j => {
			zPos.forEach(k => {
				// set face def
				let matArray = [
					xPosColor[i],
					xNegColor[i],
					yPosColor[j],
					yNegColor[j],
					zPosColor[k],
					zNegColor[k]
				]

				let index = i*9+j*3+k;
				let mesh = new THREE.Mesh( geometry, matArray );
				let cube = { // will be class objects
					mesh: mesh,
					material: faces.blue, //default,
					xPos: 1.05*(i-1),
					yPos: 1.05*(j-1),
					zPos: 1.05*(k-1),
					index: index
				}
				cube.mesh.translateX(cube.xPos);
				cube.mesh.translateY(cube.yPos);
				cube.mesh.translateZ(cube.zPos);
				console.log(cube);
				scene.add( cube.mesh );
			})
		})
	})
}


// RENDER AND ANIMATE

camera.position.z = 5;
camera.position.x = 5;
camera.position.y = 2;

controls.update();

// animate
function animate() {
	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );
}

// action!
animate();
