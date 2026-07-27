<template>
  <canvas ref="canvas" class="particle-canvas"></canvas>
</template>

<script>
export default {
  name: "ParticleCanvas",
  data() {
    return {
      canvas: null,
      ctx: null,
      particles: [],
      mouse: { x: null, y: null },
      animationId: null,
    };
  },
  mounted() {
    this.initCanvas();
    this.createParticles();
    this.animate();
    this.addEventListeners();
  },
  beforeDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.removeEventListeners();
  },
  methods: {
    initCanvas() {
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext("2d");
      this.resizeCanvas();
    },
    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },
    createParticles() {
      const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 6000);
      this.particles = [];
      
      for (let i = 0; i < particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.5,
        });
      }
    },
    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.updateParticles();
      this.drawParticles();
      this.connectParticles();
      this.drawMousePoint();
      this.animationId = requestAnimationFrame(this.animate);
    },
    drawMousePoint() {
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const gradient = this.ctx.createRadialGradient(
          this.mouse.x,
          this.mouse.y,
          0,
          this.mouse.x,
          this.mouse.y,
          5
        );
        gradient.addColorStop(0, "rgba(121, 198, 255, 0.8)");
        gradient.addColorStop(1, "rgba(121, 198, 255, 0)");
        
        this.ctx.beginPath();
        this.ctx.arc(this.mouse.x, this.mouse.y, 3, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
      }
    },
    updateParticles() {
      const mouseRadius = 200;
      const attractForce = 0.5;

      this.particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (this.mouse.x !== null && this.mouse.y !== null) {
          const dx = this.mouse.x - particle.x;
          const dy = this.mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseRadius) {
            const force = (mouseRadius - distance) / mouseRadius;
            particle.vx += (dx / distance) * force * attractForce;
            particle.vy += (dy / distance) * force * attractForce;
          }
        }

        particle.vx *= 0.98;
        particle.vy *= 0.98;

        if (particle.x < 0 || particle.x > this.canvas.width) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > this.canvas.height) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        }
      });
    },
    drawParticles() {
      this.particles.forEach((particle) => {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        
        const gradient = this.ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 3
        );
        gradient.addColorStop(0, `rgba(121, 198, 255, ${particle.opacity})`);
        gradient.addColorStop(1, "rgba(121, 198, 255, 2)");
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
      });
    },
    connectParticles() {
      const maxDistance = 200;

      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const dx = this.particles[i].x - this.particles[j].x;
          const dy = this.particles[i].y - this.particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.4;
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(121, 198, 255, ${opacity})`;
            this.ctx.lineWidth = 0.8;
            this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
            this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
            this.ctx.stroke();
          }
        }
      }

      if (this.mouse.x !== null && this.mouse.y !== null) {
        this.particles.forEach((particle) => {
          const dx = particle.x - this.mouse.x;
          const dy = particle.y - this.mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.5;
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(121, 198, 255, ${opacity})`;
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(this.mouse.x, this.mouse.y);
            this.ctx.stroke();
          }
        });
      }
    },
    handleMouseMove(e) {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    },
    handleMouseLeave() {
      this.mouse.x = null;
      this.mouse.y = null;
    },
    handleResize() {
      this.resizeCanvas();
      this.createParticles();
    },
    addEventListeners() {
      window.addEventListener("mousemove", this.handleMouseMove);
      window.addEventListener("mouseleave", this.handleMouseLeave);
      window.addEventListener("resize", this.handleResize);
    },
    removeEventListeners() {
      window.removeEventListener("mousemove", this.handleMouseMove);
      window.removeEventListener("mouseleave", this.handleMouseLeave);
      window.removeEventListener("resize", this.handleResize);
    },
  },
};
</script>

<style lang="less" scoped>
.particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  background: transparent;
}
</style>