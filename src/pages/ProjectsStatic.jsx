import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  CodeBracketIcon,
  StarIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { FaJs, FaPython, FaReact, FaJava, FaGithub } from "react-icons/fa";
import {
  SiTypescript,
  SiMongodb,
  SiTailwindcss,
  SiNextdotjs,
} from "react-icons/si";

const ProjectsTemp = () => {
  // Static project data for now
  const staticProjects = [
    {
      id: 1,
      name: "Portfolio Website",
      description:
        "Modern React portfolio with animations and dark theme. Built with Vite, Tailwind CSS, and Framer Motion for smooth user experience.",
      html_url: "https://github.com/VKrishna04/VKrishna04.github.io",
      homepage: "https://vkrishna04.github.io",
      topics: ["react", "portfolio", "framer-motion", "tailwind", "vite"],
      language: "JavaScript",
      languages: [
        {
          name: "JavaScript",
          percentage: "65.2",
          icon: FaJs,
          color: "#f1e05a",
        },
        {
          name: "CSS",
          percentage: "25.8",
          icon: SiTailwindcss,
          color: "#38b2ac",
        },
        { name: "HTML", percentage: "9.0", icon: FaReact, color: "#e34c26" },
      ],
      stargazers_count: 12,
      forks_count: 3,
      updated_at: "2025-01-05T10:30:00Z",
      counterValue: 156,
    },
    {
      id: 2,
      name: "CounterAPI",
      description:
        "A REST API for tracking project views and analytics. Built with Node.js and MongoDB for reliable data persistence.",
      html_url: "https://github.com/Life-Experimentalist/CounterAPI",
      homepage: "https://counterapi-9k7p.onrender.com",
      topics: ["nodejs", "mongodb", "rest-api", "analytics", "express"],
      language: "JavaScript",
      languages: [
        {
          name: "JavaScript",
          percentage: "85.4",
          icon: FaJs,
          color: "#f1e05a",
        },
        { name: "HTML", percentage: "10.2", icon: FaReact, color: "#e34c26" },
        {
          name: "CSS",
          percentage: "4.4",
          icon: SiTailwindcss,
          color: "#563d7c",
        },
      ],
      stargazers_count: 8,
      forks_count: 2,
      updated_at: "2025-01-04T15:20:00Z",
      counterValue: 89,
    },
    {
      id: 3,
      name: "Task Management App",
      description:
        "Full-stack task management application with user authentication, real-time updates, and collaborative features.",
      html_url: "https://github.com/VKrishna04/task-manager",
      homepage: null,
      topics: ["react", "nodejs", "mongodb", "authentication", "real-time"],
      language: "TypeScript",
      languages: [
        {
          name: "TypeScript",
          percentage: "72.1",
          icon: SiTypescript,
          color: "#2b7489",
        },
        {
          name: "JavaScript",
          percentage: "20.3",
          icon: FaJs,
          color: "#f1e05a",
        },
        {
          name: "CSS",
          percentage: "7.6",
          icon: SiTailwindcss,
          color: "#563d7c",
        },
      ],
      stargazers_count: 25,
      forks_count: 7,
      updated_at: "2025-01-03T09:15:00Z",
      counterValue: 234,
    },
    {
      id: 4,
      name: "Data Analytics Dashboard",
      description:
        "Interactive dashboard for data visualization and analytics using Python, Pandas, and Plotly.",
      html_url: "https://github.com/VKrishna04/analytics-dashboard",
      homepage: "https://analytics-demo.vercel.app",
      topics: ["python", "pandas", "plotly", "data-science", "dashboard"],
      language: "Python",
      languages: [
        {
          name: "Python",
          percentage: "88.9",
          icon: FaPython,
          color: "#3572a5",
        },
        { name: "JavaScript", percentage: "8.1", icon: FaJs, color: "#f1e05a" },
        { name: "HTML", percentage: "3.0", icon: FaReact, color: "#e34c26" },
      ],
      stargazers_count: 18,
      forks_count: 5,
      updated_at: "2025-01-02T14:45:00Z",
      counterValue: 178,
    },
    {
      id: 5,
      name: "E-commerce Platform",
      description:
        "Modern e-commerce platform with Next.js, Stripe integration, and admin dashboard for inventory management.",
      html_url: "https://github.com/VKrishna04/ecommerce-platform",
      homepage: "https://shop-demo.vercel.app",
      topics: ["nextjs", "stripe", "ecommerce", "react", "mongodb"],
      language: "TypeScript",
      languages: [
        {
          name: "TypeScript",
          percentage: "68.7",
          icon: SiTypescript,
          color: "#2b7489",
        },
        {
          name: "JavaScript",
          percentage: "25.2",
          icon: FaJs,
          color: "#f1e05a",
        },
        {
          name: "CSS",
          percentage: "6.1",
          icon: SiTailwindcss,
          color: "#563d7c",
        },
      ],
      stargazers_count: 42,
      forks_count: 12,
      updated_at: "2025-01-01T11:30:00Z",
      counterValue: 312,
    },
    {
      id: 6,
      name: "Machine Learning Toolkit",
      description:
        "Collection of machine learning algorithms and utilities implemented in Python with Jupyter notebooks.",
      html_url: "https://github.com/VKrishna04/ml-toolkit",
      homepage: null,
      topics: [
        "python",
        "machine-learning",
        "jupyter",
        "scikit-learn",
        "tensorflow",
      ],
      language: "Python",
      languages: [
        {
          name: "Python",
          percentage: "92.3",
          icon: FaPython,
          color: "#3572a5",
        },
        {
          name: "Jupyter Notebook",
          percentage: "7.7",
          icon: FaPython,
          color: "#f37626",
        },
      ],
      stargazers_count: 35,
      forks_count: 9,
      updated_at: "2024-12-30T16:20:00Z",
      counterValue: 267,
    },
  ];

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
              Exploring my coding journey through repositories
            </p>
            <div className="text-sm text-gray-400">
              {staticProjects.length} repositories • Temporary static view
            </div>
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            variants={staggerContainer}
          >
            {staticProjects.map((repo) => (
              <motion.div
                key={repo.id}
                variants={staggerChild}
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
                        {repo.name}
                      </h3>
                      <p className="text-gray-300 text-sm line-clamp-3 mb-3">
                        {repo.description}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <motion.a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-gray-700/50 hover:bg-purple-600/20 text-gray-400 hover:text-purple-400 transition-all duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaGithub className="w-4 h-4" />
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
                          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        </motion.a>
                      )}
                    </div>
                  </div>

                  {/* Top Languages */}
                  {repo.languages && repo.languages.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-400">
                          Languages:
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {repo.languages.map((lang, index) => {
                          const IconComponent = lang.icon;
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-700/30 border border-gray-600/30"
                            >
                              <IconComponent
                                className="w-4 h-4"
                                style={{ color: lang.color }}
                              />
                              <span className="text-xs font-medium text-gray-300">
                                {lang.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {lang.percentage}%
                              </span>
                            </div>
                          );
                        })}
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
                      {repo.counterValue && (
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
                  </div>
                </div>
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
