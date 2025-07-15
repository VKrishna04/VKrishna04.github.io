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
	StarIcon,
	EyeIcon,
	CodeBracketIcon,
	ArrowTopRightOnSquareIcon,
	CalendarIcon,
	TagIcon,
} from "@heroicons/react/24/outline";
import {
	FaGithub,
	FaReact,
	FaNodeJs,
	FaPython,
	FaJava,
	FaPhp,
	FaHtml5,
	FaCss3Alt,
	FaAws,
	FaJsSquare,
	FaVuejs,
	FaAngular,
	FaDocker,
	FaGitAlt,
	FaDatabase,
	FaMobile,
	FaGlobe,
	FaCode,
} from "react-icons/fa";
import {
	SiTypescript,
	SiNextdotjs,
	SiTailwindcss,
	SiMongodb,
	SiPostgresql,
	SiExpress,
	SiNestjs,
	SiDjango,
	SiFlask,
	SiSpring,
	SiKotlin,
	SiSwift,
	SiFlutter,
	SiReact,
	SiVuedotjs,
	SiAngular,
	SiSvelte,
	SiNuxtdotjs,
	SiVite,
	SiWebpack,
	SiElectron,
	SiFirebase,
	SiSupabase,
	SiRedis,
	SiGraphql,
	SiPrisma,
	SiMysql,
	SiSqlite,
	SiGo,
	SiRust,
	SiCplusplus,
	SiC,
	SiRuby,
	SiElixir,
	SiScala,
	SiKubernetes,
	SiGooglecloud,
	SiVercel,
	SiNetlify,
	SiHeroku,
} from "react-icons/si";

const ProjectCard = ({ project, index = 0 }) => {
	// Animation variants
	const cardVariants = {
		hidden: {
			opacity: 0,
			y: 50,
			scale: 0.9,
		},
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				duration: 0.5,
				delay: index * 0.1,
				ease: "easeOut",
			},
		},
	};

	const formatDate = (dateString) => {
		if (!dateString) return "Recently";
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
			});
		} catch {
			return "Recently";
		}
	};

	const getLanguageColor = (language) => {
		const colors = {
			JavaScript: "#f7df1e",
			TypeScript: "#3178c6",
			Python: "#3572a5",
			Java: "#ed8b00",
			React: "#61dafb",
			Vue: "#4fc08d",
			Angular: "#dd0031",
			Node: "#339933",
			HTML: "#e34c26",
			CSS: "#1572b6",
			SCSS: "#cf649a",
			PHP: "#777bb4",
			Go: "#00add8",
			Rust: "#000000",
			C: "#a8b9cc",
			"C++": "#f34b7d",
			"C#": "#239120",
			Swift: "#fa7343",
			Kotlin: "#7f52ff",
			Dart: "#0175c2",
		};
		return colors[language] || "#6b7280";
	};

	const getTechnologyIcon = (tech) => {
		if (!tech) return CodeBracketIcon;

		const techLower = tech.toLowerCase();
		const iconMap = {
			// Frontend Languages & Frameworks
			javascript: FaJsSquare,
			js: FaJsSquare,
			typescript: SiTypescript,
			ts: SiTypescript,
			html: FaHtml5,
			html5: FaHtml5,
			css: FaCss3Alt,
			css3: FaCss3Alt,
			react: FaReact,
			reactjs: FaReact,
			vue: FaVuejs,
			vuejs: FaVuejs,
			"vue.js": SiVuedotjs,
			angular: FaAngular,
			angularjs: FaAngular,
			svelte: SiSvelte,
			next: SiNextdotjs,
			nextjs: SiNextdotjs,
			"next.js": SiNextdotjs,
			nuxt: SiNuxtdotjs,
			nuxtjs: SiNuxtdotjs,
			tailwind: SiTailwindcss,
			tailwindcss: SiTailwindcss,

			// Backend Languages & Frameworks
			python: FaPython,
			java: FaJava,
			php: FaPhp,
			node: FaNodeJs,
			nodejs: FaNodeJs,
			"node.js": FaNodeJs,
			express: SiExpress,
			expressjs: SiExpress,
			nestjs: SiNestjs,
			nest: SiNestjs,
			django: SiDjango,
			flask: SiFlask,
			spring: SiSpring,
			springboot: SiSpring,
			go: SiGo,
			golang: SiGo,
			rust: SiRust,
			"c++": SiCplusplus,
			cpp: SiCplusplus,
			c: SiC,
			ruby: SiRuby,
			elixir: SiElixir,
			scala: SiScala,
			kotlin: SiKotlin,
			swift: SiSwift,

			// Mobile & Desktop
			flutter: SiFlutter,
			dart: SiFlutter,
			electron: SiElectron,
			mobile: FaMobile,
			android: FaMobile,
			ios: FaMobile,

			// Databases
			mongodb: SiMongodb,
			mongo: SiMongodb,
			postgresql: SiPostgresql,
			postgres: SiPostgresql,
			mysql: SiMysql,
			sqlite: SiSqlite,
			redis: SiRedis,
			database: FaDatabase,
			db: FaDatabase,

			// Tools & Others
			docker: FaDocker,
			git: FaGitAlt,
			github: FaGithub,
			firebase: SiFirebase,
			supabase: SiSupabase,
			graphql: SiGraphql,
			prisma: SiPrisma,
			vite: SiVite,
			webpack: SiWebpack,
			kubernetes: SiKubernetes,
			k8s: SiKubernetes,

			// Cloud & Deployment
			aws: FaAws,
			gcp: SiGooglecloud,
			google: SiGooglecloud,
			vercel: SiVercel,
			netlify: SiNetlify,
			heroku: SiHeroku,

			// Web & General
			web: FaGlobe,
			website: FaGlobe,
			webapp: FaGlobe,
			api: FaCode,
			backend: FaCode,
			frontend: FaCode,
			fullstack: FaCode,
		};

		return iconMap[techLower] || CodeBracketIcon;
	};

	const getProjectIcon = () => {
		// Priority order: check main language first, then first technology, then fallback
		if (project.language) {
			const icon = getTechnologyIcon(project.language);
			if (icon !== CodeBracketIcon) return icon;
		}

		if (project.technologies && project.technologies.length > 0) {
			const icon = getTechnologyIcon(project.technologies[0]);
			if (icon !== CodeBracketIcon) return icon;
		}

		if (project.topics && project.topics.length > 0) {
			const icon = getTechnologyIcon(project.topics[0]);
			if (icon !== CodeBracketIcon) return icon;
		}

		return CodeBracketIcon;
	};

	const ProjectIcon = getProjectIcon();

	return (
		<motion.div
			variants={cardVariants}
			initial="hidden"
			animate="visible"
			whileHover={{
				y: -8,
				transition: { duration: 0.3 },
			}}
			className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 group h-full flex flex-col"
		>
			{/* Header */}
			<div className="flex items-start justify-between mb-4">
				<div className="flex items-center space-x-3 flex-1 min-w-0">
					<div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex-shrink-0">
						<ProjectIcon className="w-5 h-5 text-white" />
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors truncate">
							{project.name || "Untitled Project"}
						</h3>
						{project.language && (
							<span
								className="text-sm font-medium"
								style={{ color: getLanguageColor(project.language) }}
							>
								{project.language}
							</span>
						)}
					</div>
				</div>

				{/* Stars */}
				{typeof project.stargazers_count === "number" && (
					<div className="flex items-center space-x-1 text-yellow-400 flex-shrink-0">
						<StarIcon className="w-4 h-4" />
						<span className="text-sm font-medium">
							{project.stargazers_count}
						</span>
					</div>
				)}
			</div>

			{/* Description */}
			<p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
				{project.description || "No description available"}
			</p>

			{/* Topics/Tags */}
			{project.topics && project.topics.length > 0 && (
				<div className="mb-4">
					<div className="flex flex-wrap gap-1">
						{project.topics.slice(0, 4).map((topic, idx) => {
							const TopicIcon = getTechnologyIcon(topic);
							const showIcon = TopicIcon !== CodeBracketIcon;
							return (
								<span
									key={idx}
									className="flex items-center space-x-1 px-2 py-1 text-xs bg-purple-600/20 text-purple-300 rounded-full border border-purple-500/30"
									title={topic}
								>
									{showIcon && <TopicIcon className="w-3 h-3" />}
									<span>{topic}</span>
								</span>
							);
						})}
						{project.topics.length > 4 && (
							<span className="px-2 py-1 text-xs text-gray-400">
								+{project.topics.length - 4} more
							</span>
						)}
					</div>
				</div>
			)}

			{/* Technologies */}
			{project.technologies && project.technologies.length > 0 && (
				<div className="mb-4">
					<div className="flex flex-wrap gap-2">
						{project.technologies.slice(0, 4).map((tech, idx) => {
							const TechIcon = getTechnologyIcon(tech);
							return (
								<div
									key={idx}
									className="flex items-center space-x-1 px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full border border-blue-500/30 hover:bg-blue-600/30 transition-colors"
									title={tech}
								>
									<TechIcon className="w-3 h-3" />
									<span className="text-xs">{tech}</span>
								</div>
							);
						})}
						{project.technologies.length > 4 && (
							<span className="px-2 py-1 text-xs text-gray-400">
								+{project.technologies.length - 4} more
							</span>
						)}
					</div>
				</div>
			)}

			{/* Stats */}
			<div className="flex items-center justify-between text-sm text-gray-400 mb-4">
				<div className="flex items-center gap-4">
					{typeof project.stargazers_count === "number" && (
						<div className="flex items-center space-x-1">
							<StarIcon className="w-4 h-4" />
							<span>{project.stargazers_count}</span>
						</div>
					)}
					{typeof project.forks_count === "number" && (
						<div className="flex items-center space-x-1">
							<CodeBracketIcon className="w-4 h-4" />
							<span>{project.forks_count}</span>
						</div>
					)}
					{project.updated_at && (
						<div className="flex items-center space-x-1">
							<CalendarIcon className="w-4 h-4" />
							<span>{formatDate(project.updated_at)}</span>
						</div>
					)}
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex space-x-3 mt-auto">
				{/* GitHub Link */}
				{project.html_url && (
					<a
						href={project.html_url}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all duration-300 text-sm font-medium hover:scale-105 flex-1 justify-center"
					>
						<FaGithub className="w-4 h-4" />
						<span>Code</span>
					</a>
				)}

				{/* Live Demo Link */}
				{(project.homepage || project.liveUrl || project.demoUrl) && (
					<a
						href={project.homepage || project.liveUrl || project.demoUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 text-sm font-medium hover:scale-105 flex-1 justify-center"
					>
						<ArrowTopRightOnSquareIcon className="w-4 h-4" />
						<span>Live</span>
					</a>
				)}
			</div>

			{/* Featured Badge */}
			{project.featured && (
				<div className="absolute top-4 right-4">
					<span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
						Featured
					</span>
				</div>
			)}
		</motion.div>
	);
};

export default ProjectCard;
