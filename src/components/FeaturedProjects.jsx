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

import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
	FaGithub,
	FaExternalLinkAlt,
	FaStar,
	FaCodeBranch,
} from "react-icons/fa";

/**
 * Customizable Featured Projects Component
 * Features:
 * - Configurable number of projects to display
 * - Customizable layout and styling from settings
 * - Project stats (stars, forks, etc.)
 * - Technology stack badges
 * - Responsive design
 */
const FeaturedProjects = ({ settings, projects = [] }) => {
	// Get configuration from settings
	const config = settings?.home?.featuredProjects || {};
	const maxProjects = config.maxProjects || 6;
	const layout = config.layout || "grid"; // 'grid', 'carousel', 'list'
	const showStats = config.showStats !== false;
	const showTechStack = config.showTechStack !== false;
	const animateOnScroll = config.animateOnScroll !== false;

	// Get featured projects (limited by settings)
	const featuredProjects = projects
		.filter(
			(project) => project.featured || projects.indexOf(project) < maxProjects
		)
		.slice(0, maxProjects);

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
			},
		},
	};

	// Project card component
	const ProjectCard = ({ project }) => (
		<motion.div
			variants={animateOnScroll ? itemVariants : {}}
			whileHover={{ y: -5 }}
			className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10
				hover:bg-white/10 hover:border-white/20 transition-all duration-300 h-full flex flex-col"
		>
			{/* Project Header */}
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1">
					<h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">
						{project.name || project.title}
					</h3>
					{project.subtitle && (
						<p className="text-primary-400 font-medium text-sm mb-2">
							{project.subtitle}
						</p>
					)}
				</div>

				{/* Project Links */}
				<div className="flex space-x-2 ml-4">
					{project.github && (
						<a
							href={project.github}
							target="_blank"
							rel="noopener noreferrer"
							className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
							title="View on GitHub"
						>
							<FaGithub className="w-4 h-4 text-white/70 hover:text-white" />
						</a>
					)}
					{project.demo && (
						<a
							href={project.demo}
							target="_blank"
							rel="noopener noreferrer"
							className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
							title="Live Demo"
						>
							<FaExternalLinkAlt className="w-4 h-4 text-white/70 hover:text-white" />
						</a>
					)}
				</div>
			</div>

			{/* Project Description */}
			<p className="text-white/70 text-sm mb-4 flex-1 line-clamp-3">
				{project.description}
			</p>

			{/* Technology Stack */}
			{showTechStack && project.technologies && (
				<div className="mb-4">
					<div className="flex flex-wrap gap-2">
						{project.technologies.slice(0, 4).map((tech, techIndex) => (
							<span
								key={techIndex}
								className="px-2 py-1 text-xs rounded-full bg-primary-500/20
									text-primary-300 border border-primary-500/30"
							>
								{tech}
							</span>
						))}
						{project.technologies.length > 4 && (
							<span
								className="px-2 py-1 text-xs rounded-full bg-white/10
								text-white/60 border border-white/20"
							>
								+{project.technologies.length - 4} more
							</span>
						)}
					</div>
				</div>
			)}

			{/* Project Stats */}
			{showStats && (project.stars || project.forks || project.downloads) && (
				<div className="flex items-center space-x-4 text-xs text-white/60 pt-4 border-t border-white/10">
					{project.stars && (
						<div className="flex items-center space-x-1">
							<FaStar className="w-3 h-3" />
							<span>{project.stars}</span>
						</div>
					)}
					{project.forks && (
						<div className="flex items-center space-x-1">
							<FaCodeBranch className="w-3 h-3" />
							<span>{project.forks}</span>
						</div>
					)}
					{project.downloads && (
						<div className="flex items-center space-x-1">
							<span>↓</span>
							<span>{project.downloads}</span>
						</div>
					)}
				</div>
			)}
		</motion.div>
	);

	// Layout styles based on configuration
	const getLayoutClasses = () => {
		switch (layout) {
			case "grid":
				return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
			case "list":
				return "space-y-6";
			case "carousel":
				return "flex overflow-x-auto space-x-6 pb-4 scrollbar-hide";
			default:
				return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
		}
	};

	if (!featuredProjects.length) {
		return null;
	}

	return (
		<section className="py-16">
			<div className="max-w-6xl mx-auto px-4">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-12"
				>
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
						{config.title || "Featured Projects & Achievements"}
					</h2>
					{config.subtitle && (
						<p className="text-lg text-white/70 max-w-3xl mx-auto">
							{config.subtitle}
						</p>
					)}
				</motion.div>

				{/* Projects Container */}
				<motion.div
					variants={animateOnScroll ? containerVariants : {}}
					initial={animateOnScroll ? "hidden" : {}}
					animate={animateOnScroll ? "visible" : {}}
					className={getLayoutClasses()}
				>
					{featuredProjects.map((project, index) => (
						<ProjectCard key={project.id || index} project={project} />
					))}
				</motion.div>

				{/* View All Projects Link */}
				{config.showViewAllLink !== false && projects.length > maxProjects && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
						className="text-center mt-12"
					>
						<a
							href="/projects"
							className="inline-flex items-center space-x-2 px-6 py-3
								bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/50
								rounded-lg text-primary-300 hover:text-primary-200 transition-all duration-300"
						>
							<span>View All Projects</span>
							<FaExternalLinkAlt className="w-4 h-4" />
						</a>
					</motion.div>
				)}

				{/* Configuration Debug Info */}
				{import.meta.env.DEV && (
					<div className="mt-8 p-4 bg-white/5 rounded-lg text-xs text-white/50">
						<strong>Featured Projects Config:</strong>
						Max: {maxProjects}, Layout: {layout}, Showing:{" "}
						{featuredProjects.length}/{projects.length} projects
					</div>
				)}
			</div>
		</section>
	);
};

export default FeaturedProjects;
