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
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
	EnvelopeIcon,
	PhoneIcon,
	MapPinIcon,
	ClockIcon,
	CheckCircleIcon,
	DocumentDuplicateIcon,
	CalendarDaysIcon,
	GlobeAltIcon,
	DocumentIcon,
	ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import {
	FaGithub,
	FaLinkedin,
	FaTwitter,
	FaInstagram,
	FaDiscord,
	FaMedium,
	FaDev,
	FaStackOverflow,
	FaDribbble,
	FaBehance,
	FaCodepen,
	FaPinterest,
	FaReddit,
	FaSpotify,
	FaAws,
} from "react-icons/fa";
import {
	SiLeetcode,
	SiHackerrank,
	SiKaggle,
	SiYoutubemusic,
	SiVercel,
	SiHeroku,
} from "react-icons/si";

const Contact = () => {
	const [settings, setSettings] = useState({});
	const [currentTime, setCurrentTime] = useState(new Date());
	const [copiedText, setCopiedText] = useState("");

	// Icon mapping for dynamic icon rendering
	const iconMap = {
		FaGithub,
		FaLinkedin,
		FaTwitter,
		FaInstagram,
		FaDiscord,
		FaMedium,
		FaDev,
		FaStackOverflow,
		FaDribbble,
		FaBehance,
		FaCodepen,
		FaPinterest,
		FaReddit,
		FaSpotify,
		FaAws,
		SiLeetcode,
		SiHackerrank,
		SiKaggle,
		SiYoutubemusic,
		SiVercel,
		SiHeroku,
	};

	// Safe color mapping to prevent XSS
	const colorMap = {
		blue: "text-blue-400 hover:bg-blue-900/20",
		green: "text-green-400 hover:bg-green-900/20",
		purple: "text-purple-400 hover:bg-purple-900/20",
		red: "text-red-400 hover:bg-red-900/20",
		yellow: "text-yellow-400 hover:bg-yellow-900/20",
		indigo: "text-indigo-400 hover:bg-indigo-900/20",
		pink: "text-pink-400 hover:bg-pink-900/20",
		gray: "text-gray-400 hover:bg-gray-900/20",
	};

	// Hero icon mapping for dynamic icon rendering
	const heroIconMap = {
		EnvelopeIcon,
		PhoneIcon,
		MapPinIcon,
		ClockIcon,
		CheckCircleIcon,
		DocumentDuplicateIcon,
		CalendarDaysIcon,
		GlobeAltIcon,
		DocumentIcon,
		ArrowDownTrayIcon,
	};

	// Helper function to get icon component
	const getIconComponent = (iconName) => {
		return iconMap[iconName] || FaGithub;
	};

	// Helper function to get Heroicon component
	const getHeroIcon = (iconName) => {
		return heroIconMap[iconName] || EnvelopeIcon;
	};

	// Helper function to render section by type
	const renderSection = (sectionConfig, sectionType, columnType = "right") => {
		// Grid classes based on column type
		const getIconGridClasses = (columnType) => {
			if (columnType === "left") {
				return "grid grid-cols-2 gap-4"; // Only 2 icons per row in left column
			}
			return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"; // Default for right column
		};

		const getTextGridClasses = (columnType) => {
			if (columnType === "left") {
				return "grid grid-cols-1 gap-4"; // Only 1 platform with description per row in left column
			}
			return "grid grid-cols-1 lg:grid-cols-2 gap-4"; // Default for right column
		};
		if (!sectionConfig.show) return null;

		switch (sectionType) {
			case "contactInfo":
				return (
					<div className="space-y-4">
						{contactInfo.map((info, index) => (
							<div
								key={index}
								className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4 hover:border-purple-500/50 transition-all duration-300"
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<info.icon className="h-5 w-5 text-purple-400 mr-3" />
										<div>
											<p className="text-sm text-gray-400">{info.label}</p>
											{info.href ? (
												<a
													href={sanitizeUrl(info.href)}
													className="text-white hover:text-purple-400 transition-colors"
												>
													{info.value}
												</a>
											) : (
												<p className="text-white">{info.value}</p>
											)}
										</div>
									</div>
									{(info.type === "email" || info.type === "phone") && (
										<button
											onClick={() => copyToClipboard(info.value, info.label)}
											className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
											title={`Copy ${info.label}`}
										>
											{copiedText === info.label ? (
												<CheckCircleIcon className="h-4 w-4 text-green-400" />
											) : (
												<DocumentDuplicateIcon className="h-4 w-4" />
											)}
										</button>
									)}
								</div>
							</div>
						))}

						{/* Response Time */}
						{contactConfig.responseInfo?.show && (
							<div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
								<div className="flex items-center mb-2">
									<ClockIcon className="h-5 w-5 text-blue-400 mr-2" />
									<h3 className="font-semibold text-blue-200">Response Time</h3>
								</div>
								<p className="text-blue-300 text-sm">
									{contactConfig.responseInfo.timeframe ||
										"Usually within 5 business days"}
								</p>
								<div className="flex items-center mt-2">
									<GlobeAltIcon className="h-4 w-4 text-blue-400 mr-2" />
									<span className="text-blue-300 text-sm">
										{formatCurrentTime()} local time
									</span>
								</div>
							</div>
						)}
					</div>
				);

			case "currentFocus":
				return contactConfig.currentFocus?.show ? (
					<div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
						<h3 className="font-semibold text-white mb-3">
							{contactConfig.currentFocus.title || "What I'm Working On"}
						</h3>
						<p className="text-gray-300">
							{contactConfig.currentFocus.description ||
								"Building innovative web applications"}
						</p>
					</div>
				) : null;

			case "Open to Collaborate On":
				return;

			case "quickActions":
				return contactConfig.quickActions?.show ? (
					<div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
						<h3 className="font-semibold text-white mb-3">
							{contactConfig.quickActions.title || "Quick Actions"}
						</h3>
						<div className="space-y-2">
							{contactConfig.quickActions.actions
								?.filter((action) => action.enabled)
								.map((action, index) => {
									const IconComponent = getHeroIcon(action.icon);
									let url = action.url;

									// Replace placeholders
									if (
										url.includes("{email}") &&
										settings.social?.contact?.email
									) {
										url = url.replace("{email}", settings.social.contact.email);
									}
									if (url.includes("{calendly}") && contactConfig.calendly) {
										url = url.replace("{calendly}", contactConfig.calendly);
									}

									return (
										<a
											key={index}
											href={sanitizeUrl(url)}
											target={url.startsWith("http") ? "_blank" : undefined}
											rel={
												url.startsWith("http")
													? "noopener noreferrer"
													: undefined
											}
											className={`flex items-center p-2 ${
												colorMap[action.colorTheme] ||
												"text-gray-400 hover:bg-gray-900/20"
											} rounded transition-colors`}
										>
											<IconComponent className="h-4 w-4 mr-2" />
											{action.label}
										</a>
									);
								})}
						</div>
					</div>
				) : null;

			case "collaboration":
				return collaborationInterests.length > 0 ? (
					<div className="space-y-2">
						{collaborationInterests.map((interest, index) => (
							<div
								key={index}
								className="flex items-center p-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50"
							>
								<CheckCircleIcon className="h-4 w-4 text-green-400 mr-3" />
								<span className="text-gray-300">{interest}</span>
							</div>
						))}
					</div>
				) : null;

			case "github":
				// GitHub platforms are now handled in the social section
				return null;

			case "social":
			case "section1":
			case "section2":
			case "section3":
			case "section4":
			case "section5":
			case "section6":
			case "section7":
			case "section8":
			case "section9":
			case "section10": {
				// Determine which section to render
				let targetSectionNumber;
				if (sectionType === "social") {
					// For backward compatibility, show all sections
					targetSectionNumber = null;
				} else if (sectionType.startsWith("section")) {
					// Extract section number from sectionType (e.g., "section1" -> 1)
					targetSectionNumber = parseInt(sectionType.replace("section", ""));
				}

				const allPlatforms =
					settings.social?.platforms?.filter(
						(platform) => platform.enabled && platform.showInContact
					) || [];

				const emailPlatform = settings.social?.contact?.email
					? {
							name: "Gmail",
							key: "gmail",
							icon: "EnvelopeIcon",
							url: `mailto:${settings.social.contact.email}`,
							label: "Email",
							description: "Send me a direct email",
							contactSection: 2,
					  }
					: null;

				const platformsToShow = [
					...allPlatforms,
					...(emailPlatform ? [emailPlatform] : []),
				];

				// Filter platforms by section if targetSectionNumber is specified
				const filteredPlatforms = targetSectionNumber
					? platformsToShow.filter(
							(platform) => platform.contactSection === targetSectionNumber
					  )
					: platformsToShow;

				// Group platforms by contactSection
				const groupedPlatforms = {};
				filteredPlatforms.forEach((platform) => {
					const section = platform.contactSection || 1;
					if (!groupedPlatforms[section]) {
						groupedPlatforms[section] = [];
					}
					groupedPlatforms[section].push(platform);
				});

				// Get section headings from settings
				const sectionHeadings =
					settings.contact?.sections?.sectionHeadings || {};

				// Get platform sorting configuration
				const platformSorting = settings.contact?.sections?.platformSorting || {
					iconOnlyFirst: true,
					enabled: true,
				};

				// Sort sections by number
				const sortedSections = Object.keys(groupedPlatforms).sort(
					(a, b) => parseInt(a) - parseInt(b)
				);

				return (
					<div className="space-y-8">
						{sortedSections.map((sectionNumber) => {
							const platforms = groupedPlatforms[sectionNumber];
							const sectionHeading = sectionHeadings[sectionNumber];

							if (!platforms || platforms.length === 0) return null;

							// Separate platforms with and without descriptions within each section
							const platformsWithText = platforms.filter(
								(platform) =>
									platform.description && platform.description.trim() !== ""
							);
							const iconOnlyPlatforms = platforms.filter(
								(platform) =>
									!platform.description || platform.description.trim() === ""
							);

							// Determine the order based on sorting configuration
							const shouldShowIconOnlyFirst =
								platformSorting.enabled && platformSorting.iconOnlyFirst;

							return (
								<div key={sectionNumber} className="space-y-4">
									{/* Section Heading */}
									{sectionHeading && (
										<h4 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
											{sectionHeading}
										</h4>
									)}

									{/* Conditional rendering based on sorting preference */}
									{shouldShowIconOnlyFirst ? (
										<>
											{/* Icon-only platforms first */}
											{iconOnlyPlatforms.length > 0 && (
												<div className={getIconGridClasses(columnType)}>
													{iconOnlyPlatforms.map((platform, index) => {
														const IconComponent = getIconComponent(
															platform.icon
														);

														return (
															<a
																key={`${sectionNumber}-icon-${index}`}
																href={sanitizeUrl(platform.url)}
																target="_blank"
																rel="noopener noreferrer"
																className="flex flex-col items-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 group"
															>
																<div className="w-12 h-12 flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
																	<IconComponent
																		className="text-2xl"
																		style={{
																			color: platform.brandColor || "#ffffff",
																		}}
																	/>
																</div>
																<span className="text-sm text-gray-300 text-center font-medium">
																	{platform.label || platform.name}
																</span>
															</a>
														);
													})}
												</div>
											)}

											{/* Platforms with descriptions after */}
											{platformsWithText.length > 0 && (
												<div className={getTextGridClasses(columnType)}>
													{platformsWithText.map((platform, index) => {
														const IconComponent =
															platform.icon === "EnvelopeIcon"
																? EnvelopeIcon
																: getIconComponent(platform.icon);

														return (
															<a
																key={`${sectionNumber}-text-${index}`}
																href={sanitizeUrl(platform.url)}
																target="_blank"
																rel="noopener noreferrer"
																className="flex items-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] group"
															>
																<div className="w-12 h-12 flex items-center justify-center mr-4 transition-transform group-hover:scale-110">
																	<IconComponent
																		className="text-2xl"
																		style={{
																			color: platform.brandColor || "#ffffff",
																		}}
																	/>
																</div>
																<div className="flex-1 min-w-0">
																	<h5 className="font-medium text-white group-hover:text-purple-300 transition-colors">
																		{platform.label || platform.name}
																	</h5>
																	<p className="text-sm text-gray-400 truncate">
																		{platform.description}
																	</p>
																</div>
															</a>
														);
													})}
												</div>
											)}
										</>
									) : (
										<>
											{/* Platforms with descriptions first */}
											{platformsWithText.length > 0 && (
												<div className={getTextGridClasses(columnType)}>
													{platformsWithText.map((platform, index) => {
														const IconComponent =
															platform.icon === "EnvelopeIcon"
																? EnvelopeIcon
																: getIconComponent(platform.icon);

														return (
															<a
																key={`${sectionNumber}-text-${index}`}
																href={sanitizeUrl(platform.url)}
																target="_blank"
																rel="noopener noreferrer"
																className="flex items-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] group"
															>
																<div className="w-12 h-12 flex items-center justify-center mr-4 transition-transform group-hover:scale-110">
																	<IconComponent
																		className="text-2xl"
																		style={{
																			color: platform.brandColor || "#ffffff",
																		}}
																	/>
																</div>
																<div className="flex-1 min-w-0">
																	<h5 className="font-medium text-white group-hover:text-purple-300 transition-colors">
																		{platform.label || platform.name}
																	</h5>
																	<p className="text-sm text-gray-400 truncate">
																		{platform.description}
																	</p>
																</div>
															</a>
														);
													})}
												</div>
											)}

											{/* Icon-only platforms after */}
											{iconOnlyPlatforms.length > 0 && (
												<div className={getIconGridClasses(columnType)}>
													{iconOnlyPlatforms.map((platform, index) => {
														const IconComponent = getIconComponent(
															platform.icon
														);

														return (
															<a
																key={`${sectionNumber}-icon-${index}`}
																href={sanitizeUrl(platform.url)}
																target="_blank"
																rel="noopener noreferrer"
																className="flex flex-col items-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 group"
															>
																<div className="w-12 h-12 flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
																	<IconComponent
																		className="text-2xl"
																		style={{
																			color: platform.brandColor || "#ffffff",
																		}}
																	/>
																</div>
																<span className="text-sm text-gray-300 text-center font-medium">
																	{platform.label || platform.name}
																</span>
															</a>
														);
													})}
												</div>
											)}
										</>
									)}
								</div>
							);
						})}
					</div>
				);
			}

			default:
				return null;
		}
	};

	useEffect(() => {
		// Fetch settings for contact information
		fetch("/settings.json")
			.then((response) => response.json())
			.then((data) => setSettings(data))
			.catch((error) => console.warn("Could not fetch settings:", error));

		// Update time every minute
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 60000);

		return () => clearInterval(timer);
	}, []);

	// Copy to clipboard functionality
	const copyToClipboard = async (text, label) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedText(label);
			setTimeout(() => setCopiedText(""), 2000);
		} catch (err) {
			console.error("Failed to copy: ", err);
		}
	};

	// URL sanitization helper
	const sanitizeUrl = (url) => {
		if (!url || typeof url !== "string") return "#";

		// Only allow http, https, mailto, and tel protocols
		const allowedProtocols = ["http:", "https:", "mailto:", "tel:"];

		try {
			const urlObj = new URL(url);
			if (allowedProtocols.includes(urlObj.protocol)) {
				return url;
			}
		} catch {
			// If URL parsing fails, treat as relative/invalid
			return "#";
		}

		return "#";
	};

	// Get contact configuration
	const contactConfig = settings.contact || {};

	// Get collaboration interests
	const getCollaborationInterests = () => {
		return contactConfig.collaborationInterests || [];
	};

	// Get FAQ items
	const getFAQItems = () => {
		return contactConfig.faq || [];
	};

	// Format current time for user's timezone
	const formatCurrentTime = () => {
		const timeZone = contactConfig.timeZone || "Asia/Kolkata";
		const timeFormat = contactConfig.timeFormat || "12-hour";

		const options = {
			timeZone,
			hour: "2-digit",
			minute: "2-digit",
			hour12: timeFormat === "12-hour",
		};

		return currentTime.toLocaleTimeString("en-US", options);
	};

	// Get contact information with proper mapping
	const getContactInfo = () => {
		if (!settings.social?.contact) return [];

		return [
			{
				type: "email",
				label: "Email",
				value: settings.social.contact.email,
				icon: EnvelopeIcon,
				href: `mailto:${settings.social.contact.email}`,
			},
			{
				type: "phone",
				label: "Phone",
				value: settings.social.contact.phone,
				icon: PhoneIcon,
				href: `tel:${settings.social.contact.phone}`,
			},
			{
				type: "location",
				label: "Location",
				value: settings.social.contact.location,
				icon: MapPinIcon,
				href: null,
			},
		].filter((item) => item.value && item.value.trim() !== "");
	};

	const collaborationInterests = getCollaborationInterests();
	const faqItems = getFAQItems();
	const contactInfo = getContactInfo();

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="max-w-7xl mx-auto"
			>
				{/* Header */}
				<div className="text-center mb-16">
					<h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
						{contactConfig.title || "Let's Connect"}
					</h1>
					<p className="text-xl text-gray-300 max-w-3xl mx-auto">
						{contactConfig.subtitle ||
							"I'm always interested in new opportunities and collaborations. Let's build something amazing together!"}
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Current Status */}
					{contactConfig.status?.show && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
							className="lg:col-span-3"
						>
							<div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700/50 border-l-4 border-l-green-500">
								<div className="flex items-center">
									<CheckCircleIcon className="h-6 w-6 text-green-400 mr-3" />
									<div>
										<h3 className="font-semibold text-green-200">
											{contactConfig.status.title || "Current Status"}
										</h3>
										<p className="text-gray-300">
											{contactConfig.status.message ||
												"Available for new opportunities"}
										</p>
									</div>
								</div>
							</div>
						</motion.div>
					)}

					{/* Left Column - Configurable Sections */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 }}
						className="space-y-6"
					>
						<h2 className="text-2xl font-bold text-white">
							{contactConfig.sections?.leftColumn?.title || "Get In Touch"}
						</h2>

						{contactConfig.sections?.leftColumn?.sections?.map(
							(section, index) =>
								section.show && (
									<div key={index} className="space-y-4">
										{section.title && section.type !== "contactInfo" && (
											<h3 className="text-lg font-semibold text-purple-300">
												{section.title}
											</h3>
										)}
										{renderSection(section, section.type, "left")}
									</div>
								)
						)}
					</motion.div>

					{/* Right Column - Configurable Sections */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="lg:col-span-2 space-y-6"
					>
						<h2 className="text-2xl font-bold text-white">
							{contactConfig.sections?.rightColumn?.title ||
								"Let's Connect and Chat!"}
						</h2>

						{contactConfig.sections?.rightColumn?.sections?.map(
							(section, index) =>
								section.show && (
									<div key={index} className="space-y-4">
										<h3 className="text-lg font-semibold text-purple-300">
											{section.title}
										</h3>
										{renderSection(section, section.type, "right")}
									</div>
								)
						)}
					</motion.div>
				</div>

				{/* FAQ Section */}
				{faqItems.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
						className="mt-16"
					>
						<h2 className="text-3xl font-bold text-white text-center mb-12">
							Frequently Asked Questions
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{faqItems.map((faq, index) => (
								<div
									key={index}
									className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-6"
								>
									<h3 className="font-semibold text-white mb-2">
										{faq.question}
									</h3>
									<p className="text-gray-300">{faq.answer}</p>
								</div>
							))}
						</div>
					</motion.div>
				)}
			</motion.div>
		</div>
	);
};

export default Contact;

