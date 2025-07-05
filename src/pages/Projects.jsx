import React, { useState, useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
	FunnelIcon,
	MagnifyingGlassIcon,
	AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import {
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
} from "react-icons/si";
import GitHubRepoCard from "../components/GitHubRepoCard/GitHubRepoCard.jsx.backup";
import useGitHubRepos from "../hooks/useGitHubRepos";

const Projects = () => {
	const { repos, loading, error, getSettings } = useGitHubRepos();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedLanguages, setSelectedLanguages] = useState([]);
	const [sortBy, setSortBy] = useState("updated");
	const [showFilters, setShowFilters] = useState(false);
	const settings = getSettings();

	// Get unique languages from repositories
	const availableLanguages = useMemo(() => {
		const languages = new Set();
		repos.forEach((repo) => {
			if (repo.language) {
				languages.add(repo.language);
			}
		});
		return Array.from(languages).sort();
	}, [repos]);

	// Language icon mapping
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

	// Filter and sort repositories
	const filteredRepos = useMemo(() => {
		let filtered = repos.filter((repo) => {
			// Search filter
			const matchesSearch =
				repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(repo.description &&
					repo.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
				(repo.topics &&
					repo.topics.some((topic) =>
						topic.toLowerCase().includes(searchTerm.toLowerCase())
					));

			// Language filter
			const matchesLanguage =
				selectedLanguages.length === 0 ||
				selectedLanguages.includes(repo.language);

			return matchesSearch && matchesLanguage;
		});

		// Sort repositories
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "name":
					return a.name.localeCompare(b.name);
				case "stars":
					return b.stargazers_count - a.stargazers_count;
				case "updated":
					return new Date(b.updated_at) - new Date(a.updated_at);
				case "created":
					return new Date(b.created_at) - new Date(a.created_at);
				default:
					return new Date(b.updated_at) - new Date(a.updated_at);
			}
		});

		return filtered;
	}, [repos, searchTerm, selectedLanguages, sortBy]);

	const toggleLanguageFilter = (language) => {
		setSelectedLanguages((prev) =>
			prev.includes(language)
				? prev.filter((l) => l !== language)
				: [...prev, language]
		);
	};

	const clearFilters = () => {
		setSearchTerm("");
		setSelectedLanguages([]);
		setSortBy("updated");
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

	const staggerChild = {
		initial: { opacity: 0, y: 30 },
		animate: { opacity: 1, y: 0 },
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
					<div className="text-center">
						<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
						<p className="mt-4 text-gray-300">Loading projects...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
					<div className="text-center">
						<p className="text-red-400">Error loading projects: {error}</p>
						<p className="mt-2 text-gray-400">
							Please check your settings.json configuration.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
				{/* Header */}
				<motion.div className="text-center mb-16" {...fadeInUp}>
					<h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
						My Projects
					</h1>
					<p className="text-xl text-gray-300 max-w-3xl mx-auto">
						{settings.github?.type === "org" ? (
							<>
								Showcasing projects from{" "}
								<span className="text-purple-400 font-semibold">
									{settings.github?.username}
								</span>{" "}
								organization
							</>
						) : (
							<>A collection of my open-source projects and experiments</>
						)}
					</p>
					<div className="mt-4 text-sm text-gray-400">
						{repos.length} project{repos.length !== 1 ? "s" : ""} •{" "}
						{filteredRepos.length} shown
					</div>
				</motion.div>

				{/* Search and Filters */}
				<motion.div
					className="mb-12 space-y-6"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					{/* Search Bar */}
					<div className="relative max-w-md mx-auto">
						<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
						<input
							type="text"
							placeholder="Search projects..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
						/>
					</div>

					{/* Filter Controls */}
					<div className="flex flex-wrap items-center justify-center gap-4">
						<button
							onClick={() => setShowFilters(!showFilters)}
							className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-colors backdrop-blur-sm"
						>
							<FunnelIcon className="w-4 h-4" />
							<span>Languages ({selectedLanguages.length})</span>
						</button>

						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
						>
							<option value="updated">Recently Updated</option>
							<option value="created">Recently Created</option>
							<option value="stars">Most Stars</option>
							<option value="name">Name (A-Z)</option>
						</select>

						{(searchTerm ||
							selectedLanguages.length > 0 ||
							sortBy !== "updated") && (
							<button
								onClick={clearFilters}
								className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-colors backdrop-blur-sm"
							>
								<AdjustmentsHorizontalIcon className="w-4 h-4" />
								<span>Clear</span>
							</button>
						)}
					</div>

					{/* Language Filter Pills */}
					{showFilters && availableLanguages.length > 0 && (
						<motion.div
							className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto"
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
						>
							{availableLanguages.map((language) => {
								const IconComponent = getLanguageIcon(language);
								const isSelected = selectedLanguages.includes(language);

								return (
									<button
										key={language}
										onClick={() => toggleLanguageFilter(language)}
										className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
											isSelected
												? "bg-purple-500/30 border-purple-500/50 text-purple-300 shadow-lg"
												: "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
										} border backdrop-blur-sm hover:scale-105`}
									>
										{IconComponent && (
											<IconComponent
												className="w-4 h-4"
												style={{ color: getLanguageColor(language) }}
											/>
										)}
										<span>{language}</span>
									</button>
								);
							})}
						</motion.div>
					)}

					{/* Active Filters Display */}
					{selectedLanguages.length > 0 && (
						<div className="flex flex-wrap justify-center gap-2">
							{selectedLanguages.map((language) => (
								<span
									key={language}
									className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30"
								>
									{language}
									<button
										onClick={() => toggleLanguageFilter(language)}
										className="ml-2 hover:text-purple-200"
									>
										×
									</button>
								</span>
							))}
						</div>
					)}
				</motion.div>

				{/* Results Info */}
				{searchTerm && (
					<motion.div
						className="text-center mb-8"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3 }}
					>
						<p className="text-gray-400">
							{filteredRepos.length} project
							{filteredRepos.length !== 1 ? "s" : ""} found for "{searchTerm}"
						</p>
					</motion.div>
				)}

				{/* Projects Grid */}
				{filteredRepos.length > 0 ? (
					<motion.div
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
						variants={staggerContainer}
						initial="initial"
						animate="animate"
					>
						{filteredRepos.map((repo, index) => (
							<motion.div key={repo.id} variants={staggerChild}>
								<GitHubRepoCard repo={repo} index={index} settings={settings} />
							</motion.div>
						))}
					</motion.div>
				) : (
					<motion.div
						className="text-center py-20"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
					>
						<div className="text-gray-400 text-lg">
							{searchTerm || selectedLanguages.length > 0 ? (
								<>
									<p>No projects found matching your filters.</p>
									<button
										onClick={clearFilters}
										className="mt-4 px-6 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/30 transition-colors"
									>
										Clear Filters
									</button>
								</>
							) : (
								<p>No projects available.</p>
							)}
						</div>
					</motion.div>
				)}

				{/* Configuration Info */}
				<motion.div
					className="mt-20 text-center text-gray-500 text-sm"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.5 }}
				>
					<p>
						Projects fetched from{" "}
						<span className="text-purple-400">
							{settings.github?.type === "org"
								? "GitHub Organization"
								: "GitHub User"}
						</span>
						{" • "}
						<span className="text-purple-400">{settings.github?.username}</span>
					</p>
					{settings.projects?.ignore && settings.projects.ignore.length > 0 && (
						<p className="mt-1">
							Excluding: {settings.projects.ignore.join(", ")}
						</p>
					)}
				</motion.div>
			</div>
		</div>
	);
};

export default Projects;
