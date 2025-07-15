import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
	CodeBracketIcon,
	StarIcon,
	EyeIcon,
	ArrowTopRightOnSquareIcon,
	CalendarIcon,
} from "@heroicons/react/24/outline";
import {
	FaJs,
	FaPython,
	FaReact,
	FaJava,
	FaGithub,
	FaNodeJs,
	FaHtml5,
	FaCss3Alt,
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
	FaFileShield,
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
	SiMongodb,
	SiTailwindcss,
	SiNextdotjs,
	SiExpress,
	SiPostgresql,
	SiRedis,
	SiStripe,
	SiJwt,
	SiVuedotjs,
	SiJavascript,
	SiSocketdotio,
	SiPrisma,
	SiMarkdown,
	SiFramer,
	SiVite,
	SiGithub,
} from "react-icons/si";
import ProjectCard from "../components/ProjectCard/ProjectCard";

const ProjectsTemp = () => {
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Technology to icon mapping
	const getTechIcon = (techName) => {
		const iconMap = {
			React: FaReact,
			"Node.js": FaNodeJs,
			MongoDB: SiMongodb,
			Stripe: SiStripe,
			JWT: SiJwt,
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
			"file-security": FaFileShield,
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
		};
		return iconMap[techName] || FaJs;
	};

	// Technology to color mapping
	const getTechColor = (techName) => {
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
		};
		return colorMap[techName] || "#6b7280";
	};

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				setLoading(true);
				const response = await fetch("/settings.json");

				if (!response.ok) {
					throw new Error(`Failed to fetch settings: ${response.status}`);
				}

				const settings = await response.json();
				const staticProjects = settings.projects?.staticProjects || [];

				// Transform static projects to normalized format (same as Projects.jsx)
				const transformedProjects = staticProjects.map((project) => ({
					id: project.id,
					name: project.name,
					description: project.description,
					html_url: project.githubUrl,
					homepage: project.liveUrl || project.demoUrl,
					topics: project.tags || project.technologies || [],
					language: project.technologies?.[0] || project.category || "Unknown",
					languages:
						project.technologies?.map((tech) => ({
							name: tech,
							icon: getTechIcon(tech),
							color: getTechColor(tech)
						})) || [],
					stargazers_count: project.stats?.stars || 0,
					forks_count: project.stats?.forks || 0,
					watchers_count: project.stats?.watchers || 0,
					open_issues_count: project.stats?.issues || 0,
					updated_at:
						project.endDate || project.startDate || new Date().toISOString(),
					created_at: project.startDate || new Date().toISOString(),
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
					isStatic: true,
					// Add counter value for demo
					counterValue: Math.floor(Math.random() * 300) + 50,
				}));

				setProjects(transformedProjects);
			} catch (err) {
				console.error("Error fetching static projects:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchProjects();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen py-20 px-4 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
					<p className="text-gray-400 mt-4">Loading projects...</p>
				</div>
			</div>
		);
	}

	if (error && projects.length === 0) {
		return (
			<div className="min-h-screen py-20 px-4 flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-400 text-lg">
						Error loading projects: {error}
					</p>
					<p className="text-gray-400 mt-2">
						Please check your settings.json file
					</p>
				</div>
			</div>
		);
	}

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

	return (
		<div className="min-h-screen py-20 px-4">
			<div className="max-w-7xl mx-auto">
				<motion.div
					variants={staggerContainer}
					initial="initial"
					animate="animate"
				>
					{/* Header */}
					<motion.div className="text-center mb-16" variants={fadeInUp}>
						<h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
							Projects
						</h1>
						<p className="text-xl text-gray-300 mb-2">
							Showcasing projects configured through settings.json
						</p>
						<div className="text-sm text-gray-400">
							{projects.length} projects loaded dynamically • Config-driven
							portfolio
						</div>
					</motion.div>

					{/* Projects Grid */}
					<motion.div
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
						variants={staggerContainer}
					>
						{projects.map((project) => (
							<motion.div key={project.id} variants={staggerChild}>
								<ProjectCard project={project} />
							</motion.div>
						))}
					</motion.div>

					{/* Temporary Notice */}
					{/* <motion.div
            className="text-center mt-16 p-6 bg-yellow-600/10 border border-yellow-500/30 rounded-xl"
            variants={fadeInUp}
          >
            <p className="text-yellow-400 text-sm">
              <strong>Note:</strong> This is a temporary static view. The dynamic projects page
              with live GitHub data and CounterAPI integration is being finalized.
            </p>
          </motion.div> */}
				</motion.div>
			</div>
		</div>
	);
};

export default ProjectsTemp;
