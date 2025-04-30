import Component from "./component.js";
import { MOUSE_STATE } from "./input.js";

export default class CompFactory{
    constructor(comm){
        this.shapes = [];
        this.pins = [];
        //
        this.comm = comm;
    }
    //
    addToTray(name){
        this.name = name;
        let tray = document.getElementById("draw-tray");
        tray.innerHTML = 
            `<div id="${this.name}-comp" class="tray-tool">
                <p>${this.name}</p>
            </div>
            ${tray.innerHTML}`;
        //
        let newButton = document.getElementById(`${this.name}-comp`);
        //
        let self = this;
        newButton.addEventListener("click", (e) => {
            self.createComponent();
        });
    }
    //
    createComponent(){
        this.comm.selectedObj = new Component(this);
        this.comm.components.push(this.comm.selectedObj);
        this.comm.input.mouseState = MOUSE_STATE.COMP_PLACING;
        this.comm.redrawAll();
    }
}