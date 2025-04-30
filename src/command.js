import Grid from "./grid.js";
import Input, { MOUSE_STATE } from "./input.js";
import CompFactory from "./comp-factory.js";
import Rectangle from "./shape.js";
import { SHAPE_TYPE } from "./component.js";

// Drawing Constants
const BKGD_COLOR = "#000000";
const DLFT_RES = 30;

const GAMESTATE = {
    DRAWING: 0,
    DESIGNING: 1,
};

export default class Command{
    constructor(screenDim, canvas, ctx){
        this.screenDim = screenDim;
        
        this.resolution = DLFT_RES; // # of pixels per cell
        this.position = {x: 0, y: 0};
        this.drawingPosition = {x: 0, y: 0};

        this.gamestate = GAMESTATE.DRAWING;
        this.C_GAMESTATE = GAMESTATE;
        
        this.canvas = canvas;
        this.ctx = ctx;

        this.newCompFactory = null;
        this.newComponentObj = null;
        this.selectedObj = null;
        
        //objects
        this.grid = new Grid(this);
        this.input = new Input(this);
        this.components = [];
        this.compFactories = [];
        this.boundaries = [];
        this.boundaries.push(new Rectangle({x: 1, y: -7}, {w: 21, h: 15}, "#ffffff"));
        this.boundaries.push(new Rectangle({x: -22, y: -7}, {w: 21, h: 15}, "#ffffff"));
    }
    //
    init(){
        this.grid.draw();
        this.input.createListeners();
        //
        this.boundaries.forEach(b => b.draw(this));
    }

    redrawAll(){
        this.ctx.clearRect(0, 0, this.screenDim.w, this.screenDim.h);
        this.grid.draw();
        //
        if(this.gamestate == GAMESTATE.DRAWING){
            this.boundaries.forEach(b => b.draw(this));
            //
            this.components.forEach(c => c.draw(this));
        }else if(this.gamestate == GAMESTATE.DESIGNING){
            this.newCompFactory.shapes.forEach(b => b.draw(this));
        }
        //
        if(this.selectedObj != null) this.selectedObj.draw(this, 5);
    }

    setState(state){
        if (this.gamestate == state) return;
        this.gamestate = state;
        this.selectedObj = null;
        //
        let toolbars = document.getElementsByClassName("toolbar");
        let trays = document.getElementsByClassName("tray");
        //
        switch(state){
            case GAMESTATE.DRAWING:
                if(this.newCompFactory != null){
                    let component_name = prompt("Name the component:");
                    this.newCompFactory.addToTray(component_name);
                    this.compFactories.push(this.newCompFactory);
                    this.newCompFactory = null;
                }
                //
                this.position.x = this.drawingPosition.x;
                this.position.y = this.drawingPosition.y;
                //
                this.switchDiv(toolbars, "draw-toolbar", "block");
                this.switchDiv(trays, "draw-tray", "flex");
                this.redrawAll();
                break;
                
            case GAMESTATE.DESIGNING:
                this.drawingPosition.x = this.position.x;
                this.drawingPosition.y = this.position.y;
                this.position.x = 0;
                this.position.y = 0;
                //
                this.newCompFactory = new CompFactory(this);
                //
                this.switchDiv(toolbars, "design-toolbar", "block");
                this.switchDiv(trays, "none", "flex");
                this.redrawAll();
                break;

            default:
                console.error("faulty gamestate set");
        }
    }

    switchDiv(divs, id, display){
        //
        for(var i = 0; i < divs.length; i++){
            if(divs[i].id == id){
                divs[i].style.display = display;
            }else{
                divs[i].style.display = "none";
            }
        }
    }

    newComponent(component){
        this.input.mouseState = MOUSE_STATE.COMP_PLACING;
    }
}