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

import { useState, useEffect } from "react";
import {
	FaHeart,
	FaGithub,
	FaLinkedin,
	FaTwitter,
	FaInstagram,
	FaDiscord,
	FaYoutube,
	FaTwitch,
	FaTiktok,
	FaMedium,
	FaDev,
	FaStackOverflow,
	FaDribbble,
	FaBehance,
	FaCodepen,
	FaSpotify,
	FaPinterest,
	FaReddit,
	FaAws,
	FaArrowUp,
} from "react-icons/fa";
import {
	SiLeetcode,
	SiHackerrank,
	SiKaggle,
	SiYoutubemusic,
	SiVercel,
	SiHeroku,
} from "react-icons/si";
import useProjectsData from "../hooks/useProjectsData";

const Footer = () => {
	const [settings, setSettings] = useState({});
	const { repos: repositories } = useProjectsData();

	useEffect(() => {
		// Fetch settings for footer configuration
		fetch("/settings.json")
			.then((response) => response.json())
			.then((data) => setSettings(data))
			.catch((error) => console.warn("Could not fetch settings:", error));
	}, []);

	// Enhanced icon mapping for social links and made with icon
	const iconMap = {
		FaHeart,
		FaGithub,
		FaLinkedin,
		FaTwitter,
		FaInstagram,
		FaDiscord,
		FaYoutube,
		FaTwitch,
		FaTiktok,
		FaMedium,
		FaDev,
		FaStackOverflow,
		FaDribbble,
		FaBehance,
		FaCodepen,
		FaSpotify,
		FaPinterest,
		FaReddit,
		FaAws,
		FaArrowUp,
		SiLeetcode,
		SiHackerrank,
		SiKaggle,
		SiYoutubemusic,
		SiVercel,
		SiHeroku,
	};

	const getIconComponent = (iconName) => {
		return iconMap[iconName];
	};

	const getSocialLinks = () => {
		if (!settings.footer?.socialLinks?.show || !settings.social?.platforms)
			return [];

		return settings.social.platforms.filter(
			(platform) =>
				platform.enabled &&
				platform.url &&
				platform.url.trim() !== "" &&
				platform.showInFooter
		);
	};

	const getProjectsCount = () => {
		const footerConfig = settings.footer || {};
		const statsConfig = footerConfig.stats || {};

		if (statsConfig.countProjectsFromData && repositories.length > 0) {
			return `${repositories.length}+`;
		}

		// Fallback to manual count or default
		const projectsStat = statsConfig.items?.find(
			(item) => item.key === "projects"
		);
		return projectsStat?.value || "100+";
	};

	const getStatValue = (item) => {
		if (item.key === "projects" && item.value === "auto") {
			return getProjectsCount();
		}
		return item.value;
	};

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const footerConfig = settings.footer || {};
	const styling = footerConfig.styling || {};
	const socialLinks = getSocialLinks();
	const aboutConfig = footerConfig.about || {};
	const statsConfig = footerConfig.stats || {};
	const quickLinksConfig = footerConfig.quickLinks || {};

	// Calculate grid columns based on what's shown
	const sectionsShown = [
		aboutConfig.show !== false, // About section
		quickLinksConfig.show === true, // Quick links (only if explicitly enabled)
		socialLinks.length > 0, // Social section
	].filter(Boolean).length;

	const gridCols =
		sectionsShown === 1
			? "grid-cols-1"
			: sectionsShown === 2
			? "grid-cols-1 md:grid-cols-2"
			: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

	return (
		<footer
			className={`relative ${
				styling.backgroundColor ||
				"bg-gradient-to-b from-gray-900/80 to-black/90 backdrop-blur-sm"
			} border-t ${
				styling.borderColor || "border-purple-500/20"
			} overflow-hidden`}
		>
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-5">
				<div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10"></div>
				<div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
			</div>

			<div className="relative max-w-7xl mx-auto px-4 py-12">
				{/* Main Footer Content */}
				{sectionsShown > 0 && (
					<div className={`grid ${gridCols} gap-8 mb-8`}>
						{/* About Section */}
						{aboutConfig.show !== false && (
							<div className="space-y-4">
								<h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
									{aboutConfig.title ||
										settings.display?.officialName ||
										"Krishna GSVV"}
								</h3>
								<p
									className={`text-sm leading-relaxed ${
										styling.textColor || "text-gray-400"
									}`}
								>
									{aboutConfig.description ||
										"Full-stack developer passionate about creating innovative web applications and contributing to open source projects. Always learning, always building."}
								</p>

								{/* Configurable Stats */}
								{statsConfig.show !== false &&
									statsConfig.items &&
									statsConfig.items.filter((item) => item.show !== false)
										.length > 0 && (
										<div className="flex flex-wrap gap-6 text-sm">
											{statsConfig.items
												.filter((item) => item.show !== false)
												.map((item, index) => (
													<div key={index} className="text-center">
														<div
															className={`font-semibold ${
																item.color || "text-purple-400"
															}`}
														>
															{getStatValue(item)}
														</div>
														<div
															className={styling.textColor || "text-gray-500"}
														>
															{item.label}
														</div>
													</div>
												))}
										</div>
									)}
							</div>
						)}

						{/* Quick Links - Only show if explicitly enabled */}
						{quickLinksConfig.show === true && (
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-white">
									Quick Links
								</h3>
								<nav className="space-y-2">
									{[
										{ name: "Home", path: "/" },
										{ name: "About", path: "/about" },
										{ name: "Projects", path: "/projects" },
										{ name: "Resume", path: "/resume" },
										{ name: "Contact", path: "/contact" },
									].map((link) => (
										<a
											key={link.path}
											href={link.path}
											className={`block text-sm transition-colors duration-300 ${
												styling.textColor || "text-gray-400"
											} hover:text-purple-400 hover:translate-x-1 transform transition-transform`}
										>
											{link.name}
										</a>
									))}
								</nav>
							</div>
						)}

						{/* Contact Info & Social */}
						{socialLinks.length > 0 && (
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-white">
									Let's Connect
								</h3>

								{/* Contact Info */}
								{settings.social?.contact && (
									<div className="space-y-2 text-sm">
										{settings.social.contact.email && (
											<a
												href={`mailto:${settings.social.contact.email}`}
												className={`block transition-colors duration-300 ${
													styling.textColor || "text-gray-400"
												} hover:text-purple-400`}
											>
												📧 {settings.social.contact.email}
											</a>
										)}
										{settings.social.contact.location && (
											<div className={styling.textColor || "text-gray-400"}>
												📍 {settings.social.contact.location}
											</div>
										)}
									</div>
								)}

								{/* Enhanced Social Links */}
								<div className="space-y-3">
									<div className="text-sm font-medium text-white">
										Follow Me
									</div>
									<div className="flex flex-wrap gap-3">
										{socialLinks.map((social, index) => {
											const IconComponent = getIconComponent(social.icon);
											return IconComponent ? (
												<a
													key={index}
													href={social.url}
													target="_blank"
													rel="noopener noreferrer"
													className={`group relative p-2 rounded-lg transition-all duration-300 ${
														social.color || "text-gray-400"
													} hover:scale-110 hover:rotate-3 bg-white/5 hover:bg-white/10 border border-transparent hover:border-purple-500/30`}
													aria-label={social.label}
												>
													<IconComponent className="w-5 h-5 transition-colors duration-300 group-hover:text-white" />

													{/* Tooltip */}
													<div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-purple-500/30">
														{social.label}
													</div>
												</a>
											) : null;
										})}
									</div>
								</div>
							</div>
						)}
					</div>
				)}

				{/* Bottom Section */}
				<div
					className={`border-t border-gray-800/50 ${
						sectionsShown > 0 ? "pt-8" : "pt-0"
					}`}
				>
					<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
						{/* Made with section */}
						{footerConfig.madeWith?.show !== false && (
							<div
								className={`flex items-center space-x-2 ${
									styling.textColor || "text-gray-400"
								}`}
							>
								<span className="text-sm">
									{footerConfig.madeWith?.text || "Made with"}
								</span>
								{footerConfig.madeWith?.icon &&
									(() => {
										const IconComponent = getIconComponent(
											footerConfig.madeWith.icon
										);
										return IconComponent ? (
											<div>
												<IconComponent
													className={`w-4 h-4 ${
														footerConfig.madeWith?.iconColor || "text-red-500"
													}`}
												/>
											</div>
										) : null;
									})()}
								<span className="text-sm">
									by{" "}
									<span className="font-medium bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
										{footerConfig.madeWith?.by ||
											settings.display?.officialName ||
											"Krishna GSVV"}
									</span>
								</span>
							</div>
						)}

						{/* Copyright */}
						<div
							className={`text-sm text-center md:text-left ${
								styling.copyrightColor || "text-gray-500"
							}`}
						>
							{footerConfig.copyright?.customText || (
								<>
									&copy;{" "}
									{footerConfig.copyright?.showYear !== false
										? new Date().getFullYear()
										: ""}{" "}
									{footerConfig.copyright?.name ||
										settings.display?.officialName ||
										"Krishna GSVV"}
									. {footerConfig.copyright?.text || "All rights reserved"}.
								</>
							)}
						</div>

						{/* Scroll to top button */}
						<button
							onClick={scrollToTop}
							className="p-2 rounded-full bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 transition-all duration-300 group"
							aria-label="Scroll to top"
						>
							<FaArrowUp className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
						</button>
					</div>
				</div>

				{/* Bottom gradient line */}
				<div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
			</div>
		</footer>
	);
};

export default Footer;
