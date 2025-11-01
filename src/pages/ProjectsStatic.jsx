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
import useMergedProjects from "../hooks/useMergedProjects";
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
import ProjectCard from "../components/ProjectCard";

const ProjectsTemp = () => {
	const { projects: mergedProjects, loading, error } = useMergedProjects();
	const [projects, setProjects] = useState([]);

	// Update projects when merged projects change
	useEffect(() => {
		setProjects(mergedProjects);
	}, [mergedProjects]);

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
