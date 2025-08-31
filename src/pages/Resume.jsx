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
import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
	DocumentArrowDownIcon,
	AcademicCapIcon,
	BriefcaseIcon,
	CheckBadgeIcon,
	CodeBracketIcon,
	EyeIcon,
	ShieldCheckIcon,
	TrophyIcon,
	DocumentTextIcon,
	LanguageIcon,
	HeartIcon,
	RocketLaunchIcon,
	LinkIcon,
	GlobeAltIcon,
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
	FaVuejs,
	FaJava,
	FaDatabase,
	FaGithub,
} from "react-icons/fa";
import {
	SiJavascript,
	SiTypescript,
	SiMongodb,
	SiPostgresql,
	SiTailwindcss,
	SiExpress,
	SiRedis,
	SiGraphql,
	SiFirebase,
	SiVercel,
	SiStripe,
	SiNotion,
	SiFigma,
} from "react-icons/si";

const Resume = () => {
	const [settings, setSettings] = useState({});

	useEffect(() => {
		// Fetch settings for resume configuration
		fetch("/settings.json")
			.then((response) => response.json())
			.then((data) => setSettings(data))
			.catch((error) => console.warn("Could not fetch settings:", error));
	}, []);

	const getResumeUrl = () => {
		// 1. Check for environment variable (RESUME_LINK)
		const envResumeUrl = import.meta.env.RESUME_LINK;
		if (
			envResumeUrl &&
			typeof envResumeUrl === "string" &&
			envResumeUrl.trim() !== ""
		) {
			try {
				if (
					envResumeUrl.startsWith("http://") ||
					envResumeUrl.startsWith("https://")
				) {
					return new URL(envResumeUrl).href;
				}
				if (envResumeUrl.startsWith("/") || !envResumeUrl.includes(":")) {
					if (
						envResumeUrl.includes("javascript:") ||
						envResumeUrl.includes("data:") ||
						envResumeUrl.includes("vbscript:")
					) {
						return "/resume.pdf";
					}
					return envResumeUrl;
				}
				return "/resume.pdf";
			} catch {
				return "/resume.pdf";
			}
		}
		// 2. Fallback to settings.json logic
		const resumeConfig = settings.resume || {};
		let url;
		if (resumeConfig.type === "external" && resumeConfig.alternativeUrl) {
			url = resumeConfig.alternativeUrl;
		} else {
			url = resumeConfig.url || "/resume.pdf";
		}
		try {
			if (url.startsWith("http://") || url.startsWith("https://")) {
				return new URL(url).href;
			}
			if (url.startsWith("/") || !url.includes(":")) {
				if (
					url.includes("javascript:") ||
					url.includes("data:") ||
					url.includes("vbscript:")
				) {
					return "/resume.pdf";
				}
				return url;
			}
			return "/resume.pdf";
		} catch {
			return "/resume.pdf";
		}
	};

	const getResumeFilename = () => {
		const resumeConfig = settings.resume || {};
		const filename = resumeConfig.filename;

		// Sanitize filename to prevent XSS and ensure it's a valid filename
		if (!filename || typeof filename !== "string") {
			return undefined; // Let browser handle default naming
		}

		// Remove any dangerous characters and ensure it's a safe filename
		const sanitizedFilename = filename
			.replace(/[<>:"/\\|?*]/g, "") // Remove invalid filename characters
			.replace(/\.\./g, "") // Remove directory traversal attempts
			.trim();

		// Ensure filename is not empty after sanitization
		if (sanitizedFilename.length === 0) {
			return undefined;
		}

		return sanitizedFilename;
	};

	// Get work experience from settings
	const getExperiences = () => {
		return settings.resume?.experiences || [];
	};

	// Get education from settings
	const getEducation = () => {
		return settings.resume?.education || [];
	};

	// Icon mapping for converting string names to actual icon components
	const iconMap = {
		// Heroicons
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
		FaVuejs,
		FaJava,
		FaDatabase,
		FaGithub,
		// React Icons - SI
		SiJavascript,
		SiTypescript,
		SiMongodb,
		SiPostgresql,
		SiTailwindcss,
		SiExpress,
		SiRedis,
		SiGraphql,
		SiFirebase,
		SiVercel,
		SiStripe,
		SiNotion,
		SiFigma,
	};

	// Get icon component from string name
	const getIconComponent = (iconName) => {
		return iconMap[iconName];
	};

	// Get skills from settings
	const getSkills = () => {
		if (settings.resume?.skills?.length > 0) {
			return settings.resume.skills.map((category) => ({
				...category,
				items: category.items.map((item) => ({
					...item,
					icon: getIconComponent(item.icon),
				})),
			}));
		}
		return [];
	};

	// Get certifications from settings
	const getCertifications = () => {
		return settings.resume?.certifications || [];
	};

	// Get awards from settings
	const getAwards = () => {
		return settings.resume?.awards || [];
	};

	// Get publications from settings
	const getPublications = () => {
		return settings.resume?.publications || [];
	};

	// Get languages from settings
	const getLanguages = () => {
		return settings.resume?.languages || [];
	};

	// Get volunteer experience from settings
	const getVolunteerExperience = () => {
		return settings.resume?.volunteerExperience || [];
	};

	// Get personal projects from settings
	const getPersonalProjects = () => {
		return settings.resume?.personalProjects || [];
	};

	const experiences = getExperiences();
	const education = getEducation();
	const skills = getSkills();
	const certifications = getCertifications();
	const awards = getAwards();
	const publications = getPublications();
	const languages = getLanguages();
	const volunteerExperience = getVolunteerExperience();
	const personalProjects = getPersonalProjects();

	// Calculate total rewards from awards
	const calculateTotalRewards = () => {
		const totalRewardsConfig = settings.resume?.totalRewards;
		if (!totalRewardsConfig?.show) return null;

		const total = awards.reduce((sum, award) => {
			if (
				award.rewardAmount &&
				award.rewardAmount.currency === totalRewardsConfig.currency
			) {
				return sum + (award.rewardAmount.amount || 0);
			}
			return sum;
		}, 0);

		if (total === 0) return null;

		// Format the total amount
		const formatAmount = (amount, currency) => {
			switch (currency) {
				case "INR":
					return `₹${amount.toLocaleString("en-IN")}`;
				case "USD":
					return `$${amount.toLocaleString("en-US")}`;
				case "EUR":
					return `€${amount.toLocaleString("en-EU")}`;
				case "GBP":
					return `£${amount.toLocaleString("en-GB")}`;
				default:
					return `${amount.toLocaleString()} ${currency}`;
			}
		};

		return {
			total,
			displayText: formatAmount(total, totalRewardsConfig.currency),
			config: totalRewardsConfig,
		};
	};

	const totalRewards = calculateTotalRewards();

	// Get section order from settings
	const getSectionOrder = () => {
		return settings.resume?.sectionOrder || [];
	};

	// Section components mapping
	const renderSection = (sectionName) => {
		switch (sectionName) {
			case "experiences":
				return (
					experiences.length > 0 && (
						<motion.section
							key="experiences"
							className="mb-20"
							variants={fadeInUp}
						>
							<h2 className="text-3xl font-bold text-white mb-8 flex items-center">
								<BriefcaseIcon className="w-8 h-8 mr-3 text-purple-400" />
								{settings.resume?.experiencesHeading}
							</h2>
							<div className="space-y-8">
								{experiences.map((exp, index) => (
									<motion.div
										key={index}
										className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
										variants={fadeInUp}
										whileHover={{ scale: 1.01 }}
									>
										<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
											<div>
												{exp.title && (
													<h3 className="text-xl font-bold text-white">
														{exp.title}
													</h3>
												)}
												{exp.company && (
													<p className="text-purple-400 font-semibold">
														{exp.company}
													</p>
												)}
											</div>
											<div className="text-right text-gray-300">
												{exp.period && (
													<p className="font-semibold">{exp.period}</p>
												)}
												{exp.location && (
													<p className="text-sm">{exp.location}</p>
												)}
											</div>
										</div>
										{exp.description && exp.description.length > 0 && (
											<ul className="space-y-2">
												{exp.description.map((item, itemIndex) => (
													<li
														key={itemIndex}
														className="flex items-start text-gray-300"
													>
														<CheckBadgeIcon className="w-5 h-5 text-purple-400 mt-0.5 mr-2 flex-shrink-0" />
														{item}
													</li>
												))}
											</ul>
										)}
									</motion.div>
								))}
							</div>
						</motion.section>
					)
				);

			case "education":
				return (
					education.length > 0 && (
						<motion.section
							key="education"
							className="mb-20"
							variants={fadeInUp}
						>
							<h2 className="text-3xl font-bold text-white mb-8 flex items-center">
								<AcademicCapIcon className="w-8 h-8 mr-3 text-purple-400" />
								{settings.resume?.educationHeading}
							</h2>
							<div className="space-y-6">
								{education.map((edu, index) => (
									<motion.div
										key={index}
										className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
										variants={fadeInUp}
										whileHover={{ scale: 1.01 }}
									>
										<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
											<div>
												{edu.degree && (
													<h3 className="text-xl font-bold text-white">
														{edu.degree}
													</h3>
												)}
												{edu.field && (
													<p className="text-purple-400 font-semibold">
														{edu.field}
													</p>
												)}
												{edu.school && (
													<p className="text-gray-300">{edu.school}</p>
												)}
											</div>
											<div className="text-right text-gray-300">
												{edu.period && (
													<p className="font-semibold">{edu.period}</p>
												)}
												{edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
											</div>
										</div>
										{edu.achievements && edu.achievements.length > 0 && (
											<div>
												<h4 className="text-white font-semibold mb-2">
													Achievements:
												</h4>
												<ul className="space-y-1">
													{edu.achievements.map((achievement, achIndex) => (
														<li
															key={achIndex}
															className="flex items-start text-gray-300"
														>
															<CheckBadgeIcon className="w-4 h-4 text-purple-400 mt-0.5 mr-2 flex-shrink-0" />
															{achievement}
														</li>
													))}
												</ul>
											</div>
										)}
									</motion.div>
								))}
							</div>
						</motion.section>
					)
				);

			case "skills":
				return (
					skills.length > 0 && (
						<motion.section key="skills" className="mb-20" variants={fadeInUp}>
							<h2 className="text-3xl font-bold text-white mb-8">
								{settings.resume?.skillsHeading}
							</h2>
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								{skills.map((skillGroup, index) => (
									<motion.div
										key={index}
										className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
										variants={fadeInUp}
										whileHover={{ scale: 1.02 }}
									>
										<h3 className="text-lg font-bold text-white mb-4">
											{skillGroup.category}
										</h3>
										<div className="flex flex-wrap gap-2">
											{skillGroup.items.map((skill, skillIndex) => {
												const IconComponent = skill.icon;
												return (
													<span
														key={skillIndex}
														className="flex items-center px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-500/30 hover:bg-purple-600/30 transition-colors duration-300"
													>
														{IconComponent && (
															<IconComponent
																className={`w-4 h-4 mr-2 ${
																	skill.color || "text-purple-300"
																}`}
															/>
														)}
														{skill.name}
													</span>
												);
											})}
										</div>
									</motion.div>
								))}
							</div>
						</motion.section>
					)
				);

			case "personalProjects":
				return (
					personalProjects.length > 0 && (
						<motion.section
							key="personalProjects"
							className="mb-20"
							variants={fadeInUp}
						>
							<h2 className="text-3xl font-bold text-white mb-8 flex items-center">
								<RocketLaunchIcon className="w-8 h-8 mr-3 text-purple-400" />
								{settings.resume?.personalProjectsHeading}
							</h2>
							<div className="grid md:grid-cols-2 gap-8">
								{personalProjects.map((project, index) => (
									<motion.div
										key={index}
										className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
										variants={fadeInUp}
										whileHover={{ scale: 1.02 }}
									>
										<div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
											<div className="flex-1">
												{project.name && (
													<h3 className="text-xl font-bold text-white mb-2">
														{project.name}
													</h3>
												)}
											</div>
											{project.period && (
												<span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm font-semibold">
													{project.period}
												</span>
											)}
										</div>

										{project.description && (
											<p className="text-gray-300 mb-4 leading-relaxed">
												{project.description}
											</p>
										)}

										{project.technologies &&
											project.technologies.length > 0 && (
												<div className="mb-4">
													<h4 className="text-sm font-semibold text-gray-200 mb-2">
														Technologies:
													</h4>
													<div className="flex flex-wrap gap-2">
														{project.technologies.map((tech, techIndex) => {
															// Handle both string and object formats for backward compatibility
															const techName =
																typeof tech === "string" ? tech : tech.name;
															const techIcon =
																typeof tech === "object"
																	? getIconComponent(tech.icon)
																	: null;
															const techColor =
																typeof tech === "object"
																	? tech.color
																	: "text-purple-300";

															return (
																<span
																	key={techIndex}
																	className="flex items-center px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs border border-purple-500/30 hover:bg-purple-600/30 transition-colors duration-300"
																>
																	{techIcon && (
																		<techIcon
																			className={`w-3 h-3 mr-1 ${techColor}`}
																		/>
																	)}
																	{techName}
																</span>
															);
														})}
													</div>
												</div>
											)}

										{/* Project Links */}
										<div className="flex flex-wrap gap-2">
											{project.githubUrl && (
												<a
													href={project.githubUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center px-3 py-2 bg-gray-700/50 text-gray-300 rounded-lg text-sm border border-gray-600/50 hover:bg-gray-600/50 hover:text-white transition-all duration-300"
												>
													<FaGithub className="w-4 h-4 mr-2" />
													GitHub
												</a>
											)}
											{project.liveUrl && (
												<a
													href={project.liveUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center px-3 py-2 bg-green-600/20 text-green-300 rounded-lg text-sm border border-green-500/30 hover:bg-green-600/30 transition-all duration-300"
												>
													<GlobeAltIcon className="w-4 h-4 mr-2" />
													Live Demo
												</a>
											)}
											{project.demoUrl && (
												<a
													href={project.demoUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center px-3 py-2 bg-blue-600/20 text-blue-300 rounded-lg text-sm border border-blue-500/30 hover:bg-blue-600/30 transition-all duration-300"
												>
													<EyeIcon className="w-4 h-4 mr-2" />
													Demo
												</a>
											)}
											{project.documentationUrl && (
												<a
													href={project.documentationUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center px-3 py-2 bg-orange-600/20 text-orange-300 rounded-lg text-sm border border-orange-500/30 hover:bg-orange-600/30 transition-all duration-300"
												>
													<DocumentTextIcon className="w-4 h-4 mr-2" />
													Docs
												</a>
											)}
										</div>
									</motion.div>
								))}
							</div>
						</motion.section>
					)
				);

			case "certifications":
				return (
					certifications.length > 0 && (
						<motion.section
							key="certifications"
							className="mb-20"
							variants={fadeInUp}
						>
							<h2 className="text-3xl font-bold text-white mb-8">
								{settings.resume?.certificationsHeading}
							</h2>
							<div className="grid md:grid-cols-2 gap-6">
								{certifications.map((cert, index) => (
									<motion.div
										key={index}
										className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
										variants={fadeInUp}
										whileHover={{ scale: 1.02 }}
									>
										{cert.name && (
											<h3 className="text-lg font-bold text-white mb-2">
												{cert.name}
											</h3>
										)}
										{cert.issuer && (
											<p className="text-purple-400 font-semibold mb-1">
												{cert.issuer}
											</p>
										)}
										{cert.date && (
											<p className="text-gray-300 text-sm mb-2">
												Issued: {cert.date}
											</p>
										)}
										{cert.credentialId && (
											<p className="text-gray-400 text-xs mb-3">
												Credential ID: {cert.credentialId}
											</p>
										)}

										{/* Certification Links */}
										{(cert.certificateUrl || cert.verificationUrl) && (
											<div className="flex flex-wrap gap-2 mt-3">
												{cert.certificateUrl && (
													<a
														href={cert.certificateUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs border border-purple-500/30 hover:bg-purple-600/30 transition-colors duration-300"
													>
														<EyeIcon className="w-3 h-3 mr-1" />
														View Certificate
													</a>
												)}
												{cert.verificationUrl && (
													<a
														href={cert.verificationUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-xs border border-green-500/30 hover:bg-green-600/30 transition-colors duration-300"
													>
														<ShieldCheckIcon className="w-3 h-3 mr-1" />
														Verify
													</a>
												)}
											</div>
										)}
									</motion.div>
								))}
							</div>
						</motion.section>
					)
				);

			case "awards":
				return (
					awards.length > 0 && (
						<motion.section key="awards" className="mb-20" variants={fadeInUp}>
							<h2 className="text-3xl font-bold text-white mb-8 flex items-center">
								<TrophyIcon className="w-8 h-8 mr-3 text-purple-400" />
								{settings.resume?.awardsHeading}
							</h2>
							<div className="space-y-6">
								{awards.map((award, index) => (
									<motion.div
										key={index}
										className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
										variants={fadeInUp}
										whileHover={{ scale: 1.01 }}
									>
										<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
											<div className="flex-1">
												{award.name && (
													<h3 className="text-xl font-bold text-white">
														{award.name}
													</h3>
												)}
												{award.organization && (
													<p className="text-purple-400 font-semibold">
														{award.organization}
													</p>
												)}
												{award.location && (
													<p className="text-gray-400 text-sm mt-1">
														📍 {award.location}
													</p>
												)}
											</div>
											<div className="flex flex-col md:items-end mt-3 md:mt-0">
												{award.date && (
													<p className="text-gray-300 font-semibold">
														{award.date}
													</p>
												)}
												{award.rewardAmount && (
													<div className="flex items-center mt-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
														<TrophyIcon className="w-4 h-4 mr-1" />
														{award.rewardAmount.displayText}
													</div>
												)}
											</div>
										</div>
										{award.description && (
											<p className="text-gray-300 mb-3">{award.description}</p>
										)}

										{/* Award Links */}
										{(award.verificationUrl || award.certificateUrl) && (
											<div className="flex flex-wrap gap-2 mt-3">
												{award.verificationUrl && (
													<a
														href={award.verificationUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs border border-blue-500/30 hover:bg-blue-600/30 transition-colors duration-300"
													>
														<ShieldCheckIcon className="w-3 h-3 mr-1" />
														Verify Award
													</a>
												)}
												{award.certificateUrl && (
													<a
														href={award.certificateUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs border border-purple-500/30 hover:bg-purple-600/30 transition-colors duration-300"
													>
														<EyeIcon className="w-3 h-3 mr-1" />
														View Certificate
													</a>
												)}
											</div>
										)}
									</motion.div>
								))}
							</div>
						</motion.section>
					)
				);

			case "publications":
				return (
					publications.length > 0 && (
						<motion.section
							key="publications"
							className="mb-20"
							variants={fadeInUp}
						>
							<h2 className="text-3xl font-bold text-white mb-8 flex items-center">
								<DocumentTextIcon className="w-8 h-8 mr-3 text-purple-400" />
								{settings.resume?.publicationsHeading}
							</h2>
							<div className="space-y-6">
								{publications.map((publication, index) => (
									<motion.div
										key={index}
										className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
										variants={fadeInUp}
										whileHover={{ scale: 1.01 }}
									>
										<div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
											<div className="flex-1">
												{publication.title && (
													<h3 className="text-xl font-bold text-white mb-2">
														{publication.title}
													</h3>
												)}
												<div className="flex flex-wrap gap-2 mb-2">
													{publication.type && (
														<span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs">
															{publication.type}
														</span>
													)}
													{publication.publisher && (
														<span className="text-gray-300 text-sm">
															{publication.publisher}
														</span>
													)}
												</div>
											</div>
											{publication.date && (
												<p className="text-gray-300 font-semibold">
													{publication.date}
												</p>
											)}
										</div>
										{publication.description && (
											<p className="text-gray-300 mb-3">
												{publication.description}
											</p>
										)}
										{publication.url && (
											<a
												href={publication.url}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs border border-purple-500/30 hover:bg-purple-600/30 transition-colors duration-300"
											>
												<LinkIcon className="w-3 h-3 mr-1" />
												View Publication
											</a>
										)}
									</motion.div>
								))}
							</div>
						</motion.section>
					)
				);

			case "languages":
				return (
					languages.length > 0 && (
						<motion.section
							key="languages"
							className="mb-20"
							variants={fadeInUp}
						>
							<h2 className="text-3xl font-bold text-white mb-8 flex items-center">
								<LanguageIcon className="w-8 h-8 mr-3 text-purple-400" />
								{settings.resume?.languagesHeading}
							</h2>
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								{languages.map((language, index) => (
									<motion.div
										key={index}
										className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
										variants={fadeInUp}
										whileHover={{ scale: 1.02 }}
									>
										{language.name && (
											<h3 className="text-lg font-bold text-white mb-2">
												{language.name}
											</h3>
										)}
										{language.proficiency && (
											<p className="text-purple-400 font-semibold mb-1">
												{language.proficiency}
											</p>
										)}
										{language.level && (
											<span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs">
												{language.level}
											</span>
										)}
									</motion.div>
								))}
							</div>
						</motion.section>
					)
				);

			case "volunteerExperience":
				return (
					volunteerExperience.length > 0 && (
						<motion.section
							key="volunteerExperience"
							className="mb-20"
							variants={fadeInUp}
						>
							<h2 className="text-3xl font-bold text-white mb-8 flex items-center">
								<HeartIcon className="w-8 h-8 mr-3 text-purple-400" />
								{settings.resume?.volunteerExperienceHeading}
							</h2>
							<div className="space-y-8">
								{volunteerExperience.map((volunteer, index) => (
									<motion.div
										key={index}
										className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
										variants={fadeInUp}
										whileHover={{ scale: 1.01 }}
									>
										<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
											<div>
												{volunteer.role && (
													<h3 className="text-xl font-bold text-white">
														{volunteer.role}
													</h3>
												)}
												{volunteer.organization && (
													<p className="text-purple-400 font-semibold">
														{volunteer.organization}
													</p>
												)}
											</div>
											{volunteer.period && (
												<p className="text-gray-300 font-semibold">
													{volunteer.period}
												</p>
											)}
										</div>
										{volunteer.description &&
											volunteer.description.length > 0 && (
												<ul className="space-y-2">
													{volunteer.description.map((item, itemIndex) => (
														<li
															key={itemIndex}
															className="flex items-start text-gray-300"
														>
															<CheckBadgeIcon className="w-5 h-5 text-purple-400 mt-0.5 mr-2 flex-shrink-0" />
															{item}
														</li>
													))}
												</ul>
											)}
									</motion.div>
								))}
							</div>
						</motion.section>
					)
				);

			default:
				return null;
		}
	};

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
					<motion.div className="text-center mb-16" variants={fadeInUp}>
						<h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
							Resume
						</h1>
						<p className="text-xl text-gray-300 mb-8">
							My professional journey and qualifications
						</p>
						<motion.a
							// URL is sanitized in getResumeUrl() function to prevent XSS
							href={getResumeUrl()}
							download={getResumeFilename()}
							target={
								settings.resume?.type === "external" ? "_blank" : undefined
							}
							rel={
								settings.resume?.type === "external"
									? "noopener noreferrer"
									: undefined
							}
							className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<DocumentArrowDownIcon className="w-5 h-5 mr-2" />
							{settings.resume?.type === "external"
								? "View Resume"
								: "Download PDF"}
						</motion.a>
					</motion.div>

					{/* Total Rewards Section */}
					{totalRewards && (
						<motion.div className="text-center mb-12" variants={fadeInUp}>
							<div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-white rounded-2xl p-6 max-w-md mx-auto shadow-lg hover:shadow-yellow-500/25 transition-all duration-300">
								<div className="flex items-center justify-center mb-2">
									<TrophyIcon className="w-8 h-8 mr-2" />
									<h2 className="text-2xl font-bold">
										{totalRewards.config.heading}
									</h2>
								</div>
								<p className="text-3xl font-extrabold">
									{totalRewards.displayText}
								</p>
								<p className="text-yellow-100 text-sm mt-2">
									Across {awards.filter((award) => award.rewardAmount).length}{" "}
									competitions
								</p>
							</div>
						</motion.div>
					)}

					{/* Dynamic Sections based on configuration */}
					{getSectionOrder().map((sectionName) => renderSection(sectionName))}
				</motion.div>
			</div>
		</div>
	);
};

export default Resume;
