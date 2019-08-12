import $ from "jquery";
import * as THREE from "three";

import { BaseApp } from "./baseApp";

class Framework extends BaseApp {
    constructor() {
        super();
    }

    setContainer(container) {
        this.container = container;
    }

    init(container) {
        super.init(container);
    }

    createScene() {
        // Init base createsScene
        super.createScene();
        // Create root object.
        this.root = new THREE.Object3D();
        this.addToScene(this.root);

        // Add simple 3D object
        const boxGeom = new THREE.BoxBufferGeometry(10, 10, 10);
        const boxMat = new THREE.MeshLambertMaterial( {color: 0xff0000});
        const boxMesh = new THREE.Mesh(boxGeom, boxMat);
        this.root.add(boxMesh);
    }
}

$(document).ready( () => {
    
    const container = document.getElementById("WebGL-Output");
    const app = new Framework();
    app.setContainer(container);

    app.init(container);
    app.createScene();

    app.run();
});
