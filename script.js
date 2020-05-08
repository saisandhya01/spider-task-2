let canvas=document.getElementById('canvas');
canvas.width=window.outerWidth;
canvas.height=(window.innerHeight/2)+70;
let c=canvas.getContext('2d');

class Bubble{
    constructor(x,y,radius,color,dx,dy){
        this.x=x
        this.y=y
        this.radius=radius
        this.color=color
        this.dx=dx
        this.dy=dy
    }
    draw(){
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        c.strokeStyle=this.color
        c.stroke()
        c.closePath()
    }
    update(){
        if(this.x+this.radius>canvas.width || this.x-this.radius<0){
            this.dx=-this.dx
        }
        if(this.y+this.radius>canvas.height ||this.y-this.radius<0){
            this.dy=-this.dy
        }
        this.x+=this.dx
        this.y+=this.dy
        this.draw()

    }
}
let bubbles=[];
function init(){
    for(let i=0;i<50;i++){
    let x=Math.random()*canvas.width;
    let y=Math.random()*canvas.height/2+70;
    let radius=30;
    let dx=(Math.random()-0.5)*10;
    let dy=(Math.random()-0.5)*10;
    bubbles.push(new Bubble(x,y,radius,'purple',dx,dy));
    }
}
function animate(){
    c.clearRect(0,0,canvas.width,canvas.height);
    bubbles.forEach(bubble=>{
        bubble.update();
    });
    requestAnimationFrame(animate);
    
}
function startGame(){
    init();
    animate();
}