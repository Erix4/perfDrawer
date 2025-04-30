// Drawing Constants
const DOT_SIZE = 1;
const DOT_COLOR = "#bbbbbb";
const AXIS_COLOR = "#660000";

export default class Grid{
    constructor(comm){
        this.coordsText = document.getElementById("coords");
        //
        this.position = comm.position;
        this.screenDim = comm.screenDim;

        this.comm = comm;
    }

    draw(){
        let ctx = this.comm.ctx;
        ctx.fillStyle = DOT_COLOR;
        //
        let cellSize = {
            w: Math.ceil(this.screenDim.w / this.comm.resolution),
            h: Math.ceil(this.screenDim.h / this.comm.resolution)
        };
        let firstDotPos = {
            x: this.position.x % this.comm.resolution
                + (this.screenDim.w / 2 % this.comm.resolution),
            y: this.position.y % this.comm.resolution
                + (this.screenDim.h / 2 % this.comm.resolution)
        }
        //
        for(var i = -1; i < cellSize.w; i++){
            for(var j = -1; j < cellSize.h; j++){
                ctx.fillRect(
                    firstDotPos.x + i * this.comm.resolution, 
                    firstDotPos.y + j * this.comm.resolution,
                    DOT_SIZE, DOT_SIZE);
            }
        }
        //
        if(this.position.x < this.screenDim.w / 2 
                && this.position.x > -this.screenDim.w / 2){
            ctx.strokeStyle = AXIS_COLOR;
            ctx.beginPath();
            ctx.moveTo(this.position.x + this.screenDim.w / 2,0);
            ctx.lineTo(this.position.x + this.screenDim.w / 2,this.screenDim.h);
            ctx.stroke();
        }
        //
        if(this.position.y < this.screenDim.h / 2 
                && this.position.y > -this.screenDim.h / 2){
            ctx.strokeStyle = AXIS_COLOR;
            ctx.beginPath();
            ctx.moveTo(0, this.position.y + this.screenDim.h / 2);
            ctx.lineTo(this.screenDim.w, this.position.y + this.screenDim.h / 2);
            ctx.stroke();
        }
        //
        this.coordsText.innerText = `${this.position.x}, ${this.position.y} @ ${this.comm.resolution.toFixed(1)}`;
    }
}