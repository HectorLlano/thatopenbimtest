// import three and openbim-components from a CDN called jsdelivr.net
import * as OBC from "https://cdn.jsdelivr.net/npm/openbim-components@1.1.1/+esm"; // "openbim-components"; "https://cdn.jsdelivr.net/npm/openbim-components@1.1.1/+esm";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.157.0/+esm"; // "three"; "https://cdn.jsdelivr.net/npm/three@0.157.0/+esm";

// create viewer and viewer container, a html div
const viewer = new OBC.Components();
const viewerContainer = document.getElementById("container");

// create scene component
const sceneComponent = new OBC.SimpleScene(viewer);

// setting up the scene
viewer.scene = sceneComponent;

// lighting definition and add to the scene
const ambientLight = new THREE.AmbientLight(0xe6e7e4, 1);
const directionalLight = new THREE.DirectionalLight(0xf9f9f9, 0.75);
directionalLight.position.set(10, 50, 10);

const scene = sceneComponent.get();
scene.add(ambientLight, directionalLight);
scene.background = new THREE.Color("#FFFFFF");

// setting up the renderer, camera and raycaster
const rendererComponent = new OBC.PostproductionRenderer(
  viewer,
  viewerContainer
);
viewer.renderer = rendererComponent;

const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer);
viewer.camera = cameraComponent;

const raycasterComponent = new OBC.SimpleRaycaster(viewer);
viewer.raycaster = raycasterComponent;

// init visualizator
viewer.init();
rendererComponent.postproduction.enabled = true;

// add grid elements
const grid = new OBC.SimpleGrid(viewer, new THREE.Color(0x666666));
viewer.tools.add("grid", grid);

const gridMesh = grid.get();
const effects = viewer.renderer.postproduction.customEffects;

effects.excludedMeshes.push(gridMesh);

// add Axes helpers
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// setting up ifcLoader, highlighter and properties processor
const ifcLoader = new OBC.FragmentIfcLoader(viewer);
const highlighter = new OBC.FragmentHighlighter(viewer);
const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer);
highlighter.setup();

// on IFC load, execute propertiesProcessor and wait for highlighter to pass element ID
ifcLoader.onIfcLoaded.add(async (model) => {
  propertiesProcessor.process(model);
  await highlighter.update();
  highlighter.events.select.onHighlight.add((selection) => {
    const fragmentID = Object.keys(selection)[0];
    const expressID = Number([...selection[fragmentID]][0]);
    propertiesProcessor.renderProperties(model, expressID);
  });
});

// creating main toolbar, adding buttons and displaying toolbar in viewer
const mainToolbar = new OBC.Toolbar(viewer);
mainToolbar.addChild(
  ifcLoader.uiElement.get("main"),
  propertiesProcessor.uiElement.get("main")
);
viewer.ui.addToolbar(mainToolbar);
