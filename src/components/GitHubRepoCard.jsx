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
import React, { memo, useMemo } from "react";
import {
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
  StarIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import {
  FaGithub,
  FaJs,
  FaPython,
  FaReact,
  FaVuejs,
  FaNodeJs,
  FaJava,
  FaPhp,
  FaSwift,
  FaRust,
  FaHtml5,
  FaCss3Alt,
  FaDocker,
  FaAws,
  FaDatabase,
} from "react-icons/fa";
import {
	SiTypescript,
	SiMongodb,
	SiPostgresql,
	SiMysql,
	SiRedis,
	SiTailwindcss,
	SiNextdotjs,
	SiExpress,
	SiDjango,
	SiFlask,
	SiGithubcopilot,
	SiKotlin,
	SiDart,
	SiFlutter,
	SiAndroid,
	SiIos,
	SiFirebase,
	SiGraphql,
	SiDocker,
	SiKubernetes,
	SiTensorflow,
	SiPytorch,
	SiJupyter,
	SiNginx,
	SiApache,
	SiLinux,
	SiGit,
	SiVite,
	SiWebpack,
	SiBabel,
	SiGo,
} from "react-icons/si";

const GitHubRepoCard = memo(({ repo, index = 0 }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  const techIcons = useMemo(() => {
    const icons = [];
    const iconMap = {
			// Languages
			javascript: { icon: FaJs, color: "#f1e05a" },
			typescript: { icon: SiTypescript, color: "#2b7489" },
			python: { icon: FaPython, color: "#3572a5" },
			java: { icon: FaJava, color: "#b07219" },
			php: { icon: FaPhp, color: "#4f5d95" },
			go: { icon: SiGo, color: "#00add8" },
			rust: { icon: FaRust, color: "#dea584" },
			swift: { icon: FaSwift, color: "#ffac45" },
			kotlin: { icon: SiKotlin, color: "#f18e33" },
			dart: { icon: SiDart, color: "#00b4ab" },
			html: { icon: FaHtml5, color: "#e34c26" },
			css: { icon: FaCss3Alt, color: "#563d7c" },

			// Frameworks & Libraries
			react: { icon: FaReact, color: "#61dafb" },
			vue: { icon: FaVuejs, color: "#4fc08d" },
			nodejs: { icon: FaNodeJs, color: "#339933" },
			node: { icon: FaNodeJs, color: "#339933" },
			nextjs: { icon: SiNextdotjs, color: "#000000" },
			next: { icon: SiNextdotjs, color: "#000000" },
			express: { icon: SiExpress, color: "#000000" },
			django: { icon: SiDjango, color: "#092e20" },
			flask: { icon: SiFlask, color: "#000000" },
			tailwind: { icon: SiTailwindcss, color: "#38b2ac" },
			tailwindcss: { icon: SiTailwindcss, color: "#38b2ac" },
			flutter: { icon: SiFlutter, color: "#02569b" },
			vite: { icon: SiVite, color: "#646cff" },
			webpack: { icon: SiWebpack, color: "#8dd6f9" },
			babel: { icon: SiBabel, color: "#f9dc3e" },

			// Databases
			mongodb: { icon: SiMongodb, color: "#47a248" },
			mysql: { icon: SiMysql, color: "#4479a1" },
			postgresql: { icon: SiPostgresql, color: "#336791" },
			postgres: { icon: SiPostgresql, color: "#336791" },
			redis: { icon: SiRedis, color: "#dc382d" },
			database: { icon: FaDatabase, color: "#6366f1" },

			// Cloud & Tools
			docker: { icon: FaDocker, color: "#2496ed" },
			kubernetes: { icon: SiKubernetes, color: "#326ce5" },
			aws: { icon: FaAws, color: "#ff9900" },
			firebase: { icon: SiFirebase, color: "#ffca28" },
			graphql: { icon: SiGraphql, color: "#e10098" },
			nginx: { icon: SiNginx, color: "#009639" },
			apache: { icon: SiApache, color: "#d22128" },
			linux: { icon: SiLinux, color: "#fcc624" },
			git: { icon: SiGit, color: "#f05032" },

			// AI/ML
			tensorflow: { icon: SiTensorflow, color: "#ff6f00" },
			pytorch: { icon: SiPytorch, color: "#ee4c2c" },
			jupyter: { icon: SiJupyter, color: "#f37626" },

			// Mobile
			android: { icon: SiAndroid, color: "#3ddc84" },
			ios: { icon: SiIos, color: "#000000" },

			// Tools
			githubcopilot: { icon: SiGithubcopilot, color: "#ffffff" },
		};

    // Check language first
    if (repo.language) {
      const langKey = repo.language.toLowerCase();
      if (iconMap[langKey]) {
        icons.push(iconMap[langKey]);
      }
    }

    // Check topics for additional technologies
    if (repo.topics && repo.topics.length > 0) {
      repo.topics.forEach((topic) => {
        const topicKey = topic.toLowerCase();
        if (
          iconMap[topicKey] &&
          !icons.find((icon) => icon === iconMap[topicKey])
        ) {
          icons.push(iconMap[topicKey]);
        }
      });
    }

    return icons.slice(0, 6); // Limit to 6 icons to avoid clutter
  }, [repo.language, repo.topics]);

  return (
		<div
			className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 opacity-0 animate-fade-in"
			style={{ animationDelay: `${Math.min(index * 0.1, 0.3)}s` }}
		>
			{/* Header */}
			<div className="flex items-start justify-between mb-6">
				<div className="flex items-center space-x-3 flex-1 min-w-0">
					<div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex-shrink-0">
						<CodeBracketIcon className="w-5 h-5 text-white" />
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors truncate mb-2">
							{repo.name}
						</h3>

						{/* Technology Icons */}
						{techIcons.length > 0 && (
							<div className="flex items-center space-x-2 mb-3 flex-wrap gap-y-1">
								{techIcons.map((tech, idx) => {
									const IconComponent = tech.icon;
									return (
										<div
											key={idx}
											className="p-1 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex-shrink-0"
											title={tech.title || repo.language}
										>
											<IconComponent
												className="w-4 h-4"
												style={{ color: tech.color }}
											/>
										</div>
									);
								})}
							</div>
						)}

						{repo.language && (
							<div className="flex items-center space-x-2 mt-1">
								<div
									className="w-3 h-3 rounded-full flex-shrink-0"
									style={{ backgroundColor: getLanguageColor(repo.language) }}
								></div>
								<span className="text-sm text-gray-400 truncate">
									{repo.language}
								</span>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Description */}
			<div className="mb-6">
				<p className="text-gray-300 text-sm leading-loose tracking-wide text-justify">
					{repo.description || "No description available"}
				</p>
			</div>

			{/* Topics */}
			{repo.topics && repo.topics.length > 0 && (
				<div className="mb-6">
					<div className="flex flex-wrap gap-2">
						{repo.topics.slice(0, 3).map((topic, idx) => (
							<span
								key={idx}
								className="px-3 py-1.5 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30 flex-shrink-0 font-medium"
							>
								{topic}
							</span>
						))}
						{repo.topics.length > 3 && (
							<span className="px-3 py-1.5 bg-gray-500/20 text-gray-400 text-xs rounded-full border border-gray-500/30 flex-shrink-0 font-medium">
								+{repo.topics.length - 3} more
							</span>
						)}
					</div>
				</div>
			)}

			{/* Stats */}
			<div className="mb-6">
				<div className="flex items-center space-x-6 text-sm text-gray-400 flex-wrap gap-y-2">
					<div className="flex items-center space-x-2 flex-shrink-0">
						<StarIcon className="w-4 h-4" />
						<span className="font-medium">{repo.stargazers_count} stars</span>
					</div>
					<div className="flex items-center space-x-2 flex-shrink-0">
						<EyeIcon className="w-4 h-4" />
						<span className="font-medium">{repo.forks_count} forks</span>
					</div>
					<div className="flex items-center space-x-2 flex-shrink-0">
						<span className="text-xs text-gray-500">
							Updated {formatDate(repo.updated_at)}
						</span>
					</div>
				</div>
			</div>

			{/* Actions */}
			<div className="flex space-x-4 flex-wrap gap-y-3">
				<a
					href={repo.html_url}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all duration-300 text-sm font-medium hover:scale-105 flex-shrink-0 border border-gray-600"
				>
					<FaGithub className="w-4 h-4" />
					<span>View Code</span>
				</a>

				{repo.homepage && repo.homepage.trim() && (
					<a
						href={repo.homepage}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 text-sm font-medium hover:scale-105 flex-shrink-0 border border-purple-500"
					>
						<ArrowTopRightOnSquareIcon className="w-4 h-4" />
						<span>Live Demo</span>
					</a>
				)}
			</div>
		</div>
	);
});

export default GitHubRepoCard;
