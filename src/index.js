import Command from "./command";

// HTML Elements
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");



//Game Variables
let screen_dim = {
    w: window.innerWidth - 22,
    h: window.innerHeight - 22
}

//Game Objects
let comm = new Command(screen_dim, canvas, ctx);


canvas.width = screen_dim.w;
canvas.height = screen_dim.h;

comm.init();