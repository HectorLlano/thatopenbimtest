// importamos Stats, three y openbim-components

import Stats from 'https://unpkg.com/stats-js@1.0.1/src/Stats.js';
import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';
import * as OBC from '/JS/openbim-components.js';

// seleccionamos el container dentro del código html

const container = document.getElementById('container');

// para cada aplicación necesitaremos al menos 4 cosas para hacerlo funcionar: una escena (scene), un renderizador (renderer), una cámara (camera) y un raycaster
// todo esto lo definimos dentro de un único componente, en este caso llamado components (new OBC.Components())

const components = new OBC.Components();
components.scene = new OBC.SimpleScene(components);
components.renderer = new OBC.SimpleRenderer(components, container);
components.camera = new OBC.SimpleCamera(components);
components.raycaster = new OBC.SimpleRaycaster(components);

// una vez configurado todo, simplemente iniciamos la aplicación (método init())

components.init();

// referenciamos la escena que está actualmente configurada

const scene = components.scene.get();

// localizamos la cámara inicial y hacia donde estará mirando:

components.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

// añadimos una grid 2D

	const grid = new OBC.SimpleGrid(components);
	components.tools.add("grid", grid);

// creamos una geometría simple usando three.js

  const boxMaterial = new THREE.MeshStandardMaterial({ color: '#6528D7' });
  const boxGeometry = new THREE.BoxGeometry(3, 3, 3);
	const cube = new THREE.Mesh(boxGeometry, boxMaterial);
	cube.position.set(0, 1.5, 0);
	scene.add(cube);

// y por último iluminamos la escena:

components.scene.setup();

// creamos un elemento que mide la cantidad de memoria usada usando STATS

const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = '0px';
components.renderer.onBeforeUpdate.add(() => stats.begin());
components.renderer.onAfterUpdate.add(() => stats.end());