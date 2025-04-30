import { SHAPE_TYPE } from "./component";
import Rectangle from "./shape";

export const MOUSE_STATE = {
    DFLT_READY: 0,
    GRID_MOVING: 1,
    WIRE_DRAWING: 2,
    SHAPE_READY: 3,
    SHAPE_DRAWING: 4,
    PIN_READY: 5,
    SELECTED: 6,
    COMP_PLACING: 7,
    COMP_MOVING: 8
};

export default class Input {
    constructor(comm) {
        this.lastMousePos = { x: 0, y: 0 };
        this.shapeMoveStart = { x: 0, y: 0 };
        //
        this.mouseState = MOUSE_STATE.DFLT_READY;
        this.currentShape = SHAPE_TYPE.RECTANGLE;
        //
        this.comm = comm;
    }
    //
    createListeners() {
        let self = this;
        //
        //window events
        window.addEventListener("resize", (e) => {
            this.resize();
        });
        //
        //mouse events
        document.getElementById("canvas").addEventListener("mousedown", (e) => {
            self.mousedown(e);
        });
        //
        document.addEventListener("mousemove", (e) => {
            self.mousemove(e);
        });
        //
        document.addEventListener("mouseup", (e) => {
            self.mouseup(e);
        });
        //
        window.addEventListener("wheel", (e) => {
            self.scroll(e);
        }, false);
        //
        //button events
        document.getElementById("design-tool").addEventListener("click", (e) => {
            self.newComponent();
        });
        //
        document.getElementById("finish-tool").addEventListener("click", (e) => {
            self.finishComponent();
        });
        //
        document.getElementById("cancel-tool").addEventListener("click", (e) => {
            self.cancelComponent();
        });
        //
        document.getElementById("rectangle-tool").addEventListener("click", (e) => {
            self.shapeButton(self.currentShape == SHAPE_TYPE.RECTANGLE ? -1 : SHAPE_TYPE.RECTANGLE);
        });
        //
        document.getElementById("circle-tool").addEventListener("click", (e) => {
            self.shapeButton(self.currentShape == SHAPE_TYPE.CIRCLE ? -1 : SHAPE_TYPE.CIRCLE);
        });
        //
        document.getElementById("pin-tool").addEventListener("click", (e) => {
            self.shapeButton(self.currentShape == SHAPE_TYPE.PIN ? -1 : SHAPE_TYPE.PIN);
            self.mouseState = MOUSE_STATE.PIN_READY;
        });
        //
        //selections
        document.getElementById("color-tray-tool").addEventListener("change", (e) => {
            self.setShapeColor(e.target.value);
        });
        //
        //keys
        document.addEventListener("keypress", (e) => {
            self.handleKeyPress(e);
        });
    }
    //
    resize() {
        //
    }
    //
    mousedown(e) {
        console.log(this.mouseState);
        switch (this.mouseState) {
            case MOUSE_STATE.DFLT_READY:
                let clicking_component = -1;
                if (this.comm.gamestate == this.comm.C_GAMESTATE.DRAWING) {
                    for (var i = 0; i < this.comm.components.length; i++) {
                        if (this.comm.components[i].checkCollision(e.clientX, e.clientY)) {
                            clicking_component = i;
                            this.comm.selectedObj = this.comm.components[i];
                            this.comm.redrawAll();
                            break;
                        }
                    }
                    //
                    if (clicking_component == -1) {
                        this.mouseState = MOUSE_STATE.GRID_MOVING;
                    }
                } else if (this.comm.gamestate == this.comm.C_GAMESTATE.DESIGNING) {
                    this.mouseState = MOUSE_STATE.GRID_MOVING;
                    for (var i = 0; i < this.comm.newCompFactory.shapes.length; i++) {
                        if (this.comm.newCompFactory.shapes[i].checkCollision(this.comm, e.clientX, e.clientY)) {
                            this.comm.selectedObj = this.comm.newCompFactory.shapes[i];
                            this.mouseState = MOUSE_STATE.COMP_MOVING;
                            this.comm.redrawAll();
                            //
                            document.getElementById("design-tray").style.display = "flex";
                            document.getElementById("color-tray-tool").value = "white";
                            //
                            this.shapeMoveStart.x = this.comm.selectedObj.position.x;
                            this.shapeMoveStart.y = this.comm.selectedObj.position.y;
                            break;
                        }
                    }
                }
                //
                this.lastMousePos.x = e.clientX;
                this.lastMousePos.y = e.clientY;
                //
                break;
            case MOUSE_STATE.SHAPE_READY:
                this.mouseState = MOUSE_STATE.SHAPE_DRAWING;
                //
                this.lastMousePos.x = e.clientX;
                this.lastMousePos.y = e.clientY;
                //
                let cx = Math.floor(2 * (e.clientX - this.comm.position.x - this.comm.screenDim.w / 2) / this.comm.resolution) / 2;
                let cy = Math.floor(2 * (e.clientY - this.comm.position.y - this.comm.screenDim.h / 2) / this.comm.resolution) / 2;
                //
                if (this.currentShape == SHAPE_TYPE.RECTANGLE) {
                    this.comm.newCompFactory.shapes.push(new Rectangle({ x: cx, y: cy }, { w: 0, h: 0 }, "#ffffff"));
                }
                break;
        }
    }
    //
    mousemove(e) {
        switch (this.mouseState) {
            case MOUSE_STATE.DFLT_READY:
                if (this.comm.gamestate == this.comm.C_GAMESTATE.DESIGNING) {
                    this.comm.redrawAll();
                    this.comm.canvas.style.cursor = 'default';
                    for (var i = 0; i < this.comm.newCompFactory.shapes.length; i++) {
                        if (this.comm.newCompFactory.shapes[i].checkCollision(this.comm, e.clientX, e.clientY)) {
                            this.comm.newCompFactory.shapes[i].draw(this.comm, 2);
                            this.comm.canvas.style.cursor = 'pointer';
                            break;
                        }
                    }
                }
                //
                break;
            case MOUSE_STATE.GRID_MOVING:
                this.comm.position.x += (e.clientX - this.lastMousePos.x);
                this.comm.position.y += (e.clientY - this.lastMousePos.y);
                //
                this.lastMousePos.x = e.clientX;
                this.lastMousePos.y = e.clientY;
                //
                this.comm.redrawAll();
                //
                break;
            case MOUSE_STATE.SHAPE_READY:
                this.comm.redrawAll();
                //
                this.comm.ctx.strokeStyle = "#ffffff";
                //
                this.comm.ctx.beginPath();
                this.comm.ctx.rect(e.clientX - 30, e.clientY - 20, 20, 10);
                this.comm.ctx.stroke();
                //
                break;
            case MOUSE_STATE.SHAPE_DRAWING:
                //
                let shapes = this.comm.newCompFactory.shapes;
                shapes[shapes.length - 1].dims.w = Math.round((e.clientX - this.lastMousePos.x) / this.comm.resolution);
                shapes[shapes.length - 1].dims.h = Math.round((e.clientY - this.lastMousePos.y) / this.comm.resolution);
                //
                this.updateShapeText();
                this.comm.redrawAll();
                //
                break;
            case MOUSE_STATE.COMP_PLACING:
                //
                this.comm.selectedObj.position.x = Math.round((e.clientX - this.comm.screenDim.w / 2 - this.comm.position.x) / this.comm.resolution);
                this.comm.selectedObj.position.y = Math.round((e.clientY - this.comm.screenDim.h / 2 - this.comm.position.y) / this.comm.resolution);
                //
                this.comm.redrawAll();
                //
                break;
            case MOUSE_STATE.COMP_MOVING:
                let deltaX = Math.round(2 * (e.clientX - this.lastMousePos.x) / this.comm.resolution) / 2;
                let deltaY = Math.round(2 * (e.clientY - this.lastMousePos.y) / this.comm.resolution) / 2;
                //
                this.comm.selectedObj.position.x = this.shapeMoveStart.x + deltaX;
                this.comm.selectedObj.position.y = this.shapeMoveStart.y + deltaY;
                //
                this.updateShapeText();
                this.comm.redrawAll();
                //
                break;
        }
    }
    //
    mouseup(e) {
        switch (this.mouseState) {
            case MOUSE_STATE.GRID_MOVING:
                this.mouseState = MOUSE_STATE.DFLT_READY;
                if(this.comm.selectedObj != null && e.clientX == this.lastMousePos.x || e.clientY == this.lastMousePos.y){
                    this.comm.selectedObj = null;
                    this.comm.redrawAll();
                }
                break;
            case MOUSE_STATE.COMP_MOVING:
                this.mouseState = MOUSE_STATE.DFLT_READY;
                break;
            case MOUSE_STATE.SHAPE_DRAWING:
                if(e.clientX == this.lastMousePos.x && e.clientY == this.lastMousePos.y){
                    this.comm.newCompFactory.shapes.pop();
                    this.shapeButton(-1);
                    break;
                }
                this.mouseState = MOUSE_STATE.SHAPE_READY;
                let shapes = this.comm.newCompFactory.shapes;
                shapes[shapes.length - 1].removeNegatives();
                this.updateShapeText();
                break;
            case MOUSE_STATE.COMP_PLACING:
                this.mouseState = MOUSE_STATE.DFLT_READY;
                this.comm.selectedObj = null;
                this.comm.redrawAll();
        }
    }
    //
    scroll(e) {
        this.comm.resolution += e.wheelDeltaY * this.comm.resolution / 1000;
        this.comm.redrawAll();
    }
    //
    newComponent() {
        this.comm.setState(this.comm.C_GAMESTATE.DESIGNING);
        this.mouseState = MOUSE_STATE.SHAPE_READY;
        this.shapeButton(SHAPE_TYPE.RECTANGLE);
    }
    //
    finishComponent() {
        this.comm.setState(this.comm.C_GAMESTATE.DRAWING);
        this.mouseState = MOUSE_STATE.DFLT_READY;
    }
    //
    cancelComponent() {
        this.comm.newCompFactory = null;
        this.comm.setState(this.comm.C_GAMESTATE.DRAWING);
        this.mouseState = MOUSE_STATE.DFLT_READY;
    }
    //
    shapeButton(type) {
        this.currentShape = type;
        //
        let designToolbar = document.getElementById("design-toolbar");
        let designTools = designToolbar.getElementsByClassName("tool");
        //
        var i;
        for (i = 0; i < designTools.length; i++) {
            if (designTools[i].getAttribute("shape") == type.toString()) {
                designTools[i].getElementsByTagName("p")[0].style.color = "#ffffff";
            } else {
                designTools[i].getElementsByTagName("p")[0].style.color = "gray";
            }
        }
        //
        console.log(type);
        if (type == -1) {
            this.mouseState = MOUSE_STATE.DFLT_READY;
            this.comm.redrawAll();
        } else {
            this.mouseState = MOUSE_STATE.SHAPE_READY;
        }
    }
    //
    updateShapeText(){
        let dimsText = document.getElementById("shape-dims");
        let dimsCoords = document.getElementById("shape-coords");
        //
        if(this.mouseState == MOUSE_STATE.SHAPE_DRAWING || this.mouseState == MOUSE_STATE.COMP_MOVING){
            let shapes = this.comm.newCompFactory.shapes;
            let shapes_len = shapes.length - 1;
            dimsText.innerText = `(${shapes[shapes_len].dims.w + 1}, ${shapes[shapes_len].dims.h + 1})`;
            dimsCoords.innerText = `(${shapes[shapes_len].position.x + (shapes[shapes_len].dims.w / 2)}, ${shapes[shapes_len].position.y + (shapes[shapes_len].dims.h / 2)})`;
        }else{
            dimsText.innerText = ``;
            dimsCoords.innerHTML = ``;
        }
    }
    //
    setShapeColor(color){
        if(this.comm.selectedObj != null){
            this.comm.selectedObj.color = color;
        }
        //
        this.comm.redrawAll();
    }
    //
    handleKeyPress(e){
        if(e.key > "0" && e.key <= "9"){
            let idx = parseInt(e.key) - 1;
            if(idx < this.comm.compFactories.length){
                this.comm.compFactories[idx].createComponent();1
            }
        }
        //
        switch(e.key){
            case "r":
                if(this.comm.selectedObj != null){
                    this.comm.selectedObj.rotate();
                    this.comm.redrawAll();
                }
                break;
        }
    }
}