import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
// === LEGACY/BACKUP: Direct icon imports (deprecated) ===
// These imports are kept for backward compatibility but should use unified system
// import * as ReactIcons from "react-icons/fa"; // REPLACED with unified icon system
// import * as ReactIconsSi from "react-icons/si"; // REPLACED with unified icon system
// import * as ReactIconsMd from "react-icons/md"; // REPLACED with unified icon system
// import * as ReactIconsBs from "react-icons/bs"; // REPLACED with unified icon system
// ========================================================

// === MODULAR SYSTEMS: Use unified icon system ===
import { UnifiedIcon } from "../components/UnifiedIcon"
// ================================================

/**
 * Customizable Technical Experience Section Component
 * Features:
 * - Configurable columns from settings (maxColumns, fixedColumns)
 * - Responsive layout (always 1 column on mobile)
 * - Skill name tooltips on hover with descriptions
 * - Skill proficiency levels with visual progress bars
 * - Category-based organization
 * - Smooth animations and hover effects
 */
const TechnicalExperience = ({ settings }) => {
	const [hoveredSkill, setHoveredSkill] = useState(null);

	// Get configuration from settings
	const config = settings?.about?.technicalExperience || {};
	const maxColumns = config.maxColumns || 3;
	const fixedColumns = config.fixedColumns || false;
	const showProficiency = config.showProficiency !== false;
	const animateOnHover = config.animateOnHover !== false;

	// Get skills data with fallback
	const skills = config.skills || [
		{ name: "React", icon: "FaReact", color: "text-blue-400", level: 90 },
		{
			name: "JavaScript",
			icon: "SiJavascript",
			color: "text-yellow-400",
			level: 85,
		},
		{ name: "Python", icon: "FaPython", color: "text-green-400", level: 80 },
		{ name: "Node.js", icon: "FaNodeJs", color: "text-green-500", level: 75 },
		{ name: "Git", icon: "FaGitAlt", color: "text-orange-500", level: 85 },
		{ name: "Docker", icon: "FaDocker", color: "text-blue-500", level: 70 },
	];

	// Calculate responsive columns
	const getGridColumns = () => {
		if (fixedColumns) {
			return {
				desktop: `repeat(${maxColumns}, minmax(0, 1fr))`,
				mobile: "repeat(1, minmax(0, 1fr))",
			};
		} else {
			// Dynamic columns based on content
			const skillCount = skills.length;
			const dynamicColumns = Math.min(maxColumns, Math.ceil(skillCount / 4));
			return {
				desktop: `repeat(${dynamicColumns}, minmax(0, 1fr))`,
				mobile: "repeat(1, minmax(0, 1fr))",
			};
		}
	};

	const gridColumns = getGridColumns();

	// Check if we're on mobile (simplified for SSR compatibility)
	const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

	// Skill icon component with tooltip
	const SkillIcon = ({ skill, index }) => {
		return (
			<motion.div
				className="relative group"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: index * 0.1 }}
				onMouseEnter={() => setHoveredSkill(skill.name)}
				onMouseLeave={() => setHoveredSkill(null)}
			>
				<div
					className={`p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10
					hover:bg-white/10 hover:border-white/20 transition-all duration-300
					${animateOnHover ? "hover:scale-105 hover:shadow-lg" : ""}`}
				>
					{/* Skill Icon */}
					<div className="flex flex-col items-center space-y-2">
						{skill.icon ? (
							<UnifiedIcon
								name={skill.icon}
								className={`w-8 h-8 ${skill.color || "text-primary-400"}`}
								fallback={null}
							/>
						) : (
							<div
								className={`w-8 h-8 rounded-full ${
									skill.color || "bg-primary-400"
								}
								flex items-center justify-center text-white font-bold`}
							>
								{skill.name.charAt(0)}
							</div>
						)}

						{/* Skill Name (Always Visible) */}
						<span className="text-sm font-medium text-center text-white/90">
							{skill.name}
						</span>

						{/* Proficiency Level */}
						{showProficiency && skill.level && (
							<div className="w-full">
								<div className="w-full bg-white/10 rounded-full h-1.5">
									<div
										className={`h-1.5 rounded-full transition-all duration-500 ${
											skill.levelColor || "bg-primary-400"
										}`}
										style={{ width: `${skill.level}%` }}
									/>
								</div>
								<span className="text-xs text-white/60 mt-1">
									{skill.levelText || `${skill.level}%`}
								</span>
							</div>
						)}
					</div>

					{/* Hover Tooltip */}
					{hoveredSkill === skill.name && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="absolute -top-12 left-1/2 transform -translate-x-1/2
								bg-black/90 text-white text-xs rounded-lg px-3 py-2
								backdrop-blur-sm border border-white/20 z-10
								pointer-events-none whitespace-nowrap"
						>
							{skill.description || skill.name}
							<div
								className="absolute top-full left-1/2 transform -translate-x-1/2
								border-4 border-transparent border-t-black/90"
							/>
						</motion.div>
					)}
				</div>
			</motion.div>
		);
	};

	// Category section component
	const CategorySection = ({ category, categorySkills, index }) => (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.2 }}
			className="mb-8"
		>
			<h3 className="text-xl font-semibold text-white mb-4 flex items-center">
				{category.icon && (
					<UnifiedIcon
						name={category.icon}
						className="mr-2 text-primary-400"
						fallback={null}
					/>
				)}
				{category.name}
			</h3>{" "}
			<div
				className="grid gap-4"
				style={{
					gridTemplateColumns: isMobile
						? gridColumns.mobile
						: gridColumns.desktop,
				}}
			>
				{categorySkills.map((skill, skillIndex) => (
					<SkillIcon key={skill.name} skill={skill} index={skillIndex} />
				))}
			</div>
		</motion.div>
	);

	// Organize skills by category
	const organizeSkillsByCategory = () => {
		const categories = config.categories || [
			{ name: "Technical Skills", skills: skills },
		];

		return categories.map((category) => ({
			...category,
			skills:
				category.skills ||
				skills.filter((skill) => skill.category === category.name),
		}));
	};

	const organizedSkills = organizeSkillsByCategory();

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
						{config.title || "Technical Experience"}
					</h2>
					{config.subtitle && (
						<p className="text-lg text-white/70 max-w-3xl mx-auto">
							{config.subtitle}
						</p>
					)}
				</motion.div>

				{/* Skills Grid */}
				<div className="space-y-8">
					{organizedSkills.map((category, index) => (
						<CategorySection
							key={category.name}
							category={category}
							categorySkills={category.skills}
							index={index}
						/>
					))}
				</div>

				{/* Configuration Info (Debug - Remove in production) */}
				{import.meta.env.DEV && (
					<div className="mt-8 p-4 bg-white/5 rounded-lg text-xs text-white/50">
						<strong>Grid Config:</strong> Max Columns: {maxColumns}, Fixed:{" "}
						{fixedColumns ? "Yes" : "No"}, Desktop: {gridColumns.desktop},
						Mobile: {gridColumns.mobile}
					</div>
				)}
			</div>
		</section>
	);
};

export default TechnicalExperience;
