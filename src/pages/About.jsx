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

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
	CodeBracketIcon,
	CpuChipIcon,
	ServerIcon,
	DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import {
	FaReact,
	FaNodeJs,
	FaPython,
	FaGitAlt,
	FaDocker,
	FaAws,
	FaHtml5,
	FaCss3Alt,
	FaJsSquare,
	FaVuejs,
	FaAngular,
	FaPhp,
	FaJava,
	FaDatabase,
	FaGithub,
} from "react-icons/fa";
import { BiLogoVisualStudio } from "react-icons/bi";
import {
	SiJavascript,
	SiTypescript,
	SiMongodb,
	SiPostgresql,
	SiTailwindcss,
	SiExpress,
	SiNextdotjs,
	SiNestjs,
	SiRedis,
	SiGraphql,
	SiKubernetes,
	SiLinux,
	SiGit,
	SiFirebase,
	SiVercel,
	SiNetlify,
	SiVite,
	SiFramer,
	SiBootstrap,
	SiTensorflow,
	SiOpencv,
	SiGoogle,
	SiScikitlearn,
	SiPandas,
	SiNumpy,
	SiSqlite,
	SiRender,
	SiDjango,
	SiFastapi,
	SiOracle,
	SiJupyter,
	SiPostman,
	SiHiveBlockchain,
	SiEthereum,
	SiWeb3Dotjs,
	SiBitcoin,
	SiGithubactions,
	SiFlask,
} from "react-icons/si";

const About = () => {
	const [settings, setSettings] = useState({});
	const [truncatedSkills, setTruncatedSkills] = useState(new Set());
	const skillRefs = useRef({});
	// Remove useMasonry hook - using pure CSS masonry instead

	useEffect(() => {
		// Fetch settings for about page configuration
		fetch("/settings.json")
			.then((response) => response.json())
			.then((data) => setSettings(data))
			.catch((error) => console.warn("Could not fetch settings:", error));
	}, []);

	// Check for text truncation
	useEffect(() => {
		const checkTruncation = () => {
			const truncated = new Set();
			Object.entries(skillRefs.current).forEach(([key, ref]) => {
				if (ref && ref.scrollWidth > ref.clientWidth) {
					truncated.add(key);
				}
			});
			setTruncatedSkills(truncated);
		};

		// Check initially and on window resize
		checkTruncation();
		window.addEventListener("resize", checkTruncation);
		return () => window.removeEventListener("resize", checkTruncation);
	}, [settings]);

	// Get image URL based on settings
	const getImageUrl = () => {
		const aboutConfig = settings.about || {};
		const displayConfig = settings.display || {};

		if (aboutConfig.image?.type === "custom" && aboutConfig.image?.customUrl) {
			return aboutConfig.image.customUrl;
		} else if (
			aboutConfig.image?.type === "home" &&
			displayConfig.profileImage
		) {
			return displayConfig.profileImage;
		} else {
			// Default to GitHub profile image
			return displayConfig.profileImage || "https://github.com/VKrishna04.png";
		}
	};

	// Icon mapping for converting string names to actual icon components
	const iconMap = {
		// Heroicons
		DevicePhoneMobileIcon,
		ServerIcon,
		CpuChipIcon,
		CodeBracketIcon,
		// React Icons - FA
		FaReact,
		FaNodeJs,
		FaPython,
		FaGitAlt,
		FaDocker,
		FaAws,
		FaHtml5,
		FaCss3Alt,
		FaJsSquare,
		FaVuejs,
		FaAngular,
		FaPhp,
		FaJava,
		FaDatabase,
		FaGithub,
		// React Icons - BI
		BiLogoVisualStudio,
		// React Icons - SI
		SiJavascript,
		SiTypescript,
		SiMongodb,
		SiPostgresql,
		SiTailwindcss,
		SiExpress,
		SiNextdotjs,
		SiNestjs,
		SiRedis,
		SiGraphql,
		SiKubernetes,
		SiLinux,
		SiGit,
		SiFirebase,
		SiVercel,
		SiNetlify,
		SiVite,
		SiFramer,
		SiBootstrap,
		SiTensorflow,
		SiOpencv,
		SiGoogle,
		SiScikitlearn,
		SiPandas,
		SiNumpy,
		SiSqlite,
		SiRender,
		SiDjango,
		SiFastapi,
		SiOracle,
		SiJupyter,
		SiPostman,
		SiHiveBlockchain,
		SiEthereum,
		SiWeb3Dotjs,
		SiBitcoin,
		SiGithubactions,
		SiFlask,
	};

	// Get icon component from string name
	const getIconComponent = (iconName) => {
		return iconMap[iconName] || CodeBracketIcon; // fallback icon
	};

	// Get skills from settings or use default
	const getSkills = () => {
		if (settings.about?.skills?.length > 0) {
			return settings.about.skills.map((category) => ({
				...category,
				icon: getIconComponent(category.icon),
				items: category.items.map((item) => ({
					...item,
					icon: getIconComponent(item.icon),
				})),
			}));
		}

		// Return empty array if not configured
		return [];
	};

	// Get stats from settings or use default
	const getStats = () => {
		return settings.about?.stats || [];
	};

	// Get featured projects from settings or use default
	const getFeaturedProjects = () => {
		// Get projects with showInAbout: true from staticProjects
		const projects =
			settings.projects?.staticProjects?.filter(
				(project) => project.showInAbout === true
			) || [];

		// Get styling config
		const stylingConfig = settings.projects?.featuredProjectsConfig || {};

		// Map projects to include their styling
		return projects.map((project) => {
			const styling = stylingConfig[project.name] || {};
			return {
				name: project.name,
				title: project.name,
				description: project.description,
				icon: styling.icon || "CodeBracketIcon",
				gradient:
					styling.gradient ||
					"bg-gradient-to-br from-gray-600/20 to-gray-600/20",
				borderColor: styling.borderColor || "border-gray-500/30",
				hoverBorderColor:
					styling.hoverBorderColor || "hover:border-gray-400/50",
				bgColor: styling.bgColor || "bg-gray-500/20",
				hoverBgColor: styling.hoverBgColor || "group-hover:bg-gray-500/30",
				iconColor: styling.iconColor || "text-gray-400",
				textColor: styling.textColor || "text-gray-200",
			};
		});
	};

	const skills = getSkills();
	const stats = getStats();
	const featuredProjects = getFeaturedProjects();

	const fadeInUp = {
		initial: { opacity: 0, y: 60 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.6 },
	};

	const staggerContainer = {
		animate: {
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	return (
		<div className="min-h-screen py-20 px-4">
			<div className="max-w-6xl mx-auto">
				<motion.div
					variants={staggerContainer}
					initial="initial"
					animate="animate"
				>
					{/* Header */}
					{(settings.about?.heading || settings.about?.subheading) && (
						<motion.div className="text-center mb-16" variants={fadeInUp}>
							{settings.about?.heading && (
								<h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
									{settings.about.heading}
								</h1>
							)}
							{settings.about?.subheading && (
								<p className="text-xl text-gray-300">
									{settings.about.subheading}
								</p>
							)}
						</motion.div>
					)}
					{/* Main Content */}
					{(settings.about?.title ||
						settings.about?.paragraphs?.length > 0 ||
						settings.about?.image) && (
						<div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
							{/* Left Column - Text */}
							{(settings.about?.title ||
								settings.about?.paragraphs?.length > 0) && (
								<motion.div variants={fadeInUp}>
									{settings.about?.title && (
										<h2 className="text-3xl font-bold text-white mb-6">
											{settings.about.title}
										</h2>
									)}
									{settings.about?.paragraphs?.length > 0 && (
										<div className="space-y-4 text-gray-300 text-lg leading-relaxed">
											{settings.about.paragraphs.map((paragraph, index) => (
												<p key={index}>{paragraph}</p>
											))}
										</div>
									)}
								</motion.div>
							)}

							{/* Right Column - Image */}
							{settings.about?.image && (
								<motion.div className="flex justify-center" variants={fadeInUp}>
									<div className="relative">
										<div className="w-80 h-80 rounded-full overflow-hidden border-4 border-purple-500/30 shadow-2xl shadow-purple-500/20">
											<img
												src={getImageUrl()}
												alt={settings.about?.image?.altText || "Profile"}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/10 to-pink-500/10"></div>
									</div>
								</motion.div>
							)}
						</div>
					)}
					{/* Skills Section */}
					{skills.length > 0 && (
						<motion.div variants={fadeInUp}>
							<h2 className="text-3xl font-bold text-center text-white mb-12">
								{settings.about?.skillsHeading || "Technical Skills"}
							</h2>
							<div
								className={
									settings.about?.skillsLayout === "masonry"
										? "masonry-grid-about"
										: `grid gap-6 ${
												settings.about?.skillsGridColumns?.mobile ||
												"grid-cols-1"
										  } ${
												settings.about?.skillsGridColumns?.tablet ||
												"md:grid-cols-2"
										  } ${
												settings.about?.skillsGridColumns?.desktop ||
												"lg:grid-cols-3"
										  }`
								}
							>
								{skills.map((skillCategory, index) => (
									<motion.div
										key={index}
										className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group ${
											settings.about?.skillsLayout === "masonry"
												? "masonry-item-about"
												: ""
										}`}
										variants={fadeInUp}
										whileHover={{ scale: 1.02, y: -5 }}
									>
										<div className="flex items-center mb-4">
											<div className="p-2 bg-purple-500/20 rounded-lg mr-3 group-hover:bg-purple-500/30 transition-colors">
												<skillCategory.icon className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
											</div>
											<h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
												{skillCategory.category}
											</h3>
										</div>
										<div className="grid grid-cols-2 gap-3">
											{skillCategory.items.map((skill, skillIndex) => {
												const skillKey = `${index}-${skillIndex}`;
												const isTruncated = truncatedSkills.has(skillKey);

												return (
													<div
														key={skillIndex}
														className="relative flex items-center space-x-2 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-300 group/skill cursor-pointer"
													>
														<div className="flex-shrink-0">
															<skill.icon
																className={`w-5 h-5 ${skill.color} group-hover/skill:scale-110 transition-transform`}
															/>
														</div>
														<span
															ref={(el) => (skillRefs.current[skillKey] = el)}
															className="text-gray-300 text-sm font-medium truncate group-hover/skill:text-white transition-colors"
														>
															{skill.name}
														</span>
														{/* Enhanced tooltip - only show when text is truncated */}
														{isTruncated && (
															<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover/skill:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-10 border border-purple-500/30 flex items-center gap-2">
																<skill.icon
																	className={`w-4 h-4 ${skill.color}`}
																/>
																<span>{skill.name}</span>
																<div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
															</div>
														)}
													</div>
												);
											})}
										</div>
									</motion.div>
								))}
							</div>
						</motion.div>
					)}{" "}
					{/* Achievements Section */}
					<motion.div className="mt-20" variants={fadeInUp}>
						<h2 className="text-3xl font-bold text-center text-white mb-12">
							{settings.about?.featuredProjectsHeading ||
								"Featured Projects & Achievements"}
						</h2>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{featuredProjects.length > 0 ? (
								featuredProjects.map((project, index) => {
									const IconComponent = getIconComponent(project.icon);
									return (
										<motion.div
											key={index}
											className={`${project.gradient} backdrop-blur-sm rounded-xl p-6 border ${project.borderColor} ${project.hoverBorderColor} transition-all duration-300 group`}
											variants={fadeInUp}
											whileHover={{ scale: 1.02, y: -5 }}
										>
											<div className="text-center">
												<div
													className={`w-16 h-16 ${project.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 ${project.hoverBgColor} transition-colors`}
												>
													<IconComponent
														className={`w-8 h-8 ${project.iconColor}`}
													/>
												</div>
												<h3 className="text-xl font-bold text-white mb-2">
													{project.title}
												</h3>
												<p className={`${project.textColor} text-sm`}>
													{project.description}
												</p>
											</div>
										</motion.div>
									);
								})
							) : (
								// Default projects if not configured
								<>
									<motion.div
										className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group"
										variants={fadeInUp}
										whileHover={{ scale: 1.02, y: -5 }}
									>
										<div className="text-center">
											<div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
												<SiTensorflow className="w-8 h-8 text-purple-400" />
											</div>
											<h3 className="text-xl font-bold text-white mb-2">
												EquiLens - AI Bias Detection
											</h3>
											<p className="text-purple-200 text-sm">
												AI Bias Detection Platform for LLMs via Ollama.
												Interactive CLI with corpus generation, multi-metric
												auditing, statistical analysis & visualization.
											</p>
										</div>
									</motion.div>

									<motion.div
										className="bg-gradient-to-br from-green-600/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 group"
										variants={fadeInUp}
										whileHover={{ scale: 1.02, y: -5 }}
									>
										<div className="text-center">
											<div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30 transition-colors">
												<SiOpencv className="w-8 h-8 text-green-400" />
											</div>
											<h3 className="text-xl font-bold text-white mb-2">
												Facial Emotion Detection
											</h3>
											<p className="text-green-200 text-sm">
												Real-time emotion detection using MediaPipe and machine
												learning. Extract facial landmarks, train models, and
												classify emotions from images and videos.
											</p>
										</div>
									</motion.div>

									<motion.div
										className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 group"
										variants={fadeInUp}
										whileHover={{ scale: 1.02, y: -5 }}
									>
										<div className="text-center">
											<div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/30 transition-colors">
												<SiHiveBlockchain className="w-8 h-8 text-orange-400" />
											</div>
											<h3 className="text-xl font-bold text-white mb-2">
												HiveXplore - Blockchain Gateway
											</h3>
											<p className="text-orange-200 text-sm">
												Beginner-friendly app for Hive blockchain with
												simplified authentication, intuitive posting tools, and
												guided experiences for blockchain newcomers.
											</p>
										</div>
									</motion.div>

									<motion.div
										className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 group"
										variants={fadeInUp}
										whileHover={{ scale: 1.02, y: -5 }}
									>
										<div className="text-center">
											<div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-cyan-500/30 transition-colors">
												<BiLogoVisualStudio className="w-8 h-8 text-cyan-400" />
											</div>
											<h3 className="text-xl font-bold text-white mb-2">
												VS Code Extensions
											</h3>
											<p className="text-cyan-200 text-sm">
												Published extensions including cSpell Sync and Global
												Save State, improving developer productivity with 2K+
												total downloads on VS Code Marketplace.
											</p>
										</div>
									</motion.div>

									<motion.div
										className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 group"
										variants={fadeInUp}
										whileHover={{ scale: 1.02, y: -5 }}
									>
										<div className="text-center">
											<div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-500/30 transition-colors">
												<SiGoogle className="w-8 h-8 text-yellow-400" />
											</div>
											<h3 className="text-xl font-bold text-white mb-2">
												RanobeGemini Extension
											</h3>
											<p className="text-yellow-200 text-sm">
												Browser extension enhancing web novel translations using
												Google's Gemini AI. Transforms poorly translated content
												with intelligent processing.
											</p>
										</div>
									</motion.div>

									<motion.div
										className="bg-gradient-to-br from-pink-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-pink-500/30 hover:border-pink-400/50 transition-all duration-300 group"
										variants={fadeInUp}
										whileHover={{ scale: 1.02, y: -5 }}
									>
										<div className="text-center">
											<div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-500/30 transition-colors">
												<FaAws className="w-8 h-8 text-pink-400" />
											</div>
											<h3 className="text-xl font-bold text-white mb-2">
												Cloud Infrastructure
											</h3>
											<p className="text-pink-200 text-sm">
												Achieved multiple cloud certifications including AWS
												Cloud Practitioner and Oracle Cloud DevOps Professional,
												with hands-on deployment experience.
											</p>
										</div>
									</motion.div>
								</>
							)}
						</div>
					</motion.div>
					{/* Stats Section */}
					{stats.length > 0 && (
						<motion.div
							className={`mt-20 grid gap-6 ${
								stats.length <= 2
									? "grid-cols-1 md:grid-cols-2"
									: stats.length === 3
									? "grid-cols-1 md:grid-cols-3"
									: stats.length === 4
									? "grid-cols-2 md:grid-cols-4"
									: stats.length === 5
									? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
									: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
							}`}
							variants={fadeInUp}
						>
							{stats.map((stat, index) => (
								<motion.div
									key={index}
									className="text-center p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group"
									whileHover={{ scale: 1.05, y: -5 }}
									transition={{ duration: 0.2 }}
								>
									<div className="text-3xl lg:text-4xl font-bold text-purple-400 mb-2 group-hover:text-purple-300 transition-colors">
										{stat.number}
									</div>
									<div className="text-gray-300 group-hover:text-white transition-colors font-medium">
										{stat.label}
									</div>
								</motion.div>
							))}
						</motion.div>
					)}
				</motion.div>
			</div>
		</div>
	);
};

export default About;
