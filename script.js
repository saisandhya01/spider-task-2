let canvas=document.getElementById('canvas');
canvas.width=window.outerWidth;
canvas.height=(window.innerHeight/2)+70;
let c=canvas.getContext('2d');

function randomNumber(min,max){
    return Math.random() *(max-min) +min;
}
function distance(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}
const mouse={
    x: 0,
    y: 0
}
function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}
function resolveCollision(bubble,otherBubble){
    const xVelocityDiff = bubble.v.x - otherBubble.v.x;
    const yVelocityDiff = bubble.v.y - otherBubble.v.y;

    const xDist = otherBubble.x - bubble.x;
    const yDist = otherBubble.y - bubble.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherBubble.y - bubble.y, otherBubble.x - bubble.x);

        // Store mass in var for better readability in collision equation
        const m1 = bubble.mass;
        const m2 = otherBubble.mass;

        // Velocity before equation
        const u1 = rotate(bubble.v, angle);
        const u2 = rotate(otherBubble.v, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        bubble.v.x = vFinal1.x;
        bubble.v.y = vFinal1.y;

        otherBubble.v.x = vFinal2.x;
        otherBubble.v.y = vFinal2.y;
    }
}


class Bubble{
    constructor(x,y,radius,color){
        this.x=x
        this.y=y
        this.radius=radius
        this.color=color
        this.v={
            x: (Math.random()-0.5)*5,
            y: (Math.random()-0.5)*5
        }
        this.mass=1
        this.destroy=false
    }
    draw(){
        c.beginPath()
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        c.strokeStyle=this.color
        c.stroke()
        c.closePath()
    }
    isClicked(){
        console.log(mouse.x,mouse.y)
        canvas.addEventListener('click',(event)=>{
            mouse.x=event.offsetX
            mouse.y=event.offsetY
            if(distance(this.x,this.y,mouse.x,mouse.y)-this.radius<0){
                this.destroy=true
            }
        })
    }    
        
    
    update(bubbles){
        for(let i=0;i<bubbles.length;i++){
            if(this===bubbles[i]){
                continue;
            }
            if(distance(this.x,this.y,bubbles[i].x,bubbles[i].y)-this.radius*2 <0){
                resolveCollision(this,bubbles[i]);
            }
        }
        if(this.x+this.radius>canvas.width || this.x-this.radius<0){
            this.v.x=-this.v.x
        }
        if(this.y+this.radius>canvas.height ||this.y-this.radius<0){
            this.v.y=-this.v.y
        }
        this.x+=this.v.x
        this.y+=this.v.y
        this.draw()

    }
}
let bubbles=[];
function init(){
    for(let i=0;i<50;i++){
    const radius=30;
    let x=randomNumber(radius,canvas.width-radius);
    let y=randomNumber(radius,canvas.height-radius);
    if(i!=0){
        for(let j=0;j<bubbles.length;j++){
            if(distance(x,y,bubbles[j].x,bubbles[j].y)-radius*2 <0){
                 x=randomNumber(radius,canvas.width-radius);
                 y=randomNumber(radius,canvas.height-radius);
                j=-1;
            }
        }
    }
    
    bubbles.push(new Bubble(x,y,radius,'purple'));
    }
}
let paused=false
pause=document.getElementById('pause')
resume=document.getElementById('resume')
pause.onclick=()=>{
    paused=true;
}
resume.onclick=()=>{
    paused=false;
    requestAnimationFrame(animate);
}
function animate(){
    c.clearRect(0,0,canvas.width,canvas.height);
    bubbles.forEach(bubble=>{
        bubble.update(bubbles);
        bubble.isClicked();
    });
    for(let i=bubbles.length-1;i>=0;i--){
        if(bubbles[i].destroy){
            bubbles.splice(i,1);
        }
    }
    if(!paused){
      requestAnimationFrame(animate);
    }
}
function startGame(){
    init();
    animate();
}