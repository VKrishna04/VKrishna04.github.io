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
import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
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
  FaNode,
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
  SiCsharp,
  SiR,
  SiScala,
  SiElixir,
  SiHaskell,
  SiClojure,
  SiLua,
  SiPerl,
  SiMatlab,
  SiJulia,
  SiZig,
  SiAssemblyScript,
  SiSolidity,
  SiWebassembly,
} from "react-icons/si";

// Language icon mapping
const languageIcons = {
  JavaScript: { icon: FaJs, color: "text-yellow-400" },
  TypeScript: { icon: SiTypescript, color: "text-blue-500" },
  Python: { icon: FaPython, color: "text-yellow-400" },
  Java: { icon: FaJava, color: "text-red-500" },
  "C++": { icon: SiCplusplus, color: "text-blue-600" },
  C: { icon: SiC, color: "text-blue-700" },
  "C#": { icon: SiCsharp, color: "text-purple-600" },
  Go: { icon: SiGo, color: "text-blue-400" },
  Rust: { icon: FaRust, color: "text-orange-600" },
  PHP: { icon: FaPhp, color: "text-purple-500" },
  Ruby: { icon: SiRuby, color: "text-red-600" },
  Swift: { icon: FaSwift, color: "text-orange-500" },
  Kotlin: { icon: SiKotlin, color: "text-purple-500" },
  Dart: { icon: SiDart, color: "text-blue-500" },
  HTML: { icon: FaHtml5, color: "text-orange-500" },
  CSS: { icon: FaCss3Alt, color: "text-blue-500" },
  React: { icon: FaReact, color: "text-blue-400" },
  Vue: { icon: FaVuejs, color: "text-green-500" },
  "Node.js": { icon: FaNode, color: "text-green-600" },
  Shell: { icon: SiShell, color: "text-gray-400" },
  R: { icon: SiR, color: "text-blue-600" },
  Scala: { icon: SiScala, color: "text-red-600" },
  Elixir: { icon: SiElixir, color: "text-purple-600" },
  Haskell: { icon: SiHaskell, color: "text-purple-700" },
  Clojure: { icon: SiClojure, color: "text-green-600" },
  Lua: { icon: SiLua, color: "text-blue-600" },
  Perl: { icon: SiPerl, color: "text-blue-700" },
  MATLAB: { icon: SiMatlab, color: "text-orange-600" },
  Julia: { icon: SiJulia, color: "text-purple-600" },
  Zig: { icon: SiZig, color: "text-orange-500" },
  AssemblyScript: { icon: SiAssemblyScript, color: "text-blue-600" },
  Solidity: { icon: SiSolidity, color: "text-gray-700" },
  WebAssembly: { icon: SiWebassembly, color: "text-purple-600" },
};

// Default fallback icon
const DefaultIcon = CodeBracketIcon;

const EnhancedGitHubRepoCard = ({ repo }) => {
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

  const getLangaugeIcon = (language) => {
    const langConfig = languageIcons[language];
    if (langConfig) {
      const IconComponent = langConfig.icon;
      return <IconComponent className={`w-4 h-4 ${langConfig.color}`} />;
    }
    return <DefaultIcon className="w-4 h-4 text-gray-400" />;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      y: -8,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
              {repo.name}
            </h3>
            <p className="text-gray-300 text-sm line-clamp-2 mb-3">
              {repo.description || "No description available"}
            </p>
          </div>
          <div className="flex gap-2">
            <motion.a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-gray-700/50 hover:bg-purple-600/20 text-gray-400 hover:text-purple-400 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            </motion.a>
            {repo.homepage && (
              <motion.a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-700/50 hover:bg-blue-600/20 text-gray-400 hover:text-blue-400 transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <EyeIcon className="w-4 h-4" />
              </motion.a>
            )}
          </div>
        </div>

        {/* Top 3 Languages */}
        {repo.languages && repo.languages.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-400">
                Top Languages:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {repo.languages.map((lang, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-700/30 border border-gray-600/30"
                >
                  {getLangaugeIcon(lang.name)}
                  <span className="text-xs font-medium text-gray-300">
                    {lang.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {lang.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Primary Language (fallback if no detailed languages) */}
        {(!repo.languages || repo.languages.length === 0) && repo.language && (
          <div className="mb-4">
            <div className="flex items-center gap-2">
              {getLangaugeIcon(repo.language)}
              <span className="text-sm text-gray-300">{repo.language}</span>
            </div>
          </div>
        )}

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {repo.topics.slice(0, 6).map((topic, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-purple-600/20 text-purple-300 rounded-full border border-purple-500/30"
                >
                  {topic}
                </span>
              ))}
              {repo.topics.length > 6 && (
                <span className="px-2 py-1 text-xs text-gray-400">
                  +{repo.topics.length - 6} more
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
              <span>{formatCount(repo.stargazers_count)}</span>
            </div>
            <div className="flex items-center gap-1">
              <CodeBracketIcon className="w-4 h-4" />
              <span>{formatCount(repo.forks_count)} forks</span>
            </div>
            {repo.counterValue !== null && repo.counterValue !== undefined && (
              <div className="flex items-center gap-1 text-blue-400">
                <EyeIcon className="w-4 h-4" />
                <span>{formatCount(repo.counterValue)} views</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-700/50">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-3 h-3" />
            <span>Updated {formatDate(repo.updated_at)}</span>
          </div>
          {repo.open_issues_count > 0 && (
            <span className="text-orange-400">
              {repo.open_issues_count} open issues
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedGitHubRepoCard;
