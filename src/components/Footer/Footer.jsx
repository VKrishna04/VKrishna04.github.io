import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
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
} from "react-icons/fa";

const Footer = () => {
	const [settings, setSettings] = useState({});

	useEffect(() => {
		// Fetch settings for footer configuration
		fetch("/settings.json")
			.then((response) => response.json())
			.then((data) => setSettings(data))
			.catch((error) => console.warn("Could not fetch settings:", error));
	}, []);

	// Icon mapping for social links and made with icon
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

	const footerConfig = settings.footer || {};
	const styling = footerConfig.styling || {};
	const socialLinks = getSocialLinks();

	return (
		<footer
			className={`${
				styling.backgroundColor || "bg-gray-900/50 backdrop-blur-sm"
			} border-t ${styling.borderColor || "border-gray-800/50"} mt-20`}
		>
			<div className="max-w-6xl mx-auto px-4 py-8">
				<div className="flex flex-col md:flex-row justify-between items-center">
					{/* Made with section */}
					{footerConfig.madeWith?.show !== false && (
						<div
							className={`flex items-center space-x-1 ${
								styling.textColor || "text-gray-400"
							} mb-4 md:mb-0`}
						>
							<span>{footerConfig.madeWith?.text || "Made with"}</span>
							{footerConfig.madeWith?.icon &&
								(() => {
									const IconComponent = getIconComponent(
										footerConfig.madeWith.icon
									);
									return IconComponent ? (
										<IconComponent
											className={`w-4 h-4 ${
												footerConfig.madeWith?.iconColor || "text-red-500"
											}`}
										/>
									) : null;
								})()}
							<span>
								by{" "}
								{footerConfig.madeWith?.by ||
									settings.display?.officialName ||
									"Krishna GSVV"}
							</span>
						</div>
					)}

					{/* Social Links */}
					{footerConfig.socialLinks?.show !== false &&
						socialLinks.length > 0 && (
							<div className="flex space-x-4">
								{socialLinks.map((social, index) => {
									const IconComponent = getIconComponent(social.icon);
									return IconComponent ? (
										<motion.a
											key={index}
											href={social.url}
											target="_blank"
											rel="noopener noreferrer"
											className={`transition-colors duration-300 ${
												social.color || "text-gray-400"
											} ${social.hoverColor || "hover:text-purple-400"}`}
											whileHover={{ scale: 1.1, y: -2 }}
											whileTap={{ scale: 0.9 }}
											aria-label={social.label}
										>
											<IconComponent className="w-5 h-5" />
										</motion.a>
									) : null;
								})}
							</div>
						)}
					{/* </div>

				<div
					className={`mt-6 pt-6 border-t ${
						styling.borderColor || "border-gray-800/50"
					} text-center ${styling.copyrightColor || "text-gray-500"} text-sm`}
				> */}
					<p>
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
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
