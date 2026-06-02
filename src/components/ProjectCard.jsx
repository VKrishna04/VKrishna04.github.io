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

import { useEffect, useState } from "react"
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import {
	StarIcon,
	CodeBracketIcon,
	CalendarIcon,
	ArrowTopRightOnSquareIcon,
	EyeIcon,
	ExclamationTriangleIcon,
} from "@heroicons/react/24/outline"
import { parseColor, applyOpacity } from "../utils/themeUtils"
import {
	FaGithub,
	FaReact,
	FaNodeJs,
	FaPython,
	FaJava,
	FaHtml5,
	FaCss3Alt,
	FaAws,
	FaPhp,
	FaVuejs,
	FaAngular,
	FaDocker,
	FaGitAlt,
	FaDatabase,
	FaMobile,
	FaCode,
	FaGlobe,
} from "react-icons/fa"
import {
	SiJavascript,
	SiTypescript,
	SiMongodb,
	SiPostgresql,
	SiTailwindcss,
	SiExpress,
	SiNextdotjs,
	SiGithubcopilot,
	SiNestjs,
	SiRedis,
	SiGraphql,
	SiKubernetes,
	SiFirebase,
	SiVercel,
	SiNetlify,
	SiVuedotjs,
	SiSvelte,
	SiNuxtdotjs,
	SiGo,
	SiRust,
	SiCplusplus,
	SiC,
	SiRuby,
	SiElixir,
	SiScala,
	SiKotlin,
	SiSwift,
	SiFlutter,
	SiElectron,
	SiMysql,
	SiSqlite,
	SiDjango,
	SiFlask,
	SiSpring,
	SiSupabase,
	SiPrisma,
	SiVite,
	SiWebpack,
	SiGooglecloud,
	SiHeroku,
} from "react-icons/si"

const ProjectCard = ({
	project,
	index = 0,
	accentColor = null,
	globalButtonStyles = {},
	tagStyles = {},
	showSocialImage = true,
	socialPreviewConfig = {},
}) => {
	// Animation variants
	const cardVariants = {
		hidden: {
			opacity: 0,
			y: 20,
		},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				delay: index * 0.1,
			},
		},
	}

	const formatDate = (dateString) => {
		if (!dateString) return "Recently"
		try {
			const date = new Date(dateString)
			return date.toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
			})
		} catch {
			return "Recently"
		}
	}

	const getLanguageColor = (language) => {
		const colors = {
			JavaScript: "#f1e05a",
			TypeScript: "#3178c6",
			Python: "#3572A5",
			Java: "#b07219",
			HTML: "#e34c26",
			CSS: "#1572B6",
			React: "#61dafb",
			Vue: "#4FC08D",
			Angular: "#dd1b16",
			"C++": "#f34b7d",
			C: "#555555",
			Go: "#00ADD8",
			Rust: "#dea584",
			PHP: "#4F5D95",
			Ruby: "#701516",
			Swift: "#FA7343",
			Kotlin: "#A97BFF",
			Dart: "#00B4AB",
		}
		return colors[language] || "#8b5cf6"
	}

	const getTechnologyIcon = (tech) => {
		const techLower = tech.toLowerCase()
		const iconMap = {
			// Frontend Languages & Frameworks
			javascript: SiJavascript,
			js: SiJavascript,
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
			copilot: SiGithubcopilot,
			copilotx: SiGithubcopilot,
			githubcopilot: SiGithubcopilot,
			githuborg: SiGithubcopilot,
			tailwindcss: SiTailwindcss,
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
			flutter: SiFlutter,
			dart: SiFlutter,
			electron: SiElectron,
			mobile: FaMobile,
			android: FaMobile,
			ios: FaMobile,
			mongodb: SiMongodb,
			mongo: SiMongodb,
			postgresql: SiPostgresql,
			postgres: SiPostgresql,
			mysql: SiMysql,
			sqlite: SiSqlite,
			redis: SiRedis,
			database: FaDatabase,
			db: FaDatabase,
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
			aws: FaAws,
			gcp: SiGooglecloud,
			google: SiGooglecloud,
			vercel: SiVercel,
			netlify: SiNetlify,
			heroku: SiHeroku,
			web: FaGlobe,
			website: FaGlobe,
			webapp: FaGlobe,
			api: FaCode,
			backend: FaCode,
			frontend: FaCode,
			fullstack: FaCode,
		}

		return iconMap[techLower] || CodeBracketIcon
	}

	// Get the best icon for the project - prioritize frameworks over language
	const getProjectIcon = () => {
		// Priority order: technologies -> topics -> language
		const frameworkKeywords = [
			"react",
			"vue",
			"angular",
			"svelte",
			"next",
			"nuxt",
			"flask",
			"django",
			"express",
			"nest",
			"spring",
			"laravel",
			"rails",
			"flutter",
			"electron",
			"tailwind",
			"bootstrap",
			"fastapi",
			"gin",
			"fiber",
			"actix",
		]

		// Check technologies first
		if (project.technologies && project.technologies.length > 0) {
			for (const tech of project.technologies) {
				const techName = (
					typeof tech === "string" ? tech : tech.name
				).toLowerCase()
				if (frameworkKeywords.some((fw) => techName.includes(fw))) {
					return getTechnologyIcon(techName)
				}
			}
			// Return first technology if no framework found
			const firstTech =
				typeof project.technologies[0] === "string"
					? project.technologies[0]
					: project.technologies[0].name
			return getTechnologyIcon(firstTech)
		}

		// Check topics for frameworks
		if (project.topics && project.topics.length > 0) {
			for (const topic of project.topics) {
				const topicLower = topic.toLowerCase()
				if (frameworkKeywords.some((fw) => topicLower.includes(fw))) {
					return getTechnologyIcon(topicLower)
				}
			}
			// Return first topic
			return getTechnologyIcon(project.topics[0])
		}

		// Fallback to language
		return getTechnologyIcon(project.language || "code")
	}

	const ProjectIcon = getProjectIcon()

	// Determine effective styling: per-project styling -> global props -> defaults
	const effectiveStyling = project?.styling || {}
	const effectiveAccent =
		effectiveStyling.accentColor || accentColor || "#a855f7"
	const effectiveButtonStyles = {
		code: (effectiveStyling.buttonStyles &&
			effectiveStyling.buttonStyles.code) ||
			globalButtonStyles.code || {
				background: "linear-gradient(90deg,#334155,#1f2937)",
				textColor: "#ffffff",
			},
		live: (effectiveStyling.buttonStyles &&
			effectiveStyling.buttonStyles.live) ||
			globalButtonStyles.live || {
				background: "linear-gradient(90deg,#7c3aed,#ec4899)",
				textColor: "#ffffff",
			},
	}

	// Tag styling with brighter defaults
	const effectiveTagStyles = {
		topics: {
			backgroundOpacity: tagStyles?.topics?.backgroundOpacity ?? 0.18,
			textColor: tagStyles?.topics?.textColor || "#e9d5ff", // brighter purple
			borderOpacity: tagStyles?.topics?.borderOpacity ?? 0.3,
		},
		technologies: {
			backgroundColor:
				tagStyles?.technologies?.backgroundColor || "rgba(96, 165, 250, 0.2)",
			textColor: tagStyles?.technologies?.textColor || "#93c5fd", // brighter blue
			borderColor:
				tagStyles?.technologies?.borderColor || "rgba(96, 165, 250, 0.35)",
		},
	}

	// Get social image URL - priority: local settings -> GitHub social preview
	const resolveRepoPathFromUrl = (url) => {
		if (!url) return null
		try {
			const parsed = new URL(url)
			if (!parsed.hostname.includes("github.com")) return null
			const parts = parsed.pathname.split("/").filter(Boolean)
			if (parts.length < 2) return null
			return {
				owner: parts[0],
				repo: parts[1].replace(/\.git$/i, ""),
			}
		} catch {
			return null
		}
	}

	const resolveRepoPath = () => {
		if (
			typeof project.full_name === "string" &&
			project.full_name.includes("/")
		) {
			const [owner, repo] = project.full_name.split("/")
			if (owner && repo) {
				return { owner, repo: repo.replace(/\.git$/i, "") }
			}
		}

		return (
			resolveRepoPathFromUrl(project.githubUrl) ||
			resolveRepoPathFromUrl(project.html_url)
		)
	}

	const getGitHubOpenGraphUrl = () => {
		const repoPath = resolveRepoPath()
		if (!repoPath) return null

		const variant =
			String(socialPreviewConfig?.opengraphVariant || "2").trim() || "2"

		return `https://opengraph.githubassets.com/${encodeURIComponent(
			variant
		)}/${encodeURIComponent(repoPath.owner)}/${encodeURIComponent(repoPath.repo)}`
	}

	const getCustomPreviewFromProject = () => {
		if (project.socialImage) return project.socialImage
		if (project.imageUrl) return project.imageUrl
		if (project.image) return project.image
		return null
	}

	const getCustomOverridePreview = () => {
		const overrides = socialPreviewConfig?.overrides
		if (!overrides || typeof overrides !== "object") return null

		const repoPath = resolveRepoPath()
		const keys = [
			project.full_name,
			repoPath ? `${repoPath.owner}/${repoPath.repo}` : null,
			project.name,
		].filter(Boolean)

		for (const key of keys) {
			const overrideUrl = overrides[key]
			if (typeof overrideUrl === "string" && overrideUrl.trim()) {
				return overrideUrl.trim()
			}
		}

		return null
	}

	const socialSources = (() => {
		if (!showSocialImage) return []

		const sources = []
		const customUrl =
			getCustomOverridePreview() || getCustomPreviewFromProject()
		const githubUrl = getGitHubOpenGraphUrl()

		if (customUrl) {
			sources.push({
				key: "custom",
				label: "Custom",
				url: customUrl,
			})
		}

		if (githubUrl) {
			sources.push({
				key: "github-opengraph",
				label: "GitHub",
				url: githubUrl,
			})
		}

		const uniqueByUrl = []
		const seenUrls = new Set()
		for (const source of sources) {
			if (seenUrls.has(source.url)) continue
			seenUrls.add(source.url)
			uniqueByUrl.push(source)
		}

		return uniqueByUrl
	})()

	const orderSocialSources = (sources) => {
		const defaultSource =
			socialPreviewConfig?.defaultSource || "github-opengraph"

		if (defaultSource === "none") return []

		if (defaultSource === "custom") {
			return [...sources].sort((a, b) => {
				if (a.key === "custom") return -1
				if (b.key === "custom") return 1
				return 0
			})
		}

		return [...sources].sort((a, b) => {
			if (a.key === "github-opengraph") return -1
			if (b.key === "github-opengraph") return 1
			return 0
		})
	}

	const [failedSourceKeys, setFailedSourceKeys] = useState([])
	const [selectedSourceKey, setSelectedSourceKey] = useState(null)
	const [isPreviewLoaded, setIsPreviewLoaded] = useState(false)
	const [imgLoaded, setImgLoaded] = useState(false)
	const [imgError, setImgError] = useState(false)

	const orderedSources = orderSocialSources(socialSources)

	const availableSources = orderedSources.filter(
		(source) => !failedSourceKeys.includes(source.key)
	)

	const activeSocialSource =
		availableSources.find((source) => source.key === selectedSourceKey) ||
		availableSources[0] ||
		null

	useEffect(() => {
		setFailedSourceKeys([])
		setSelectedSourceKey(null)
		setIsPreviewLoaded(false)
	}, [project?.id, project?.name, showSocialImage])

	useEffect(() => {
		setIsPreviewLoaded(false)
		setImgLoaded(false)
		setImgError(false)
		window.dispatchEvent(new Event("projects:masonry-reflow"))
	}, [activeSocialSource?.url])

	useEffect(() => {
		if (!availableSources.length) {
			setSelectedSourceKey(null)
			return
		}

		const currentStillAvailable = availableSources.some(
			(source) => source.key === selectedSourceKey
		)
		if (!currentStillAvailable) {
			setSelectedSourceKey(availableSources[0].key)
		}
	}, [availableSources, selectedSourceKey])

	const allowSourceToggle = socialPreviewConfig?.allowSourceToggle !== false
	const showSourceToggle =
		allowSourceToggle && socialSources.length > 1 && !!activeSocialSource

	const handleSocialSourceLoad = () => {
		setIsPreviewLoaded(true)
		window.dispatchEvent(new Event("projects:masonry-reflow"))
	}

	const handleSocialSourceError = () => {
		if (!activeSocialSource) return
		setIsPreviewLoaded(false)
		setFailedSourceKeys((prev) => {
			if (prev.includes(activeSocialSource.key)) return prev
			return [...prev, activeSocialSource.key]
		})
		window.dispatchEvent(new Event("projects:masonry-reflow"))
	}

	const handleSourceSwitch = (sourceKey) => {
		setFailedSourceKeys((prev) => prev.filter((key) => key !== sourceKey))
		setSelectedSourceKey(sourceKey)
		setIsPreviewLoaded(false)
		window.dispatchEvent(new Event("projects:masonry-reflow"))
	}

	return (
		<motion.div
			variants={cardVariants}
			initial="hidden"
			animate="visible"
			whileHover={{
				y: -8,
				transition: { duration: 0.3 },
			}}
			className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group h-full flex flex-col"
		>
			{/* Social Image */}
			{activeSocialSource && (
				<div className="relative w-full overflow-hidden rounded-t-xl bg-gray-900" style={{ aspectRatio: '2/1' }}>
					{/* Skeleton while loading */}
					{!isPreviewLoaded && !imgError && (
						<div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-800 to-gray-900" />
					)}

					{/* Initials fallback on error */}
					{imgError && (
						<div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-900/40 to-slate-900">
							<span className="text-2xl font-bold text-cyan-400/60 select-none">
								{(project.name || project.full_name || 'P')
									.split(/[\s\-_]/)
									.slice(0, 2)
									.map(w => (w[0] || '').toUpperCase())
									.join('')}
							</span>
						</div>
					)}

					{/* Actual image */}
					{!imgError && activeSocialSource?.url && (
						<img
							src={activeSocialSource.url}
							alt={`${project.name} preview`}
							loading="lazy"
							decoding="async"
							fetchPriority={project.featured ? 'high' : 'auto'}
							className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
								isPreviewLoaded ? "opacity-100" : "opacity-0"
							}`}
							onLoad={handleSocialSourceLoad}
							onError={() => { setImgError(true); setIsPreviewLoaded(true); handleSocialSourceError(); }}
						/>
					)}
					{showSourceToggle && (
						<div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 rounded-md p-1 backdrop-blur-sm border border-white/10">
							{socialSources.map((source) => {
								const isActive = source.key === activeSocialSource.key
								return (
									<button
										key={source.key}
										type="button"
										onClick={() => handleSourceSwitch(source.key)}
										className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
											isActive
												? "bg-purple-500/70 text-white"
												: "bg-white/10 text-gray-200 hover:bg-white/20"
										}`}
										title={`Use ${source.label} preview`}
									>
										{source.label}
									</button>
								)
							})}
						</div>
					)}
				</div>
			)}

			{/* Card Content */}
			<div className="p-6 flex flex-col flex-grow">
				{/* Header */}
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center space-x-3 flex-1 min-w-0">
						<div
							className="p-2 rounded-lg flex-shrink-0"
							style={
								effectiveAccent
									? {
											background: `linear-gradient(90deg, ${parseColor(
												effectiveAccent
											)} 0%, ${applyOpacity(
												parseColor(effectiveAccent),
												0.85
											)} 100%)`,
										}
									: { background: "linear-gradient(90deg,#a855f7,#ec4899)" }
							}
						>
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
								const TopicIcon = getTechnologyIcon(topic)
								const showIcon = TopicIcon !== CodeBracketIcon
								return (
									<span
										key={idx}
										className="flex items-center space-x-1 px-2 py-1 text-xs rounded-full font-medium"
										title={topic}
										style={
											effectiveAccent
												? {
														backgroundColor: applyOpacity(
															parseColor(effectiveAccent),
															effectiveTagStyles.topics.backgroundOpacity
														),
														color: effectiveTagStyles.topics.textColor,
														border: `1px solid ${applyOpacity(
															parseColor(effectiveAccent),
															effectiveTagStyles.topics.borderOpacity
														)}`,
													}
												: {
														backgroundColor: `rgba(168, 85, 247, ${effectiveTagStyles.topics.backgroundOpacity})`,
														color: effectiveTagStyles.topics.textColor,
														border: `1px solid rgba(168, 85, 247, ${effectiveTagStyles.topics.borderOpacity})`,
													}
										}
									>
										{showIcon && <TopicIcon className="w-3 h-3" />}
										<span>{topic}</span>
									</span>
								)
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
								const TechIcon = getTechnologyIcon(
									typeof tech === "string" ? tech : tech.name
								)
								const techName = typeof tech === "string" ? tech : tech.name
								const showIcon = TechIcon !== CodeBracketIcon
								return (
									<span
										key={idx}
										className="flex items-center space-x-1 px-2 py-1 text-xs rounded-full font-medium"
										title={techName}
										style={{
											backgroundColor:
												effectiveTagStyles.technologies.backgroundColor,
											color: effectiveTagStyles.technologies.textColor,
											border: `1px solid ${effectiveTagStyles.technologies.borderColor}`,
										}}
									>
										{showIcon && <TechIcon className="w-3 h-3" />}
										<span>{techName}</span>
									</span>
								)
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
					<div className="flex items-center gap-3 flex-wrap">
						{typeof project.stargazers_count === "number" && (
							<div className="flex items-center space-x-1 whitespace-nowrap">
								{project.statsUrls?.starsUrl ? (
									<a
										href={project.statsUrls.starsUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center space-x-1 hover:text-yellow-400 transition-colors"
										title="View stargazers"
									>
										<StarIcon className="w-4 h-4" />
										<span>{project.stargazers_count}</span>
									</a>
								) : (
									<>
										<StarIcon className="w-4 h-4" />
										<span>{project.stargazers_count}</span>
									</>
								)}
							</div>
						)}
						{typeof project.forks_count === "number" && (
							<div className="flex items-center space-x-1 whitespace-nowrap">
								{project.statsUrls?.forksUrl ? (
									<a
										href={project.statsUrls.forksUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center space-x-1 hover:text-blue-400 transition-colors"
										title="View forks"
									>
										<CodeBracketIcon className="w-4 h-4" />
										<span>{project.forks_count}</span>
									</a>
								) : (
									<>
										<CodeBracketIcon className="w-4 h-4" />
										<span>{project.forks_count}</span>
									</>
								)}
							</div>
						)}
						{typeof project.watchers_count === "number" && (
							<div className="flex items-center space-x-1 whitespace-nowrap">
								{project.statsUrls?.watchersUrl ? (
									<a
										href={project.statsUrls.watchersUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center space-x-1 hover:text-green-400 transition-colors"
										title="View watchers"
									>
										<EyeIcon className="w-4 h-4" />
										<span>{project.watchers_count}</span>
									</a>
								) : (
									<>
										<EyeIcon className="w-4 h-4" />
										<span>{project.watchers_count}</span>
									</>
								)}
							</div>
						)}
						{typeof project.open_issues_count === "number" && (
							<div className="flex items-center space-x-1 whitespace-nowrap">
								{project.statsUrls?.issuesUrl ? (
									<a
										href={project.statsUrls.issuesUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center space-x-1 hover:text-red-400 transition-colors"
										title="View issues"
									>
										<ExclamationTriangleIcon className="w-4 h-4" />
										<span>{project.open_issues_count}</span>
									</a>
								) : (
									<>
										<ExclamationTriangleIcon className="w-4 h-4" />
										<span>{project.open_issues_count}</span>
									</>
								)}
							</div>
						)}
						{project.updated_at && (
							<div className="flex items-center space-x-1 whitespace-nowrap">
								<CalendarIcon className="w-4 h-4" />
								<span>{formatDate(project.updated_at)}</span>
							</div>
						)}
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex space-x-3 mt-auto">
					{/* GitHub Code Button - Always show for GitHub projects */}
					{(project.html_url || project.githubUrl || project.name) && (
						<a
							href={
								project.html_url ||
								project.githubUrl ||
								`https://github.com/Life-Experimentalist/${project.name}`
							}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium hover:scale-105 flex-1 justify-center"
							style={{
								background: effectiveButtonStyles.code.background,
								color: effectiveButtonStyles.code.textColor,
							}}
						>
							<FaGithub className="w-4 h-4" />
							<span>Code</span>
						</a>
					)}

					{/* Live Demo Button */}
					{(project.homepage || project.liveUrl || project.demoUrl) && (
						<a
							href={project.homepage || project.liveUrl || project.demoUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium hover:scale-105 flex-1 justify-center"
							style={{
								background: effectiveButtonStyles.live.background,
								color: effectiveButtonStyles.live.textColor,
							}}
						>
							<ArrowTopRightOnSquareIcon className="w-4 h-4" />
							<span>Live</span>
						</a>
					)}
				</div>
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
	)
}

export default ProjectCard
