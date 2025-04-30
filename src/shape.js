


export default class Rectangle{
    constructor(position, dims, color){
        this.position = {
            x: position.x,
            y: position.y
        };
        //
        this.dims = {
            w: dims.w,
            h: dims.h
        };
        //
        this.color = color;
    }
    //
    checkCollision(comm, x, y){
        let hfw = comm.screenDim.w / 2;
        let hfh = comm.screenDim.h / 2;
        //
        let xtop = this.position.x * comm.resolution + hfw + comm.position.x;
        let ytop = this.position.y * comm.resolution + hfh + comm.position.y;
        //
        return (x > xtop 
            && x < xtop + this.dims.w * comm.resolution
            && y > ytop
            && y < ytop + this.dims.h * comm.resolution);
    }
    //
    draw(comm, strokeW = 1, offset={x:0, y:0}){
        let ctx = comm.ctx;
        let gridPos = comm.position;
        //
        let hfw = comm.screenDim.w / 2;
        let hfh = comm.screenDim.h / 2;
        //
        ctx.strokeStyle = this.color;
        ctx.lineWidth = strokeW;
        //
        ctx.beginPath();
        ctx.rect((this.position.x + offset.x) * comm.resolution + hfw + gridPos.x,
                (this.position.y + offset.y) * comm.resolution + hfh + gridPos.y,
                this.dims.w * comm.resolution,
                this.dims.h * comm.resolution);
        ctx.stroke();
        //
        ctx.lineWidth = 1;
    }
    //
    removeNegatives(){
        if(this.dims.w < 0){
            this.position.x += this.dims.w;
            this.dims.w *= -1;
        }
        if(this.dims.h < 0){
            this.position.y += this.dims.h;
            this.dims.h *= -1;
        }
    }
    //
    rotate(){
        let temp = this.position.x;
        this.position.x = -this.position.y;
        this.position.y = temp;
        //
        temp = this.dims.w;
        this.dims.w = -this.dims.h;
        this.dims.h = temp;
        //
        this.removeNegatives();
    }
    //
    copy(){
        return new Rectangle(this.position, this.dims, this.color);
    }
}