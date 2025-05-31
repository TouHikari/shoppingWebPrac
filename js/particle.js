const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];

const GRAVITY = 0.8;            // 重力加速度，越大粒子落得越快
const FRICTION = 1;             // 摩擦力/空气阻力，小于1，使粒子速度逐渐减慢
const PARTICLE_RADIUS = 2;      // 小球半径
const PARTICLE_COUNT = 50;      // 每次点击生成的小球数量
const INITIAL_SPEED_MIN = 3;    // 初始爆炸速度最小值
const INITIAL_SPEED_MAX = 6;    // 初始爆炸速度最大值

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r},${g},${b}`; 
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = PARTICLE_RADIUS;
        this.color = getRandomColor();

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (INITIAL_SPEED_MAX - INITIAL_SPEED_MIN) + INITIAL_SPEED_MIN;

        this.vx = Math.cos(angle) * speed; 
        this.vy = Math.sin(angle) * speed - speed / 2; 
    }

    update() {
        this.vx *= FRICTION;
        this.vy *= FRICTION;

        this.vy += GRAVITY;

        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        ctx.save();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        ctx.restore();
    }

    isDead() {
        return (this.y > canvas.height + this.radius * 2 && this.vy > 0); 
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter(particle => !particle.isDead());

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animate);
}

document.addEventListener('click', (event) => {
    const clickX = event.clientX;
    const clickY = event.clientY;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle(clickX, clickY));
    }
});

animate();