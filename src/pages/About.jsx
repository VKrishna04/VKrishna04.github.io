// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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
} from "react-icons/fa";
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
} from "react-icons/si";

const About = () => {
	const [settings, setSettings] = useState({});

	useEffect(() => {
		// Fetch settings for about page configuration
		fetch("/settings.json")
			.then((response) => response.json())
			.then((data) => setSettings(data))
			.catch((error) => console.warn("Could not fetch settings:", error));
	}, []);

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

	const skills = getSkills();
	const stats = getStats();

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
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
								{skills.map((skillCategory, index) => (
									<motion.div
										key={index}
										className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
										variants={fadeInUp}
										whileHover={{ scale: 1.02 }}
									>
										<div className="flex items-center mb-4">
											<skillCategory.icon className="w-8 h-8 text-purple-400 mr-3" />
											<h3 className="text-xl font-semibold text-white">
												{skillCategory.category}
											</h3>
										</div>
										<div className="grid grid-cols-2 gap-3">
											{skillCategory.items.map((skill, skillIndex) => (
												<div
													key={skillIndex}
													className="flex items-center space-x-2 p-2 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
												>
													<skill.icon className={`w-5 h-5 ${skill.color}`} />
													<span className="text-gray-300 text-sm">
														{skill.name}
													</span>
												</div>
											))}
										</div>
									</motion.div>
								))}
							</div>
						</motion.div>
					)}

					{/* Stats Section */}
					{stats.length > 0 && (
						<motion.div
							className={`mt-20 grid gap-6 ${
								stats.length <= 2
									? "grid-cols-1 md:grid-cols-2"
									: stats.length === 3
									? "grid-cols-1 md:grid-cols-3"
									: "grid-cols-2 md:grid-cols-4"
							}`}
							variants={fadeInUp}
						>
							{stats.map((stat, index) => (
								<motion.div
									key={index}
									className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700/50"
									whileHover={{ scale: 1.05 }}
								>
									<div className="text-3xl font-bold text-purple-400 mb-2">
										{stat.number}
									</div>
									<div className="text-gray-300">{stat.label}</div>
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
