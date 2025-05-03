import { SHAPE_TYPE } from "./component";


export class Rectangle{
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
        //
        this.type = SHAPE_TYPE.RECTANGLE;
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
    //
    adjustDim(dx, dy, res){
        this.dims.w = Math.round(dx / res);
        this.dims.h = Math.round(dy / res);
    }
    //
    getDimText(){
        return `${this.dims.w + 1}, ${this.dims.h + 1}`;
    }
    //
    getPosText(){
        return `${this.position.x + (this.dims.w / 2)}, ${this.position.y + (this.dims.h / 2)}`;
    }
}

export class Circle{
    constructor(position, radius, color){
        this.position = {
            x: position.x,
            y: position.y
        };
        //
        this.radius = radius;
        //
        this.color = color;
        //
        this.type = SHAPE_TYPE.CIRCLE;
    }
    //
    checkCollision(comm, x, y){
        let hfw = comm.screenDim.w / 2;
        let hfh = comm.screenDim.h / 2;
        //
        let xtop = this.position.x * comm.resolution + hfw + comm.position.x;
        let ytop = this.position.y * comm.resolution + hfh + comm.position.y;
        //
        let distance = Math.sqrt(
            (xtop - x) ** 2 +
            (ytop - y) ** 2
        );
        //
        return (distance < this.radius * comm.resolution);
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
        ctx.arc(
            (this.position.x + offset.x) * comm.resolution + hfw + gridPos.x,
            (this.position.y + offset.y) * comm.resolution + hfh + gridPos.y, 
            this.radius * comm.resolution,
            0,
            2 * Math.PI
        );
        ctx.stroke();
        //
        ctx.lineWidth = 1;
    }
    //
    removeNegatives(){
        //do nothing
    }
    //
    rotate(){
        let temp = this.position.x;
        this.position.x = -this.position.y;
        this.position.y = temp;
    }
    //
    copy(){
        return new Circle(this.position, this.radius, this.color);
    }
    //
    adjustDim(dx, dy, res){
        let distance = Math.sqrt(dx ** 2 + dy ** 2);
        this.radius = Math.round(2 * distance / res) / 2;
    }
    //
    getDimText(){
        return `${this.radius}`;
    }
    //
    getPosText(){
        return `${this.position.x}, ${this.position.y}`;
    }
}

export class Pin{
    constructor(position, color){
        this.position = {
            x: position.x,
            y: position.y
        };
        //
        this.radius = 0.1;
        //
        this.color = color;
        //
        this.type = SHAPE_TYPE.PIN;
    }
    //
    checkCollision(comm, x, y){
        let hfw = comm.screenDim.w / 2;
        let hfh = comm.screenDim.h / 2;
        //
        let xtop = this.position.x * comm.resolution + hfw + comm.position.x;
        let ytop = this.position.y * comm.resolution + hfh + comm.position.y;
        //
        let distance = Math.sqrt(
            (xtop - x) ** 2 +
            (ytop - y) ** 2
        );
        //
        return (distance < 0.5 * comm.resolution);
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
        ctx.fillStyle = this.color;
        ctx.lineWidth = strokeW;
        //
        ctx.beginPath();
        ctx.arc(
            (this.position.x + offset.x) * comm.resolution + hfw + gridPos.x,
            (this.position.y + offset.y) * comm.resolution + hfh + gridPos.y, 
            this.radius * comm.resolution,
            0,
            2 * Math.PI
        );
        ctx.stroke();
        ctx.fill();
        //
        ctx.lineWidth = 1;
    }
        //
        removeNegatives(){
            //do nothing
        }
        //
        rotate(){
            let temp = this.position.x;
            this.position.x = -this.position.y;
            this.position.y = temp;
        }
        //
        copy(){
            return new Pin(this.position, this.color);
        }
        //
        adjustDim(dx, dy, res){
            //do nothing
        }
        //
        getDimText(){
            return ``;
        }
        //
        getPosText(){
            return `${this.position.x}, ${this.position.y}`;
        }
}