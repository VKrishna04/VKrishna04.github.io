import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
	StarIcon,
	EyeIcon,
	CodeBracketIcon,
	ArrowTopRightOnSquareIcon,
	CalendarIcon,
	DocumentTextIcon,
	GlobeAltIcon,
} from "@heroicons/react/24/outline";
import {
	FaGithub,
	FaJs,
	FaPython,
	FaReact,
	FaVuejs,
	FaJava,
	FaPhp,
	FaSwift,
	FaRust,
	FaHtml5,
	FaCss3Alt,
} from "react-icons/fa";
import {
	SiTypescript,
	SiGo,
	SiKotlin,
	SiDart,
	SiCplusplus,
	SiC,
	SiRuby,
	SiShell,
	SiTailwindcss,
	SiMongodb,
	SiNextdotjs,
} from "react-icons/si";

const ProjectCard = ({ project }) => {
	// Icon mapping for technologies
	const getLanguageIcon = (language) => {
		const iconMap = {
			JavaScript: FaJs,
			TypeScript: SiTypescript,
			Python: FaPython,
			Java: FaJava,
			PHP: FaPhp,
			Go: SiGo,
			Rust: FaRust,
			Swift: FaSwift,
			Kotlin: SiKotlin,
			Dart: SiDart,
			HTML: FaHtml5,
			CSS: FaCss3Alt,
			"C++": SiCplusplus,
			C: SiC,
			Ruby: SiRuby,
			Shell: SiShell,
			Vue: FaVuejs,
			React: FaReact,
			"Node.js": FaReact,
			"Tailwind CSS": SiTailwindcss,
			MongoDB: SiMongodb,
			"Next.js": SiNextdotjs,
		};
		return iconMap[language];
	};

	const getLanguageColor = (language) => {
		const colors = {
			JavaScript: "#f1e05a",
			TypeScript: "#2b7489",
			Python: "#3572a5",
			HTML: "#e34c26",
			CSS: "#563d7c",
			Java: "#b07219",
			"C++": "#f34b7d",
			C: "#555555",
			PHP: "#4f5d95",
			Ruby: "#701516",
			Go: "#00add8",
			Rust: "#dea584",
			Swift: "#ffac45",
			Kotlin: "#f18e33",
			Dart: "#00b4ab",
			Shell: "#89e051",
			Vue: "#2c3e50",
			React: "#61dafb",
		};
		return colors[language] || "#6366f1";
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const formatCount = (count) => {
		if (count >= 1000000) {
			return `${(count / 1000000).toFixed(1)}M`;
		} else if (count >= 1000) {
			return `${(count / 1000).toFixed(1)}K`;
		}
		return count.toString();
	};

	const cardVariants = {
		initial: { opacity: 0, y: 30 },
		animate: { opacity: 1, y: 0 },
	};

	return (
		<motion.div
			variants={cardVariants}
			className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group"
			whileHover={{
				y: -8,
				transition: { duration: 0.2 },
			}}
		>
			<div className="p-6">
				{/* Header */}
				<div className="flex items-start justify-between mb-4">
					<div className="flex-1">
						<h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
							{project.name}
						</h3>
						<p className="text-gray-300 text-sm line-clamp-3 mb-3">
							{project.description}
						</p>
					</div>
					<div className="flex gap-2 ml-4">
						{project.html_url && (
							<motion.a
								href={project.html_url}
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 rounded-lg bg-gray-700/50 hover:bg-purple-600/20 text-gray-400 hover:text-purple-400 transition-all duration-200"
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
							>
								<FaGithub className="w-4 h-4" />
							</motion.a>
						)}
						{(project.homepage || project.liveUrl) && (
							<motion.a
								href={project.homepage || project.liveUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 rounded-lg bg-gray-700/50 hover:bg-blue-600/20 text-gray-400 hover:text-blue-400 transition-all duration-200"
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
							>
								<ArrowTopRightOnSquareIcon className="w-4 h-4" />
							</motion.a>
						)}
						{project.demoUrl && (
							<motion.a
								href={project.demoUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 rounded-lg bg-gray-700/50 hover:bg-green-600/20 text-gray-400 hover:text-green-400 transition-all duration-200"
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
							>
								<EyeIcon className="w-4 h-4" />
							</motion.a>
						)}
						{project.documentationUrl && (
							<motion.a
								href={project.documentationUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="p-2 rounded-lg bg-gray-700/50 hover:bg-orange-600/20 text-gray-400 hover:text-orange-400 transition-all duration-200"
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
							>
								<DocumentTextIcon className="w-4 h-4" />
							</motion.a>
						)}
					</div>
				</div>

				{/* Technologies/Languages */}
				{project.languages && project.languages.length > 0 && (
					<div className="mb-4">
						<div className="flex items-center gap-2 mb-2">
							<span className="text-sm font-medium text-gray-400">
								Technologies:
							</span>
						</div>
						<div className="flex flex-wrap gap-2">
							{project.languages.slice(0, 4).map((lang, index) => {
								const IconComponent = getLanguageIcon(lang.name);
								return (
									<div
										key={index}
										className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-700/30 border border-gray-600/30"
									>
										{IconComponent && (
											<IconComponent
												className="w-4 h-4"
												style={{ color: getLanguageColor(lang.name) }}
											/>
										)}
										<span className="text-xs font-medium text-gray-300">
											{lang.name}
										</span>
									</div>
								);
							})}
							{project.languages.length > 4 && (
								<span className="text-xs text-gray-400 px-2 py-1">
									+{project.languages.length - 4} more
								</span>
							)}
						</div>
					</div>
				)}

				{/* Static project specific fields */}
				{project.isStatic && (
					<>
						{/* Status and Category */}
						<div className="flex items-center gap-2 mb-4">
							{project.category && (
								<span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs border border-blue-500/30">
									{project.category}
								</span>
							)}
							{project.status && (
								<span
									className={`px-2 py-1 rounded-full text-xs border ${
										project.status === "Completed"
											? "bg-green-600/20 text-green-300 border-green-500/30"
											: project.status === "In Progress"
											? "bg-yellow-600/20 text-yellow-300 border-yellow-500/30"
											: "bg-gray-600/20 text-gray-300 border-gray-500/30"
									}`}
								>
									{project.status}
								</span>
							)}
							{project.featured && (
								<span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-xs border border-purple-500/30">
									Featured
								</span>
							)}
						</div>

						{/* Highlights */}
						{project.highlights && project.highlights.length > 0 && (
							<div className="mb-4">
								<h4 className="text-sm font-medium text-gray-400 mb-2">
									Highlights:
								</h4>
								<ul className="space-y-1">
									{project.highlights.slice(0, 3).map((highlight, index) => (
										<li
											key={index}
											className="text-xs text-gray-300 flex items-start"
										>
											<span className="text-purple-400 mr-2">•</span>
											{highlight}
										</li>
									))}
								</ul>
							</div>
						)}
					</>
				)}

				{/* Topics */}
				{project.topics && project.topics.length > 0 && (
					<div className="mb-4">
						<div className="flex flex-wrap gap-1">
							{project.topics.slice(0, 6).map((topic, index) => (
								<span
									key={index}
									className="px-2 py-1 text-xs bg-purple-600/20 text-purple-300 rounded-full border border-purple-500/30"
								>
									{topic}
								</span>
							))}
							{project.topics.length > 6 && (
								<span className="px-2 py-1 text-xs text-gray-400">
									+{project.topics.length - 6} more
								</span>
							)}
						</div>
					</div>
				)}

				{/* Stats */}
				<div className="flex items-center justify-between text-sm text-gray-400 mb-4">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-1">
							<StarIcon className="w-4 h-4" />
							<span>{formatCount(project.stargazers_count)}</span>
						</div>
						<div className="flex items-center gap-1">
							<CodeBracketIcon className="w-4 h-4" />
							<span>{formatCount(project.forks_count)} forks</span>
						</div>
						{project.counterValue && (
							<div className="flex items-center gap-1 text-blue-400">
								<EyeIcon className="w-4 h-4" />
								<span>{formatCount(project.counterValue)} views</span>
							</div>
						)}
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-700/50">
					<div className="flex items-center gap-1">
						<CalendarIcon className="w-3 h-3" />
						<span>Updated {formatDate(project.updated_at)}</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default ProjectCard;
