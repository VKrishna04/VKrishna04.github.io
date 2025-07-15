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
import React, { useState, useMemo, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
	FunnelIcon,
	MagnifyingGlassIcon,
	AdjustmentsHorizontalIcon,
	StarIcon,
	EyeIcon,
	CodeBracketIcon,
	ArrowTopRightOnSquareIcon,
	CalendarIcon,
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
	FaGithub,
	FaNodeJs,
	FaLock,
	FaUserShield,
	FaUsers,
	FaSignInAlt,
	FaTicketAlt,
	FaParking,
	FaDesktop,
	FaExclamationTriangle,
	FaEnvelopeOpenText,
	FaKey,
	FaImage,
	FaBrain,
	FaVideo,
	FaSmile,
	FaMeh,
	FaWaveSquare,
	FaHandsHelping,
	FaCamera,
	FaUserFriends,
	FaSmileBeam,
	FaRobot,
	FaLink,
	FaBitcoin,
	FaCube,
	FaNetworkWired,
	FaHive,
	FaSignature,
	FaPlug,
	FaShareAlt,
	FaDatabase,
	FaGlobe,
	FaBoxOpen,
	FaEdit,
	FaClock,
	FaTerminal,
	FaLaptopCode,
	FaUserGraduate,
	FaUndo,
	FaBook,
	FaUserSecret,
	FaFileCode,
	FaMemory,
	FaFileExport,
	FaCogs,
	FaUnlockAlt,
	FaUserLock,
	FaBookOpen,
	FaTachometerAlt,
	FaFileArchive,
	FaFileSignature,
	FaHammer,
	FaCode,
	FaSave,
	FaFlag,
	FaCodeBranch,
	FaLightbulb,
	FaUndoAlt,
	FaStream,
	FaChrome,
	FaSpider,
	FaFileDownload,
	FaLanguage,
	FaChalkboardTeacher,
	FaTasks,
	FaQuestionCircle,
	FaUserClock,
	FaSchool,
	FaDraftingCompass,
	FaPlusSquare,
	FaWrench,
	FaMobileAlt,
	FaApple,
	FaAndroid,
	FaBell,
	FaMapMarkerAlt,
	FaMapMarkedAlt,
	FaMap,
	FaRegCommentDots,
	FaComments,
	FaCog,
	FaMobile,
	FaUserCircle,
	FaUser,
	FaPaintBrush,
	FaMoon,
	FaBriefcase,
	FaSync,
	FaTruckLoading,
	FaPlayCircle,
	FaCloudUploadAlt,
	FaTools,
	FaBox,
	FaCheckCircle,
	FaRocket,
	FaRandom,
	FaSyncAlt,
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
	SiExpress,
	SiPostgresql,
	SiRedis,
	SiStripe,
	SiVuedotjs,
	SiJavascript,
	SiSocketdotio,
	SiPrisma,
	SiMarkdown,
	SiFramer,
	SiVite,
	SiGithub,
} from "react-icons/si";
import ProjectCard from "../components/ProjectCard";
import useGitHubRepos from "../hooks/useGitHubRepos";

const Projects = () => {
	const { repos, loading, error } = useGitHubRepos();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedLanguages, setSelectedLanguages] = useState([]);
	const [sortBy, setSortBy] = useState("updated");
	const [showFilters, setShowFilters] = useState(false);
	const [layoutMode, setLayoutMode] = useState(() => {
		// Get saved layout mode from localStorage or default to masonry
		return localStorage.getItem("projectsLayoutMode") || "masonry";
	});
	const [currentColumns, setCurrentColumns] = useState(1);
	const [settings, setSettings] = useState({});

	// Save layout mode preference
	useEffect(() => {
		localStorage.setItem("projectsLayoutMode", layoutMode);
	}, [layoutMode]);

	// Fetch settings
	useEffect(() => {
		fetch("/settings.json")
			.then((response) => response.json())
			.then((data) => setSettings(data))
			.catch((error) => console.warn("Could not fetch settings:", error));
	}, []);

	// Determine which projects to use based on mode
	const projectsData = useMemo(() => {
		const mode = settings.projects?.mode || "github";

		if (mode === "static") {
			// Use static projects from settings
			const staticProjects = settings.projects?.staticProjects || [];
			return staticProjects;
		} else if (mode === "hybrid") {
			// For hybrid mode, intelligently merge GitHub repos with static projects
			if (repos && repos.length > 0) {
				const staticProjects = settings.projects?.staticProjects || [];

				// Create a map of GitHub repos by normalized name for easy lookup
				const githubProjectsMap = new Map();
				repos.forEach((repo) => {
					const normalizedName = repo.name.toLowerCase().replace(/[-_\s]/g, "");
					githubProjectsMap.set(normalizedName, repo);
				});

				// Process static projects and merge with GitHub data if available
				const mergedProjects = [];
				const usedGithubProjects = new Set();

				staticProjects.forEach((staticProject) => {
					const normalizedStaticName = staticProject.name
						.toLowerCase()
						.replace(/[-_\s]/g, "");
					const matchingGithubProject =
						githubProjectsMap.get(normalizedStaticName);

					if (matchingGithubProject) {
						// Merge the projects - GitHub data takes precedence for core fields
						const mergedProject = {
							// GitHub data (base)
							...matchingGithubProject,
							// Static project enhancements (non-conflicting or supplementary)
							category:
								staticProject.category || matchingGithubProject.category,
							featured:
								staticProject.featured !== undefined
									? staticProject.featured
									: false,
							status: staticProject.status || "active",
							startDate:
								staticProject.startDate || matchingGithubProject.created_at,
							endDate:
								staticProject.endDate || matchingGithubProject.updated_at,
							liveUrl: staticProject.liveUrl || matchingGithubProject.homepage,
							demoUrl: staticProject.demoUrl || matchingGithubProject.homepage,
							documentationUrl: staticProject.documentationUrl,
							imageUrl: staticProject.imageUrl,
							highlights: staticProject.highlights || [],
							// Enhanced description - combine if static has more detail
							description:
								staticProject.description &&
								staticProject.description.length >
									(matchingGithubProject.description?.length || 0)
									? staticProject.description
									: matchingGithubProject.description,
							// Enhanced topics/tags - merge both sources
							topics: [
								...(matchingGithubProject.topics || []),
								...(staticProject.tags || staticProject.technologies || []),
							].filter((item, index, arr) => arr.indexOf(item) === index), // Remove duplicates
							// Mark as merged
							isMerged: true,
							isStatic: false,
						};
						mergedProjects.push(mergedProject);
						usedGithubProjects.add(normalizedStaticName);
					} else {
						// No matching GitHub project, add static project as-is
						mergedProjects.push({
							...staticProject,
							isMerged: false,
							isStatic: true,
						});
					}
				});

				// Add remaining GitHub projects that weren't merged
				repos.forEach((repo) => {
					const normalizedName = repo.name.toLowerCase().replace(/[-_\s]/g, "");
					if (!usedGithubProjects.has(normalizedName)) {
						mergedProjects.push({
							...repo,
							isMerged: false,
							isStatic: false,
						});
					}
				});

				return mergedProjects;
			} else {
				// Fallback to static projects if GitHub repos are not available
				const staticProjects = settings.projects?.staticProjects || [];
				return staticProjects.map((project) => ({
					...project,
					isMerged: false,
					isStatic: true,
				}));
			}
		} else {
			// Use GitHub repos only
			const githubRepos = repos || [];
			return githubRepos;
		}
	}, [settings.projects, repos]);
	// Convert static projects to match repo format for consistency
	const normalizedProjects = useMemo(() => {
		if (!projectsData || projectsData.length === 0) {
			return [];
		}

		return projectsData.map((project) => {
			// Check if this is a merged project (has isMerged flag)
			if (project.isMerged === true) {
				// Merged project - already has GitHub structure with static enhancements
				return {
					...project,
					// Ensure consistent format for merged projects
					topics: project.topics || [],
					language: project.language || project.technologies?.[0] || "Unknown",
					languages:
						project.technologies?.map((tech) => ({
							name: tech,
							icon: null,
							color: null,
						})) ||
						(project.language
							? [{ name: project.language, icon: null, color: null }]
							: []),
					isMerged: true,
					isStatic: false,
				};
			}

			// Check if this is a static project (has id as string and other static properties)
			const isStaticProject =
				project.isStatic === true ||
				(project.id &&
					(typeof project.id === "string" ||
						project.category ||
						project.status));

			if (isStaticProject) {
				const normalized = {
					id: project.id,
					name: project.name,
					description: project.description,
					html_url: project.githubUrl || project.html_url,
					homepage: project.liveUrl || project.demoUrl || project.homepage,
					topics: project.tags || project.technologies || project.topics || [],
					language:
						project.technologies?.[0] ||
						project.category ||
						project.language ||
						"Unknown",
					languages:
						project.technologies?.map((tech) => ({
							name: tech,
							// Add icon and color if available from mapping - will be computed later
							icon: null,
							color: null,
						})) || [],
					stargazers_count:
						project.stats?.stars || project.stargazers_count || 0,
					forks_count: project.stats?.forks || project.forks_count || 0,
					watchers_count:
						project.stats?.watchers || project.watchers_count || 0,
					open_issues_count:
						project.stats?.issues || project.open_issues_count || 0,
					updated_at:
						project.endDate ||
						project.startDate ||
						project.updated_at ||
						new Date().toISOString(),
					created_at:
						project.startDate || project.created_at || new Date().toISOString(),
					// Additional static project fields
					category: project.category,
					featured: project.featured,
					status: project.status,
					startDate: project.startDate,
					endDate: project.endDate,
					liveUrl: project.liveUrl,
					demoUrl: project.demoUrl,
					documentationUrl: project.documentationUrl,
					imageUrl: project.imageUrl,
					highlights: project.highlights || [],
					isMerged: false,
					isStatic: true,
				};
				return normalized;
			} else {
				// This is a GitHub repo
				const normalized = {
					...project,
					isMerged: false,
					isStatic: false,
				};
				return normalized;
			}
		});
	}, [projectsData]);

	// Get unique languages from repositories
	const availableLanguages = useMemo(() => {
		const languages = new Set();
		normalizedProjects.forEach((project) => {
			if (project.language) {
				languages.add(project.language);
			}
			// For static projects, also add all technologies
			if (project.isStatic && project.languages) {
				project.languages.forEach((lang) => {
					if (lang.name) languages.add(lang.name);
				});
			}
		});
		return Array.from(languages).sort();
	}, [normalizedProjects]);

	// Language icon mapping - comprehensive version from ProjectsStatic.jsx
	const getLanguageIcon = (language) => {
		const iconMap = {
			React: FaReact,
			"Node.js": FaNodeJs,
			MongoDB: SiMongodb,
			Stripe: SiStripe,
			JWT: FaKey,
			"Tailwind CSS": SiTailwindcss,
			"Vue.js": SiVuedotjs,
			"Express.js": SiExpress,
			PostgreSQL: SiPostgresql,
			"Socket.io": SiSocketdotio,
			Redis: SiRedis,
			JavaScript: SiJavascript,
			TypeScript: SiTypescript,
			"Next.js": SiNextdotjs,
			Prisma: SiPrisma,
			Markdown: SiMarkdown,
			Vite: SiVite,
			"Framer Motion": SiFramer,
			"GitHub Pages": SiGithub,
			Python: FaPython,
			HTML: FaHtml5,
			CSS: FaCss3Alt,
			"Chart.js": FaJs,
			"OpenWeather API": FaJs,
			Geolocation: FaJs,
			django: FaPython,
			streamlit: FaPython,
			flask: FaPython,
			python: FaPython,
			"pure-python": FaPython,
			"access-control": FaLock,
			"role-based-access-control": FaUserShield,
			"user-management": FaUsers,
			"login-system": FaSignInAlt,
			"ticket-management": FaTicketAlt,
			"parking-management": FaParking,
			"user-interface": FaDesktop,
			"breach-check": FaExclamationTriangle,
			"email-phishing": FaEnvelopeOpenText,
			"password-safety": FaKey,
			"unsplash-api": FaImage,
			"machine-learning": FaBrain,
			"deep-learning": FaBrain,
			"computer-vision": FaVideo,
			"facial-recognition": FaSmile,
			"emotion-detection": FaMeh,
			"real-time-detection": FaWaveSquare,
			mediapipe: FaHandsHelping,
			opencv: FaCamera,
			"human-computer-interaction": FaUserFriends,
			"facial-landmarks": FaSmileBeam,
			ai: FaRobot,
			blockchain: FaLink,
			cryptocurrency: FaBitcoin,
			dapp: FaCube,
			decentralized: FaNetworkWired,
			"hive-blockchain": FaHive,
			hivesigner: FaSignature,
			keychain: FaKey,
			"restful-api": FaPlug,
			"social-media": FaShareAlt,
			sqlite: FaDatabase,
			"web-application": FaGlobe,
			caching: FaBoxOpen,
			"content-platform": FaEdit,
			"real-time": FaClock,
			"command-line-tool": FaTerminal,
			"cross-platform": FaLaptopCode,
			"cybersecurity-education": FaUserGraduate,
			"data-recovery": FaUndo,
			"dictionary-attack": FaBook,
			"ethical-hacking": FaUserSecret,
			"file-processing": FaFileCode,
			"memory-efficient": FaMemory,
			"multi-format-support": FaFileExport,
			multithreading: FaCogs,
			"password-analysis": FaUnlockAlt,
			"password-cracking": FaUserLock,
			"password-dictionary": FaBookOpen,
			"performance-optimization": FaTachometerAlt,
			"zip-cracker": FaFileArchive,
			"archive-extraction": FaFileArchive,
			"archive-password-recovery": FaFileSignature,
			"brute-force": FaHammer,
			"vscode-extension": FaCode,
			backup: FaSave,
			checkpoint: FaFlag,
			develo: FaCodeBranch,
			productivity: FaLightbulb,
			restore: FaUndoAlt,
			"save-state": FaSave,
			timeline: FaStream,
			vscode: FaCode,
			"browser-extension": FaChrome,
			"web-scraping": FaSpider,
			"data-extraction": FaFileDownload,
			"content-translation": FaLanguage,
			"ai-powered": FaRobot,
			"natural-language-processing": FaLanguage,
			"llm-api": FaRobot,
			"interactive-learning": FaChalkboardTeacher,
			"progress-tracking": FaTasks,
			"video-tutorials": FaVideo,
			quizzes: FaQuestionCircle,
			"self-paced-learning": FaUserClock,
			"educational-platform": FaSchool,
			"code-scaffolding": FaDraftingCompass,
			"project-templates": FaFileCode,
			"developer-tools": FaTools,
			"build-automation": FaCogs,
			"project-generation": FaPlusSquare,
			"yeoman-generator": FaPlusSquare,
			"cli-app": FaTerminal,
			"template-engine": FaCode,
			"dynamic-content": FaRandom,
			"code-generation": FaCode,
			"project-customization": FaWrench,
			"command-line-interface": FaTerminal,
			"react-native": FaReact,
			"mobile-app": FaMobileAlt,
			"ios-app": FaApple,
			"android-app": FaAndroid,
			"push-notifications": FaBell,
			"location-based-services": FaMapMarkerAlt,
			"live-tracking": FaMapMarkedAlt,
			"google-maps-api": FaMap,
			"socket-io": FaRegCommentDots,
			"real-time-communication": FaComments,
			"background-services": FaCog,
			"mobile-development": FaMobile,
			"cross-platform-development": FaMobileAlt,
			"portfolio-website": FaUserCircle,
			"personal-website": FaUser,
			"web-development": FaLaptopCode,
			"front-end-development": FaPaintBrush,
			"responsive-design": FaMobileAlt,
			"dark-mode": FaMoon,
			"github-api": FaGithub,
			"project-showcase": FaBriefcase,
			"dynamic-portfolio": FaSync,
			"ci-cd": FaTruckLoading,
			"github-actions": FaPlayCircle,
			"automated-workflows": FaRobot,
			"continuous-integration": FaSyncAlt,
			"continuous-deployment": FaCloudUploadAlt,
			"devops-tools": FaTools,
			"workflow-automation": FaCogs,
			"repository-management": FaBox,
			"code-quality": FaCheckCircle,
			"release-automation": FaRocket,
			// Basic programming languages
			Java: FaJava,
			PHP: FaPhp,
			Go: SiGo,
			Rust: FaRust,
			Swift: FaSwift,
			Kotlin: SiKotlin,
			Dart: SiDart,
			"C++": SiCplusplus,
			C: SiC,
			Ruby: SiRuby,
			Shell: SiShell,
			Vue: FaVuejs,
		};

		return iconMap[language] || FaJs;
	};

	const getLanguageColor = (language) => {
		const colorMap = {
			React: "#61dafb",
			"Node.js": "#339933",
			MongoDB: "#47A248",
			Stripe: "#635bff",
			JWT: "#000000",
			"Tailwind CSS": "#06b6d4",
			"Vue.js": "#4FC08D",
			"Express.js": "#000000",
			PostgreSQL: "#336791",
			"Socket.io": "#010101",
			Redis: "#DC382D",
			JavaScript: "#f1e05a",
			TypeScript: "#2b7489",
			"Next.js": "#000000",
			Prisma: "#2D3748",
			Markdown: "#083fa1",
			Vite: "#646CFF",
			"Framer Motion": "#0055FF",
			"GitHub Pages": "#222",
			Python: "#3572a5",
			HTML: "#e34c26",
			CSS: "#563d7c",
			"Chart.js": "#ff6384",
			"OpenWeather API": "#f1e05a",
			Geolocation: "#f1e05a",
			django: "#092e20",
			streamlit: "#ff4b4b",
			flask: "#000000",
			python: "#3572a5",
			"pure-python": "#3572a5",
			"access-control": "#f0ad4e",
			"role-based-access-control": "#5bc0de",
			"user-management": "#5cb85c",
			"login-system": "#5bc0de",
			"ticket-management": "#f0ad4e",
			"parking-management": "#5cb85c",
			"user-interface": "#5bc0de",
			"breach-check": "#d9534f",
			"email-phishing": "#f0ad4e",
			"password-safety": "#5cb85c",
			"unsplash-api": "#000000",
			"machine-learning": "#f0ad4e",
			"deep-learning": "#f0ad4e",
			"computer-vision": "#5bc0de",
			"facial-recognition": "#5cb85c",
			"emotion-detection": "#f0ad4e",
			"real-time-detection": "#d9534f",
			mediapipe: "#007bff",
			opencv: "#5cb85c",
			"human-computer-interaction": "#5bc0de",
			"facial-landmarks": "#f0ad4e",
			ai: "#d9534f",
			blockchain: "#f0ad4e",
			cryptocurrency: "#f7931a",
			dapp: "#5bc0de",
			decentralized: "#5cb85c",
			"hive-blockchain": "#e31337",
			hivesigner: "#007bff",
			keychain: "#f0ad4e",
			"restful-api": "#5bc0de",
			"social-media": "#1da1f2",
			sqlite: "#003b57",
			"web-application": "#5cb85c",
			caching: "#f0ad4e",
			"content-platform": "#5bc0de",
			"real-time": "#d9534f",
			"command-line-tool": "#000000",
			"cross-platform": "#5cb85c",
			"cybersecurity-education": "#f0ad4e",
			"data-recovery": "#5bc0de",
			"dictionary-attack": "#d9534f",
			"ethical-hacking": "#000000",
			"file-processing": "#5cb85c",
			"file-security": "#f0ad4e",
			"memory-efficient": "#5bc0de",
			"multi-format-support": "#d9534f",
			multithreading: "#007bff",
			"password-analysis": "#5cb85c",
			"password-cracking": "#d9534f",
			"password-dictionary": "#f0ad4e",
			"performance-optimization": "#5cb85c",
			"zip-cracker": "#d9534f",
			"archive-extraction": "#f0ad4e",
			"archive-password-recovery": "#5bc0de",
			"brute-force": "#d9534f",
			"vscode-extension": "#007acc",
			backup: "#5cb85c",
			checkpoint: "#f0ad4e",
			develo: "#5bc0de",
			productivity: "#5cb85c",
			restore: "#f0ad4e",
			"save-state": "#5cb85c",
			timeline: "#5bc0de",
			vscode: "#007acc",
			"browser-extension": "#4285f4",
			"web-scraping": "#f0ad4e",
			"data-extraction": "#5bc0de",
			"content-translation": "#5cb85c",
			"ai-powered": "#d9534f",
			"natural-language-processing": "#f0ad4e",
			"llm-api": "#d9534f",
			"interactive-learning": "#5bc0de",
			"progress-tracking": "#5cb85c",
			"video-tutorials": "#d9534f",
			quizzes: "#f0ad4e",
			"self-paced-learning": "#5cb85c",
			"educational-platform": "#5bc0de",
			"code-scaffolding": "#f0ad4e",
			"project-templates": "#5bc0de",
			"developer-tools": "#5cb85c",
			"build-automation": "#d9534f",
			"project-generation": "#f0ad4e",
			"yeoman-generator": "#f0ad4e",
			"cli-app": "#000000",
			"template-engine": "#5bc0de",
			"dynamic-content": "#5cb85c",
			"code-generation": "#d9534f",
			"project-customization": "#f0ad4e",
			"command-line-interface": "#000000",
			"react-native": "#61dafb",
			"mobile-app": "#5cb85c",
			"ios-app": "#000000",
			"android-app": "#a4c639",
			"push-notifications": "#f0ad4e",
			"location-based-services": "#d9534f",
			"live-tracking": "#d9534f",
			"google-maps-api": "#4285f4",
			"socket-io": "#010101",
			"real-time-communication": "#5cb85c",
			"background-services": "#5bc0de",
			"mobile-development": "#5cb85c",
			"cross-platform-development": "#5cb85c",
			"portfolio-website": "#5bc0de",
			"personal-website": "#5bc0de",
			"web-development": "#f0ad4e",
			"front-end-development": "#5bc0de",
			"responsive-design": "#5cb85c",
			"dark-mode": "#000000",
			"github-api": "#24292e",
			"project-showcase": "#5bc0de",
			"dynamic-portfolio": "#5cb85c",
			"ci-cd": "#d9534f",
			"github-actions": "#2088ff",
			"automated-workflows": "#5cb85c",
			"continuous-integration": "#f0ad4e",
			"continuous-deployment": "#5bc0de",
			"devops-tools": "#5cb85c",
			"workflow-automation": "#d9534f",
			"repository-management": "#f0ad4e",
			"code-quality": "#5cb85c",
			"release-automation": "#d9534f",
			// Basic programming languages
			Java: "#b07219",
			PHP: "#4f5d95",
			Go: "#00add8",
			Rust: "#dea584",
			Swift: "#ffac45",
			Kotlin: "#f18e33",
			Dart: "#00b4ab",
			"C++": "#f34b7d",
			C: "#555555",
			Ruby: "#701516",
			Shell: "#89e051",
			Vue: "#2c3e50",
		};
		return colorMap[language] || "#6366f1";
	};

	// Filter and sort repositories
	const filteredRepos = useMemo(() => {
		let filtered = normalizedProjects.filter((project) => {
			// Search filter
			const matchesSearch =
				project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(project.description &&
					project.description
						.toLowerCase()
						.includes(searchTerm.toLowerCase())) ||
				(project.topics &&
					project.topics.some((topic) =>
						topic.toLowerCase().includes(searchTerm.toLowerCase())
					)) ||
				(project.category &&
					project.category.toLowerCase().includes(searchTerm.toLowerCase()));

			// Language filter
			const matchesLanguage =
				selectedLanguages.length === 0 ||
				selectedLanguages.includes(project.language) ||
				(project.languages &&
					project.languages.some((lang) =>
						selectedLanguages.includes(lang.name)
					));

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
	}, [normalizedProjects, searchTerm, selectedLanguages, sortBy]);

	// Update current columns on resize and project count change
	useEffect(() => {
		const getCurrentColumnsLocal = () => {
			const projectCount = filteredRepos.length;
			if (typeof window === "undefined") return Math.min(3, projectCount);

			const width = window.innerWidth;
			if (width >= 1024) return Math.min(3, projectCount); // Large screens: max 3 columns
			if (width >= 640) return Math.min(2, projectCount); // Medium screens: max 2 columns
			return 1; // Small screens: 1 column
		};

		const updateColumns = () => {
			setCurrentColumns(getCurrentColumnsLocal());
		};

		updateColumns();
		window.addEventListener("resize", updateColumns);
		return () => window.removeEventListener("resize", updateColumns);
	}, [filteredRepos.length]);

	const toggleLanguageFilter = (language) => {
		setSelectedLanguages((prev) =>
			prev.includes(language)
				? prev.filter((l) => l !== language)
				: [...prev, language]
		);
	};

	// Generate dynamic masonry styles based on project count
	const getMasonryStyles = () => {
		const projectCount = filteredRepos.length;
		if (projectCount === 0) return {};

		return {
			"--masonry-columns-sm": Math.min(1, projectCount),
			"--masonry-columns-md": Math.min(2, projectCount),
			"--masonry-columns-lg": Math.min(3, projectCount),
		};
	};

	// Generate dynamic grid classes based on project count
	const getGridClasses = () => {
		const projectCount = filteredRepos.length;
		if (projectCount === 0) return "grid grid-cols-1 gap-8";

		// Base classes
		let classes =
			"grid gap-8 grid-cols-1 transition-all duration-300 ease-in-out";

		// Add responsive classes based on project count to avoid empty columns (max 3 columns)
		if (projectCount >= 2) classes += " md:grid-cols-2";
		if (projectCount >= 3) classes += " lg:grid-cols-3";

		return classes;
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
				staggerChildren: 0.05, // Reduced stagger for masonry
			},
		},
	};

	const staggerChild = {
		initial: { opacity: 0, y: 20 }, // Reduced initial transform for masonry
		animate: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.4,
				ease: "easeOut",
			},
		},
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
					<div className="text-center">
						<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
						<p className="mt-4 text-gray-300">Loading projects...</p>
						<p className="mt-2 text-sm text-gray-500">
							Debug: Loading={loading.toString()}, Error={error?.toString()},
							ReposLength={repos?.length || 0}
						</p>
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
				{/* Debug Info */}
				{/* <div className="mb-4 p-4 bg-gray-800 rounded text-sm text-gray-300">
					<p>Debug Info:</p>
					<p>Loading: {loading.toString()}</p>
					<p>Error: {error?.toString() || "none"}</p>
					<p>Raw Repos: {repos?.length || 0}</p>
					<p>Projects Data: {projectsData?.length || 0}</p>
					<p>Normalized Projects: {normalizedProjects?.length || 0}</p>
					<p>Filtered Projects: {filteredRepos?.length || 0}</p>
					<p>Settings Mode: {settings.projects?.mode || "none"}</p>
				</div> */}

				{/* Header */}
				<motion.div className="text-center mb-16 relative z-10" {...fadeInUp}>
					<h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 relative z-20">
						My Projects
					</h1>
					<p className="text-xl text-gray-300 max-w-3xl mx-auto">
						{settings.projects?.mode === "static" ? (
							<>A curated collection of my featured projects and experiments</>
						) : settings.projects?.mode === "hybrid" ? (
							<>
								Showcasing both live projects from{" "}
								<span className="text-purple-400 font-semibold">
									{settings.github?.username}
								</span>{" "}
								and curated featured projects
							</>
						) : settings.github?.type === "org" ? (
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
						{normalizedProjects.length} project
						{normalizedProjects.length !== 1 ? "s" : ""} •{" "}
						{filteredRepos.length} shown
						{layoutMode === "masonry" && filteredRepos.length > 0 && (
							<> • {currentColumns} columns</>
						)}
						{settings.projects?.mode === "hybrid" && (
							<>
								{" "}
								• {normalizedProjects.filter((p) => p.isStatic).length} static +{" "}
								{normalizedProjects.filter((p) => !p.isStatic).length} dynamic
							</>
						)}
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
					<div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-2">
						<button
							onClick={() => setShowFilters(!showFilters)}
							className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-colors backdrop-blur-sm text-sm"
						>
							<FunnelIcon className="w-4 h-4 flex-shrink-0" />
							<span className="whitespace-nowrap">
								Languages ({selectedLanguages.length})
							</span>
						</button>

						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm text-sm min-w-0"
						>
							<option value="updated">Recently Updated</option>
							<option value="created">Recently Created</option>
							<option value="stars">Most Stars</option>
							<option value="name">Name (A-Z)</option>
						</select>

						{/* Layout Toggle */}
						<button
							onClick={() =>
								setLayoutMode(layoutMode === "masonry" ? "grid" : "masonry")
							}
							className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-colors backdrop-blur-sm text-sm"
							title={`Switch to ${
								layoutMode === "masonry" ? "grid" : "masonry"
							} layout`}
						>
							{layoutMode === "masonry" ? (
								<>
									<svg
										className="w-4 h-4 flex-shrink-0"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
									</svg>
									<span className="hidden sm:inline">Grid</span>
								</>
							) : (
								<>
									<svg
										className="w-4 h-4 flex-shrink-0"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M4 3a1 1 0 000 2h12a1 1 0 100-2H4zM4 7a1 1 0 000 2h6a1 1 0 100-2H4zM4 11a1 1 0 100 2h4a1 1 0 100-2H4zM12 11a1 1 0 100 2h4a1 1 0 100-2h-4zM4 15a1 1 0 100 2h8a1 1 0 100-2H4z" />
									</svg>
									<span className="hidden sm:inline">Masonry</span>
								</>
							)}
						</button>

						{(searchTerm ||
							selectedLanguages.length > 0 ||
							sortBy !== "updated") && (
							<button
								onClick={clearFilters}
								className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-colors backdrop-blur-sm text-sm"
							>
								<AdjustmentsHorizontalIcon className="w-4 h-4 flex-shrink-0" />
								<span className="hidden sm:inline">Clear</span>
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

				{/* Projects Grid/Masonry */}
				{filteredRepos.length > 0 ? (
					<motion.div
						key={layoutMode} // Force re-render on layout change
						className={
							layoutMode === "masonry"
								? "masonry-grid-dynamic"
								: getGridClasses()
						}
						style={layoutMode === "masonry" ? getMasonryStyles() : {}}
						data-project-count={filteredRepos.length}
						variants={staggerContainer}
						initial="initial"
						animate="animate"
					>
						{filteredRepos.map((repo) => {
							return (
								<motion.div
									key={repo.id}
									variants={staggerChild}
									className={layoutMode === "masonry" ? "masonry-item" : ""}
								>
									<ProjectCard project={repo} />
								</motion.div>
							);
						})}
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
						{settings.projects?.mode === "static" ? (
							<>
								Projects configured from{" "}
								<span className="text-purple-400">Static Settings</span>
							</>
						) : settings.projects?.mode === "hybrid" ? (
							<>
								Projects from{" "}
								<span className="text-purple-400">
									{settings.github?.type === "org"
										? "GitHub Organization"
										: "GitHub User"}
								</span>
								{" + "}
								<span className="text-purple-400">Static Settings</span>
								{" • "}
								<span className="text-purple-400">
									{settings.github?.username}
								</span>
							</>
						) : (
							<>
								Projects fetched from{" "}
								<span className="text-purple-400">
									{settings.github?.type === "org"
										? "GitHub Organization"
										: "GitHub User"}
								</span>
								{" • "}
								<span className="text-purple-400">
									{settings.github?.username}
								</span>
							</>
						)}
					</p>
					{settings.projects?.mode !== "static" &&
						settings.projects?.ignore &&
						settings.projects.ignore.length > 0 && (
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
