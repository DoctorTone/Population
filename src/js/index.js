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
        // Set up geometry for each country
        let boxMat;
        let boxMesh;
        let countryColumns = [];
        for (let i=0; i<APPCONFIG.NUM_COUNTRIES; ++i) {
            boxMat = new THREE.MeshLambertMaterial( {color: APPCONFIG.COUNTRY_COLOURS[i]} );
            boxMesh = new THREE.Mesh(boxGeom, boxMat);
            boxMesh.position.copy(APPCONFIG.COUNTRY_POS[i]);
            countryColumns.push(boxMesh);
            this.root.add(boxMesh);
        }
        
        // Get first year
        /*
        let year = populationData[0];
        let englandScale = year[1]/APPCONFIG.MILLION * 5;
        boxMesh.scale.set(1, englandScale, 1);
        boxMesh.position.y += (englandScale/2);
        this.root.add(boxMesh);
        */
    }
}

$(document).ready( () => {
    
    const container = document.getElementById("WebGL-Output");
    const app = new Framework();

    app.init(container);
    app.createScene();

    app.run();
});
