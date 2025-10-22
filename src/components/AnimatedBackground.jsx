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
		if (!config?.enabled) return;

		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		let particles = [];

		// Mouse tracking for interactive effects
		const handleMouseMove = (event) => {
			mouseRef.current.x = event.clientX;
			mouseRef.current.y = event.clientY;
		};

		if (config.type === "animated-network" || config.type === "particles") {
			window.addEventListener("mousemove", handleMouseMove);
		}

		// Render static gradient background
		const renderGradientBackground = () => {
			const gradientConfig = config.gradient || {};
			if (!gradientConfig.enabled && config.type !== "gradient") return;

			const gradient = ctx.createLinearGradient(
				0,
				0,
				gradientConfig.direction === "to bottom right" ? canvas.width : 0,
				gradientConfig.direction === "to bottom right"
					? canvas.height
					: canvas.height
			);

			const colors = gradientConfig.colors || [
				"rgba(15, 23, 42, 1)",
				"rgba(30, 41, 59, 0.8)",
				"rgba(51, 65, 85, 0.6)",
			];

			colors.forEach((color, index) => {
				gradient.addColorStop(index / (colors.length - 1), color);
			});

			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		};

		// Handle gradient-only background
		if (config.type === "gradient") {
			renderGradientBackground();
			return () => {
				window.removeEventListener("resize", resizeCanvas);
			};
		}

		// Skip particle creation for non-particle backgrounds
		if (config.type !== "animated-network" && config.type !== "particles") {
			return () => {
				window.removeEventListener("resize", resizeCanvas);
			};
		}

		// Extract configuration values with defaults
		const particleConfig = config.particles || {};
		const animationConfig = config.animation || {};
		const gradientConfig = config.gradient || {};

		// Particle count calculation function
		const calculateParticleCount = () => {
			const screenArea = canvas.width * canvas.height;
			const baseArea = 1920 * 1080; // Reference screen size (Full HD)
			const baseDensity = particleConfig.count || 150; // Base particle count for reference screen

			// Calculate density factor based on screen area ratio
			const densityFactor = Math.sqrt(screenArea / baseArea);

			// Apply density factor with min/max bounds
			const calculatedCount = Math.round(baseDensity * densityFactor);
			const minParticles = particleConfig.minParticles || 20;
			const maxParticles = particleConfig.maxParticles || 500;

			return Math.max(minParticles, Math.min(maxParticles, calculatedCount));
		};

		// Initialize particles array
		const initializeParticles = () => {
			const particleCount = calculateParticleCount();
			particles = [];
			for (let i = 0; i < particleCount; i++) {
				particles.push(new Particle());
			}
			particlesRef.current = particles;
		};

		// Update resize function to handle dynamic particle count adjustment
		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			// Recalculate particle count based on new screen size
			if (particles.length > 0) {
				const newParticleCount = calculateParticleCount();
				const currentCount = particles.length;

				// Adjust particle count if screen size changed significantly
				if (Math.abs(newParticleCount - currentCount) > 5) {
					if (newParticleCount > currentCount) {
						// Add more particles
						for (let i = currentCount; i < newParticleCount; i++) {
							particles.push(new Particle());
						}
					} else {
						// Remove excess particles
						particles.splice(newParticleCount);
					}
					particlesRef.current = particles;
				}
			}
		};

		// Particle class
		class Particle {
			constructor() {
				this.x = Math.random() * canvas.width;
				this.y = Math.random() * canvas.height;
				this.baseVx = (Math.random() - 0.5) * (particleConfig.speed || 0.5);
				this.baseVy = (Math.random() - 0.5) * (particleConfig.speed || 0.5);
				this.vx = this.baseVx;
				this.vy = this.baseVy;
				this.size = (particleConfig.size || 2) + Math.random() * 2;
				this.color = particleConfig.color || "#ef4444";
				this.opacity = 0.4 + Math.random() * 0.6;
				this.baseOpacity = this.opacity;
			}

			update() {
				// Mouse influence (configurable)
				const mouseInfluence = particleConfig.mouseInfluence || 120;
				const mouseForce = particleConfig.mouseForce || 3;
				const returnSpeed = particleConfig.returnSpeed || 0.05;

				const dx = mouseRef.current.x - this.x;
				const dy = mouseRef.current.y - this.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance < mouseInfluence) {
					const force = (mouseInfluence - distance) / mouseInfluence;
					const angle = Math.atan2(dy, dx);
					this.vx = this.baseVx - Math.cos(angle) * force * mouseForce;
					this.vy = this.baseVy - Math.sin(angle) * force * mouseForce;
				} else {
					// Gradually return to base velocity
					this.vx += (this.baseVx - this.vx) * returnSpeed;
					this.vy += (this.baseVy - this.vy) * returnSpeed;
				}

				// Apply animation speed
				const animSpeed = animationConfig.speed || 1;
				this.x += this.vx * animSpeed;
				this.y += this.vy * animSpeed;

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

				// Add configurable pulsing effect
				const pulseIntensity = particleConfig.pulseIntensity || 0.3;
				const pulseSpeed = particleConfig.pulseSpeed || 0.002;
				this.opacity =
					this.baseOpacity +
					Math.sin(Date.now() * pulseSpeed + this.x * 0.01) * pulseIntensity;
			}

			draw() {
				ctx.save();
				ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
				ctx.fillStyle = this.color;

				// Add glow effect if enabled
				if (particleConfig.glow !== false) {
					const glowSize = particleConfig.glowSize || 8;
					ctx.shadowBlur = glowSize;
					ctx.shadowColor = this.color;
				}

				ctx.fill();
				ctx.restore();
			}
		}

		// Initialize canvas and set up event listeners
		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		// Initialize particles after defining the class
		initializeParticles();

		// Animation loop with configurable smoothness
		let lastTime = 0;
		const targetFPS = animationConfig.smoothness || 60;
		const frameInterval = 1000 / targetFPS;

		const animate = (currentTime) => {
			if (currentTime - lastTime >= frameInterval) {
				// Clear canvas
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				// Draw gradient background if enabled
				if (gradientConfig.enabled) {
					const gradient = ctx.createLinearGradient(
						0,
						0,
						gradientConfig.direction === "to bottom right" ? canvas.width : 0,
						gradientConfig.direction === "to bottom right"
							? canvas.height
							: canvas.height
					);

					const colors = gradientConfig.colors || [
						"rgba(15, 23, 42, 1)",
						"rgba(30, 41, 59, 0.8)",
						"rgba(51, 65, 85, 0.6)",
					];

					colors.forEach((color, index) => {
						gradient.addColorStop(index / (colors.length - 1), color);
					});

					ctx.fillStyle = gradient;
					ctx.fillRect(0, 0, canvas.width, canvas.height);
				}

				// Update and draw particles
				particles.forEach((particle) => {
					particle.update();
					particle.draw();
				});

				// Draw connections between nearby particles (only for animated-network type)
				const connections = particleConfig.connections || {};
				if (config.type === "animated-network" && connections.enabled) {
					const maxDistance = connections.distance || 200;
					const connectionColor =
						connections.color || "rgba(147, 51, 234, 0.2)";
					const lineWidth = connections.width || 2;
					const maxOpacity = connections.maxOpacity || 0.5;

					ctx.strokeStyle = connectionColor;
					ctx.lineWidth = lineWidth;

					for (let i = 0; i < particles.length; i++) {
						for (let j = i + 1; j < particles.length; j++) {
							const dx = particles[i].x - particles[j].x;
							const dy = particles[i].y - particles[j].y;
							const distance = Math.sqrt(dx * dx + dy * dy);

							if (distance < maxDistance) {
								const opacity = (1 - distance / maxDistance) * maxOpacity;
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

				lastTime = currentTime;
			}

			animationRef.current = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			window.removeEventListener("mousemove", handleMouseMove);
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [config]);

	// Don't render anything if disabled or type is 'none'
	if (!config?.enabled || config.type === "none") {
		return null;
	}

	return (
		<canvas
			ref={canvasRef}
			className="absolute inset-0 w-full h-full pointer-events-none"
			style={{
				zIndex: 1,
				background: config.type === "gradient" ? "transparent" : "transparent",
			}}
		/>
	);
};

export default AnimatedBackground;
