var canvas = document.getElementById("circle")
var c = canvas.getContext('2d')

var x = 50
var y = 50
var cx = x
var cy = y
var idx = 0
var vol = 0.025

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.clientWidth,canvas.clientHeight)
    c.beginPath()
    c.arc(cx,cy,5,0,Math.PI * 2,false)
    idx += vol
    cx = x + (Math.cos(idx) * 20)
    cy = y + (Math.sin(idx) * 20)
    c.stroke()
    p.render(c)
    for (let i = 0; i<gravityParticles.length; i++) {
        gravityParticles[i].render(c)
    }
}

class Particle {
    constructor(x,y,radius) {
        this.x = x
        this.y = y
        this.radius = radius
    }

    render(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.stroke()
        ctx.closePath()
    }
}

class GravityParticle {
    
    constructor(x, y, radius, gravity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.dy = 1
        this.dx = (0.5 - Math.random()) * 2
        this.gravity = gravity


        this.color = `hsl(${Math.round(Math.random() * 255)},${Math.round(Math.random() * 50) + 50}%,${Math.round(Math.random() * 50) + 25}%)`
    }

    render(ctx) {
        if ((this.y + this.radius + this.dy) > canvas.height) {
            this.dy = -this.dy * 0.9
            this.dx *= 0.95
        } else {
            this.dy += this.gravity
        }
        this.y += this.dy
        if (this.x + this.radius + this.dx > canvas.width ||
            this.x + this.dx < this.radius) {
            this.dx = -this.dx * 0.9
        }
        this.x += this.dx
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
     }
}

var p = new Particle(x,y,2)
var gravityParticles = []
// for (let i = 0; i<20; i++) {
//     gravityParticles.push(new GravityParticle(canvas.width / 2, 
//                                             20, 
//                                             Math.random() * 5 + 2, 
//                                             Math.random() + 0.3))
// }


requestAnimationFrame(animate)

function addParticle() {
    gravityParticles.push(new GravityParticle(canvas.width / 2, 
        20, 
        Math.random() * 5 + 2, 
        Math.random() + 0.3))
}

window.addEventListener('click', addParticle)