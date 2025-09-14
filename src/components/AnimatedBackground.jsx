/*
 * Copyright 2025 Krishna GSVV
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect, useRef } from 'react';

const AnimatedBackground = ({ config }) => {
	const canvasRef = useRef(null);
	const animationRef = useRef(null);
	const particlesRef = useRef([]);
	const mouseRef = useRef({ x: 0, y: 0 });

	useEffect(() => {
		if (!config?.enabled || config.type !== 'animated-network') return;

		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		const particles = [];

		// Set canvas size
		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);

		// Mouse tracking
		const handleMouseMove = (event) => {
			mouseRef.current.x = event.clientX;
			mouseRef.current.y = event.clientY;
		};

		window.addEventListener('mousemove', handleMouseMove);

		// Particle class
		class Particle {
			constructor() {
				this.x = Math.random() * canvas.width;
				this.y = Math.random() * canvas.height;
				this.baseVx = (Math.random() - 0.5) * (config.particles?.speed || 0.5);
				this.baseVy = (Math.random() - 0.5) * (config.particles?.speed || 0.5);
				this.vx = this.baseVx;
				this.vy = this.baseVy;
				this.size = (config.particles?.size || 2) + Math.random() * 2;
				this.color = config.particles?.color || 'rgba(147, 51, 234, 0.6)';
				this.opacity = 0.4 + Math.random() * 0.6;
			}

			update() {
				// Mouse influence
				const mouseInfluence = 120;
				const dx = mouseRef.current.x - this.x;
				const dy = mouseRef.current.y - this.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance < mouseInfluence) {
					const force = (mouseInfluence - distance) / mouseInfluence;
					const angle = Math.atan2(dy, dx);
					this.vx = this.baseVx - Math.cos(angle) * force * 3;
					this.vy = this.baseVy - Math.sin(angle) * force * 3;
				} else {
					// Gradually return to base velocity
					this.vx += (this.baseVx - this.vx) * 0.05;
					this.vy += (this.baseVy - this.vy) * 0.05;
				}

				this.x += this.vx * (config.animation?.speed || 1);
				this.y += this.vy * (config.animation?.speed || 1);

				// Bounce off edges
				if (this.x <= 0 || this.x >= canvas.width) {
					this.vx *= -1;
					this.baseVx *= -1;
				}
				if (this.y <= 0 || this.y >= canvas.height) {
					this.vy *= -1;
					this.baseVy *= -1;
				}

				// Keep particles within bounds
				this.x = Math.max(0, Math.min(canvas.width, this.x));
				this.y = Math.max(0, Math.min(canvas.height, this.y));

				// Add subtle pulsing effect
				this.opacity = 0.4 + Math.sin(Date.now() * 0.002 + this.x * 0.01) * 0.3;
			}

			draw() {
				ctx.save();
				ctx.globalAlpha = this.opacity;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
				ctx.fillStyle = this.color;
				ctx.shadowBlur = 8;
				ctx.shadowColor = this.color;
				ctx.fill();
				ctx.restore();
			}
		}

		// Initialize particles
		const particleCount = config.particles?.count || 100;
		for (let i = 0; i < particleCount; i++) {
			particles.push(new Particle());
		}

		particlesRef.current = particles;

		// Animation loop
		const animate = () => {
			// Clear canvas with transparent background
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Update and draw particles
			particles.forEach(particle => {
				particle.update();
				particle.draw();
			});

			// Draw connections between nearby particles
			if (config.particles?.connections?.enabled) {
				const maxDistance = config.particles.connections.distance || 120;
				const connectionColor = config.particles.connections.color || 'rgba(147, 51, 234, 0.3)';
				const lineWidth = config.particles.connections.width || 1;

				ctx.strokeStyle = connectionColor;
				ctx.lineWidth = lineWidth;

				for (let i = 0; i < particles.length; i++) {
					for (let j = i + 1; j < particles.length; j++) {
						const dx = particles[i].x - particles[j].x;
						const dy = particles[i].y - particles[j].y;
						const distance = Math.sqrt(dx * dx + dy * dy);

						if (distance < maxDistance) {
							const opacity = (1 - (distance / maxDistance)) * 0.5;
							ctx.save();
							ctx.globalAlpha = opacity;
							ctx.beginPath();
							ctx.moveTo(particles[i].x, particles[i].y);
							ctx.lineTo(particles[j].x, particles[j].y);
							ctx.stroke();
							ctx.restore();
						}
					}
				}
			}

			animationRef.current = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener('resize', resizeCanvas);
			window.removeEventListener('mousemove', handleMouseMove);
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [config]);

	if (!config?.enabled || config.type !== 'animated-network') {
		return null;
	}

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 w-full h-full pointer-events-none"
			style={{
				zIndex: 1,
				background: "transparent",
			}}
		/>
	);
};

export default AnimatedBackground;
