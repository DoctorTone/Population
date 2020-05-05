import $ from "jquery";
import * as THREE from "three";
import { APPCONFIG } from "./appConfig";
import { BaseApp } from "./baseApp";
import { LabelManager } from "./LabelManager";
import populationData from "../../data/populationData.json";
import bootstrap from "bootstrap";

class Framework extends BaseApp {
    constructor() {
        super();
        this.currentYear = 0;
        this.playing = false;
        this.completed = false;
        this.displayYear = 1971;
        this.labelManager = new LabelManager();
        this.cameraRotate = false;
        this.rotSpeed = Math.PI/20;
        this.rotDirection = 1;
        this.zoomingIn = false;
        this.zoomingOut = false;
        this.zoomSpeed = APPCONFIG.ZOOM_SPEED;

        //Temp variables
        this.tempVec = new THREE.Vector3();
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
        let mapTexture1 = textureLoader.load("./textures/ukMap.png");
        
        // Add base for map
        const planeGeom = new THREE.PlaneBufferGeometry(APPCONFIG.BASE_WIDTH, APPCONFIG.BASE_HEIGHT, APPCONFIG.SEGMENTS, APPCONFIG.SEGMENTS);
        //const boxGeom = new THREE.BoxBufferGeometry(APPCONFIG.BASE_WIDTH, APPCONFIG.BASE_HEIGHT, APPCONFIG.BASE_HEIGHT, APPCONFIG.SEGMENTS, APPCONFIG.SEGMENTS);
        const planeMat = new THREE.MeshLambertMaterial( {map: mapTexture1, transparent: true} );
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
        
        this.countryColumns = countryColumns;

        // Get population differences
        let populationDiff = [];
        let yearlyDiff = [];
        let yearOne = populationData[0];
        let currentYear;
        let diff;
        for (let year=1; year<APPCONFIG.TIME_SPAN; ++year) {
            currentYear = populationData[year];
            for (let i=0; i<APPCONFIG.NUM_COUNTRIES; ++i) {
                diff = currentYear[i+1] - yearOne[i+1];
                yearlyDiff.push(diff);
            }
            populationDiff.push([...yearlyDiff]);
            yearlyDiff.length = 0;
        }
        
        this.populationDiff = populationDiff;

        // Add labels
        // Label properties
        let label;
        let populationLabels = [];
        let labelProperty = {};
        labelProperty.position = new THREE.Vector3();
        for (let i=0; i<APPCONFIG.NUM_COUNTRIES; ++i) {
            labelProperty.position.copy(countryColumns[i].position);
            labelProperty.position.y += APPCONFIG.VALUE_OFFSET;
            labelProperty.visibility = true;
            labelProperty.scale = APPCONFIG.VALUE_SCALE;
            label = this.labelManager.create("valueLabel", "00000", labelProperty);
            this.root.add(label.getSprite());
            populationLabels.push(label);
        }
        this.populationLabels = populationLabels;
    }

    update() {
        let delta = this.clock.getDelta();
        if (this.playing) {
            this.elapsedTime += delta;
            if (this.elapsedTime >= APPCONFIG.UPDATE_INTERVAL) {
                this.elapsedTime = 0;
                // Get next year's data
                if(this.currentYear < (APPCONFIG.TIME_SPAN-1)) {
                    let year = this.populationDiff[this.currentYear];
                    let countryScale;
                    for (let i=0; i<APPCONFIG.NUM_COUNTRIES; ++i) {
                        countryScale = year[i]/100000;
                        countryScale *= APPCONFIG.SCALE_FACTOR;
                        this.countryColumns[i].scale.set(1, countryScale, 1);
                        this.countryColumns[i].position.y = countryScale*APPCONFIG.COLUMN_HEIGHT/2;
                        // Labels
                        this.populationLabels[i].setHeight((countryScale*APPCONFIG.COLUMN_HEIGHT) + APPCONFIG.VALUE_OFFSET);
                        this.populationLabels[i].setText(year[i]);
                    }
                    ++this.currentYear;
                    let displayYear = this.displayYear + this.currentYear;
                    $(".year").html(displayYear);
                    // Population values for all countries
                    $("#england").html(year[0]);
                    $("#scotland").html(year[3]);
                    $("#wales").html(year[1]);
                    $("#ireland").html(year[2]);
                } else {
                    this.resetAnimation();
                }
            }
        }

        if (this.cameraRotate) {
            this.root.rotation[this.rotAxis] += (this.rotSpeed * this.rotDirection * delta);
        }

        if(this.zoomingIn) {
            this.tempVec.copy(this.camera.position);
            this.tempVec.multiplyScalar(this.zoomSpeed * delta);
            this.root.position.add(this.tempVec);
            //DEBUG
            //console.log("Root = ", this.root.position);
        }

        if(this.zoomingOut) {
            this.tempVec.copy(this.camera.position);
            this.tempVec.multiplyScalar(this.zoomSpeed * delta);
            this.root.position.sub(this.tempVec);
            //DEBUG
            //console.log("Root = ", this.root.position);
        }

        super.update();
    }

    toggleAnimation() {
        this.playing = !this.playing;
        let elem = $('#play');
        elem.attr("src", this.playing ? "images/pause-button.png" : "images/play-button.png");
    }

    resetAnimation() {
        this.playing = false;
        this.completed = true;
        let elem = $('#play');
        elem.attr("src", "images/play-button.png");
        this.currentYear = 0;
    }

    rotateCamera(status, direction) {
        switch (direction) {
            case APPCONFIG.RIGHT:
                this.rotDirection = 1;
                this.rotAxis = `y`;
                break;

            case APPCONFIG.LEFT:
                this.rotDirection = -1;
                this.rotAxis = `y`;
                break;

            case APPCONFIG.UP:
                this.rotDirection = 1;
                this.rotAxis = `x`;
                break;

            case APPCONFIG.DOWN:
                this.rotDirection = -1;
                this.rotAxis = `x`;
                break;

            default:
                break;
        };
         
        this.cameraRotate = status;
    }

    zoomIn(status) {
        this.zoomingIn = status;
    }

    zoomOut(status) {
        this.zoomingOut = status;
    }

    resetView() {
        this.controls.reset();
        this.camera.position.copy(SceneConfig.CameraPos);
        this.controls.target.copy(SceneConfig.LookAtPos);
    }
}

$(document).ready( () => {
    
    const container = document.getElementById("WebGL-Output");
    const app = new Framework();

    app.init(container);
    app.createScene();

    app.run();

    // Elements
    let play = $("#play");
    let rotateLeft = $("#rotateLeft");
    let rotateRight = $("#rotateRight");
    let rotateUp = $("#rotateUp");
    let rotateDown = $("#rotateDown");
    let zoomIn = $("#zoomIn");
    let zoomOut = $("#zoomOut");
    let resetCamera = $("#resetCamera");

    // Play controls
    play.on("click", () => {
        app.toggleAnimation();
    });

    // Mouse interaction
    rotateLeft.on("mousedown", () => {
        app.rotateCamera(true, APPCONFIG.LEFT);
    });

    rotateLeft.on("mouseup", () => {
        app.rotateCamera(false);
    });

    rotateRight.on("mousedown", () => {
        app.rotateCamera(true, APPCONFIG.RIGHT);
    });

    rotateRight.on("mouseup", () => {
        app.rotateCamera(false);
    });

    rotateUp.on("mousedown", () => {
        app.rotateCamera(true, APPCONFIG.UP);
    });

    rotateUp.on("mouseup", () => {
        app.rotateCamera(false);
    });

    rotateDown.on("mousedown", () => {
        app.rotateCamera(true, APPCONFIG.DOWN);
    });

    rotateDown.on("mouseup", () => {
        app.rotateCamera(false);
    });

    zoomIn.on("mousedown", () => {
        app.zoomIn(true);
    });

    zoomIn.on("mouseup", () => {
        app.zoomIn(false);
    });

    zoomOut.on("mousedown", () => {
        app.zoomOut(true);
    });

    zoomOut.on("mouseup", () => {
        app.zoomOut(false);
    });

    // Touch interaction
    rotateLeft.on("touchstart", () => {
        app.rotateCamera(true, APPCONFIG.LEFT);
    });

    rotateLeft.on("touchend", () => {
        app.rotateCamera(false);
    });

    rotateRight.on("touchstart", () => {
        app.rotateCamera(true, APPCONFIG.RIGHT);
    });

    rotateRight.on("touchend", () => {
        app.rotateCamera(false);
    });

    rotateUp.on("touchstart", () => {
        app.rotateCamera(true, APPCONFIG.UP);
    });

    rotateUp.on("touchend", () => {
        app.rotateCamera(false);
    });

    rotateDown.on("touchstart", () => {
        app.rotateCamera(true, APPCONFIG.DOWN);
    });

    rotateDown.on("touchend", () => {
        app.rotateCamera(false);
    });

    zoomIn.on("touchstart", () => {
        app.zoomIn(true);
    });

    zoomIn.on("touchend", () => {
        app.zoomIn(false);
    });

    zoomOut.on("touchstart", () => {
        app.zoomOut(true);
    });

    zoomOut.on("touchend", () => {
        app.zoomOut(false);
    });
    
    resetCamera.on("click", () => {
        app.resetView();
    });

    $("#instructions").on("click", () => {
        $("#infoModal").modal();
    });
});
