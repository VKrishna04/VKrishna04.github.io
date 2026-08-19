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
import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useCodeLedgerStats } from "../hooks/useCodeLedgerStats"

// === MODULAR SYSTEMS: Use unified icon + color systems ===
import { getUnifiedIcon } from "../utils/iconSystemCore"
import { UnifiedIcon } from "../components/UnifiedIcon"
import { parseColor } from "../utils/themeUtils"
import TechnicalExperience from "../components/TechnicalExperience"
// =========================================================

const About = () => {
	const [settings, setSettings] = useState({})
	const [truncatedSkills, setTruncatedSkills] = useState(new Set())
	const skillRefs = useRef({})
	const { data: dsaData, config: dsaConfig } = useCodeLedgerStats()
	const [dsaView, setDsaView] = useState("all")

	useEffect(() => {
		fetch("/settings.json")
			.then((response) => response.json())
			.then((data) => setSettings(data))
			.catch((error) => console.warn("Could not fetch settings:", error))
	}, [])

	// Sync dsaView default from settings once config is available
	useEffect(() => {
		if (dsaConfig?.widget?.defaultView) {
			const viewMap = { both: "all", month: "30d", year: "7d" }
			setDsaView(viewMap[dsaConfig.widget.defaultView] || "all")
		}
	}, [dsaConfig])

	// Check for text truncation
	useEffect(() => {
		const checkTruncation = () => {
			const truncated = new Set()
			Object.entries(skillRefs.current).forEach(([key, ref]) => {
				if (ref && ref.scrollWidth > ref.clientWidth) {
					truncated.add(key)
				}
			})
			setTruncatedSkills(truncated)
		}

		checkTruncation()
		window.addEventListener("resize", checkTruncation)
		return () => window.removeEventListener("resize", checkTruncation)
	}, [settings])

	// Get image URL based on settings
	const getImageUrl = () => {
		const aboutConfig = settings.about || {}
		const displayConfig = settings.display || {}

		if (aboutConfig.image?.type === "custom" && aboutConfig.image?.customUrl) {
			return aboutConfig.image.customUrl
		} else if (
			aboutConfig.image?.type === "home" &&
			displayConfig.profileImage
		) {
			return displayConfig.profileImage
		} else {
			return displayConfig.profileImage || "https://github.com/VKrishna04.png"
		}
	}

	// Preload icons when settings are loaded
	useEffect(() => {
		if (!settings.about?.skills) return

		const preloadIcons = async () => {
			const iconNames = new Set()

			settings.about.skills.forEach((category) => {
				if (category.icon) iconNames.add(category.icon)
				category.items?.forEach((item) => {
					if (item.icon) iconNames.add(item.icon)
				})
			})

			// Preload achievement icons
			settings.about?.achievements?.items?.forEach((item) => {
				if (item.icon) iconNames.add(item.icon)
			})

			await Promise.all(
				Array.from(iconNames).map(async (iconName) => {
					try {
						await getUnifiedIcon(iconName)
					} catch (error) {
						console.warn(`Failed to preload icon: ${iconName}`, error)
					}
				})
			)
		}

		preloadIcons()
	}, [settings])

	// Get skills from settings
	const getSkills = () => {
		if (settings.about?.skills?.length > 0) {
			return settings.about.skills.map((category) => ({
				...category,
				iconName: category.icon,
				items: category.items.map((item) => ({
					...item,
					iconName: item.icon,
				})),
			}))
		}
		return []
	}

	const getStats = () => settings.about?.stats || []

	const skills = getSkills()
	const stats = getStats()

	const fadeInUp = {
		initial: { opacity: 0, y: 60 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.6 },
	}

	const staggerContainer = {
		animate: {
			transition: {
				staggerChildren: 0.1,
			},
		},
	}

	// DSA totals
	const dsaTotal =
		(dsaData?.stats?.easy ?? 0) +
		(dsaData?.stats?.medium ?? 0) +
		(dsaData?.stats?.hard ?? 0)

	const showDsaWidget =
		settings.codeLedger?.widget?.showInAbout !== false && dsaData

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
										<div
											className="w-80 h-80 rounded-full overflow-hidden border-4 shadow-2xl"
											style={{
												borderColor: parseColor(
													settings.about?.image?.borderColor ||
														"rgba(168, 85, 247, 0.3)"
												),
												boxShadow: `0 25px 50px -12px ${parseColor(
													settings.about?.image?.shadowColor ||
														"rgba(168, 85, 247, 0.2)"
												)}`,
											}}
										>
											<img
												src={getImageUrl()}
												alt={settings.about?.image?.altText || "Profile"}
												className="w-full h-full object-cover"
											/>
										</div>
										<div
											className="absolute inset-0 rounded-full"
											style={{
												background: `linear-gradient(to top right, ${parseColor(
													settings.about?.image?.gradientFrom ||
														"rgba(168, 85, 247, 0.1)"
												)}, ${parseColor(
													settings.about?.image?.gradientTo ||
														"rgba(236, 72, 153, 0.1)"
												)})`,
											}}
										></div>
									</div>
								</motion.div>
							)}
						</div>
					)}

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

					{/* DSA Activity Widget */}
					{showDsaWidget && (
						<motion.div
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4 }}
							className="mt-6 p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl"
						>
							<div className="flex items-center justify-between mb-3">
								<span className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500">
									DSA Activity
								</span>
								<div className="flex gap-1">
									{[
										{ key: "7d", label: "7d" },
										{ key: "30d", label: "30d" },
										{ key: "all", label: "All" },
									].map(({ key, label }) => (
										<button
											key={key}
											onClick={() => setDsaView(key)}
											className={`text-[9px] px-2 py-0.5 rounded-full transition-all ${
												dsaView === key
													? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
													: "text-slate-600 hover:text-slate-400"
											}`}
										>
											{label}
										</button>
									))}
								</div>
							</div>

							<div className="flex items-center gap-3 flex-wrap">
								<div className="flex items-baseline gap-1">
									<span className="text-lg font-bold text-cyan-400">
										{dsaTotal}
									</span>
									<span className="text-[10px] text-slate-500">solved</span>
								</div>
								<div className="text-slate-700">·</div>
								<div className="flex items-baseline gap-1">
									<span className="text-lg font-bold text-emerald-400">
										{dsaData.currentStreak}d
									</span>
									<span className="text-[10px] text-slate-500">streak</span>
								</div>
								{(dsaView === "30d" || dsaView === "all") && (
									<>
										<div className="text-slate-700">·</div>
										<div className="flex items-baseline gap-1">
											<span className="text-base font-bold text-amber-400">
												{dsaData.last30Days}
											</span>
											<span className="text-[10px] text-slate-500">
												last 30d
											</span>
										</div>
									</>
								)}
								{(dsaView === "7d" || dsaView === "all") && (
									<>
										<div className="text-slate-700">·</div>
										<div className="flex items-baseline gap-1">
											<span className="text-base font-bold text-purple-400">
												{dsaData.last7Days}
											</span>
											<span className="text-[10px] text-slate-500">
												last 7d
											</span>
										</div>
									</>
								)}
								<Link
									to="/stats"
									className="ml-auto text-[10px] text-slate-500 hover:text-cyan-400 transition-colors"
								>
									View full stats →
								</Link>
							</div>
						</motion.div>
					)}

					{/* Technical Experience Section */}
					{settings.about?.technicalExperience?.show !== false &&
						settings.about?.technicalExperience?.categories?.length > 0 && (
							<motion.div
								className="mt-20"
								initial={{ opacity: 0, y: 60 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
							>
								<TechnicalExperience settings={settings} />
							</motion.div>
						)}

					{/* Skills Section */}
					{skills.length > 0 && (
						<motion.div className="mt-20" variants={fadeInUp}>
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
												<UnifiedIcon
													name={skillCategory.iconName || "Icon 404"}
													className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors"
													fallback="FaCode"
												/>
											</div>
											<h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
												{skillCategory.category}
											</h3>
										</div>
										<div className="grid grid-cols-2 gap-3">
											{skillCategory.items.map((skill, skillIndex) => {
												const skillKey = `${index}-${skillIndex}`
												const isTruncated = truncatedSkills.has(skillKey)

												return (
													<div
														key={skillIndex}
														className="relative flex items-center space-x-2 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-300 group/skill cursor-pointer"
													>
														<div className="flex-shrink-0">
															<UnifiedIcon
																name={skill.iconName || "FaCode"}
																className={`w-5 h-5 ${skill.color} group-hover/skill:scale-110 transition-transform`}
																fallback="FaCode"
															/>
														</div>
														<span
															ref={(el) => (skillRefs.current[skillKey] = el)}
															className="text-gray-300 text-sm font-medium truncate group-hover/skill:text-white transition-colors"
														>
															{skill.name}
														</span>
														{isTruncated && (
															<div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover/skill:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-10 border border-purple-500/30 flex items-center gap-2">
																<UnifiedIcon
																	name={skill.iconName || "FaCode"}
																	className={`w-4 h-4 ${skill.color}`}
																	fallback="FaCode"
																/>
																<span>{skill.name}</span>
																<div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
															</div>
														)}
													</div>
												)
											})}
										</div>
									</motion.div>
								))}
							</div>
						</motion.div>
					)}

					{/* Achievements & Recognition Section */}
					{settings.about?.achievements?.show !== false &&
						settings.about?.achievements?.items?.length > 0 && (
							<motion.div className="mt-20" variants={fadeInUp}>
								<h2 className="text-3xl font-bold text-center text-white mb-12">
									{settings.about.achievements.heading ||
										"Achievements & Recognition"}
								</h2>
								<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
									{settings.about.achievements.items.map((item, index) => (
										<motion.div
											key={index}
											className={`${item.gradient} backdrop-blur-sm rounded-xl p-6 border ${item.borderColor} ${item.hoverBorderColor} transition-all duration-300 group`}
											variants={fadeInUp}
											whileHover={{ scale: 1.02, y: -5 }}
										>
											<div className="text-center">
												<div
													className={`w-16 h-16 ${item.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:opacity-80 transition-opacity`}
												>
													<UnifiedIcon
														name={item.icon || "FaTrophy"}
														className={`w-8 h-8 ${item.iconColor}`}
														fallback="FaTrophy"
													/>
												</div>
												<h3 className="text-lg font-bold text-white mb-1">
													{item.title}
												</h3>
												{item.subtitle && (
													<p className="text-xs text-slate-400 mb-3">
														{item.subtitle}
													</p>
												)}
												<p className={`${item.textColor} text-sm leading-relaxed`}>
													{item.description}
												</p>
											</div>
										</motion.div>
									))}
								</div>
							</motion.div>
						)}
				</motion.div>
			</div>
		</div>
	)
}

export default About
