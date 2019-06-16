//Create a Pixi Application
let app = new PIXI.Application({ 
    width: 512,         // default: 800
    height: 512,        // default: 600
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1       // default: 1
  }
);

app.renderer.backgroundColor = 0x061639;

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);