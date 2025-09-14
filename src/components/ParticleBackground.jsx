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
import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticleBackground = () => {
	const particlesInit = useCallback(async (engine) => {
		await loadSlim(engine);
	}, []);

	const particlesLoaded = useCallback(async (container) => {
		console.log("Particles loaded:", container);
	}, []);

	return (
		<Particles
			id="tsparticles"
			init={particlesInit}
			loaded={particlesLoaded}
			options={{
				background: {
					color: {
						value: "#0a0a0a",
					},
				},
				fpsLimit: 120,
				interactivity: {
					events: {
						onClick: {
							enable: true,
							mode: "push",
						},
						onHover: {
							enable: true,
							mode: "repulse",
						},
						resize: true,
					},
					modes: {
						push: {
							quantity: 4,
						},
						repulse: {
							distance: 200,
							duration: 0.4,
						},
					},
				},
				particles: {
					color: {
						value: ["#c770f0", "#ec4999", "#ef4444", "#7c3aed", "#06b6d4"],
					},
					links: {
						color: "#c770f0",
						distance: 150,
						enable: true,
						opacity: 0.2,
						width: 1,
					},
					move: {
						direction: "none",
						enable: true,
						outModes: {
							default: "bounce",
						},
						random: false,
						speed: 0.8,
						straight: false,
					},
					number: {
						density: {
							enable: true,
							area: 900,
						},
						value: 60,
					},
					opacity: {
						value: 0.4,
					},
					shape: {
						type: "circle",
					},
					size: {
						value: { min: 1, max: 3 },
					},
				},
				detectRetina: true,
			}}
			className="fixed inset-0 w-full h-full z-0 pointer-events-none"
		/>
	);
};

export default ParticleBackground;
