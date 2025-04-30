export const SHAPE_TYPE = {
    RECTANGLE: 0,
    CIRCLE: 1,
    PIN: 2
}

export default class Component{
    constructor(factory){
        this.shapes = [];
        factory.shapes.forEach(s => this.shapes.push(s.copy()));
        this.pins = [];
        factory.pins.forEach(p => this.pins.push(p.copy()));
        //
        this.position = {
            x: 0, y: 0
        };
        //
        this.comm = factory.comm;
    }
    //
    checkCollision(mx, my){
        for(var i = 0; i < this.shapes.length; i++){
            if(this.shapes[i].checkCollision(this.comm, mx - this.position.x * this.comm.resolution, my - this.position.y * this.comm.resolution)){
                return true;
            }
        }
        return false;
    }
    //
    draw(comm, strokeWidth){
        this.shapes.forEach(s => s.draw(this.comm, strokeWidth, this.position));
    }
    //
    rotate(){
        this.shapes.forEach(s => s.rotate());
    }
}