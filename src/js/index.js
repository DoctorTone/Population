import $ from "jquery";
import * as THREE from "three";

import { APPCONFIG } from "./appConfig";

import { BaseApp } from "./baseApp";

import populationData from "../../data/populationData.json";

class Framework extends BaseApp {
    constructor() {
        super();
    }

    setContainer(container) {
        this.container = container;
    }

    init(container) {
        this.container = container;
        super.init(container);
    }

    createScene() {
        // Init base createsScene
        super.createScene();
        // Create root object.
        this.root = new THREE.Object3D();
        this.addToScene(this.root);

        // Map texture
        let textureLoader = new THREE.TextureLoader();
        let mapTexture1 = textureLoader.load("./textures/ukMap.jpg");
        
        // Add base for map
        const planeGeom = new THREE.PlaneBufferGeometry(APPCONFIG.BASE_WIDTH, APPCONFIG.BASE_HEIGHT, APPCONFIG.SEGMENTS, APPCONFIG.SEGMENTS);
        //const boxGeom = new THREE.BoxBufferGeometry(APPCONFIG.BASE_WIDTH, APPCONFIG.BASE_HEIGHT, APPCONFIG.BASE_HEIGHT, APPCONFIG.SEGMENTS, APPCONFIG.SEGMENTS);
        const planeMat = new THREE.MeshLambertMaterial( {map: mapTexture1} );
        const planeMesh = new THREE.Mesh(planeGeom, planeMat);
        planeMesh.rotation.x = -Math.PI/2;
        this.root.add(planeMesh);

        // Add population data
        const boxGeom = new THREE.BoxBufferGeometry(APPCONFIG.COLUMN_WIDTH, APPCONFIG.COLUMN_HEIGHT, APPCONFIG.COLUMN_DEPTH, APPCONFIG.COLUMN_SEGMENTS, APPCONFIG.COLUMN_SEGMENTS);
        const boxMat = new THREE.MeshLambertMaterial( {color: APPCONFIG.ENGLAND_COLOUR} );
        const boxMesh = new THREE.Mesh(boxGeom, boxMat);
        boxMesh.position.set(APPCONFIG.ENGLAND_POS.x, APPCONFIG.ENGLAND_POS.y, APPCONFIG.ENGLAND_POS.z);
        let scale = 1;
        boxMesh.position.y += (scale/2);
        this.root.add(boxMesh);
    }
}

$(document).ready( () => {
    
    const container = document.getElementById("WebGL-Output");
    const app = new Framework();

    app.init(container);
    app.createScene();

    app.run();
});
