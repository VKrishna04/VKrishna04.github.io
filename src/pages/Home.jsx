import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect";
import {
	ArrowDownIcon,
	DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import {
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

const Home = () => {
	const [settings, setSettings] = useState({});

	useEffect(() => {
		// Fetch settings for home page configuration
		fetch("/settings.json")
			.then((response) => response.json())
			.then((data) => setSettings(data))
			.catch((error) => console.warn("Could not fetch settings:", error));
	}, []);

	// Icon mapping for social links
	const iconMap = {
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

	// Icon mapping for buttons
	const buttonIconMap = {
		ArrowDownIcon,
		DocumentArrowDownIcon,
	};

	const getIconComponent = (iconName) => {
		return iconMap[iconName];
	};

	const getButtonIcon = (iconName) => {
		return buttonIconMap[iconName];
	};

	const getProfileImageUrl = () => {
		const imageConfig = settings.home?.profileImage;
		if (!imageConfig) return settings.display?.profileImage;

		switch (imageConfig.type) {
			case "github":
				return settings.display?.profileImage;
			case "display":
				return settings.display?.profileImage;
			case "custom":
				return imageConfig.customUrl;
			default:
				return settings.display?.profileImage;
		}
	};

	const getSocialLinks = () => {
		if (!settings.social?.platforms) return [];

		return settings.social.platforms.filter(
			(platform) =>
				platform.enabled &&
				platform.url &&
				platform.url.trim() !== "" &&
				platform.showInHome
		);
	};

	const fadeInUp = {
		initial: { opacity: 0, y: 60 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: settings.home?.animations?.fadeInDuration || 0.6 },
	};

	const staggerContainer = {
		animate: {
			transition: {
				staggerChildren: settings.home?.animations?.staggerDelay || 0.1,
			},
		},
	};

	const socialLinks = getSocialLinks();

	return (
		<motion.div
			className="relative min-h-screen flex items-center justify-center overflow-hidden"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5 }}
		>
			<motion.div
				className="relative z-50 text-center px-4 max-w-6xl mx-auto"
				variants={staggerContainer}
				initial="initial"
				animate="animate"
			>
				{/* Profile Image */}
				<motion.div
					className="mb-8 relative"
					variants={fadeInUp}
					style={{ zIndex: 1 }}
				>
					<div
						className={`w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden border-4 ${
							settings.home?.profileImage?.borderColor || "border-purple-500/30"
						} shadow-lg ${
							settings.home?.profileImage?.shadowColor || "shadow-purple-500/20"
						}`}
						style={{ zIndex: -1 }}
					>
						<img
							src={getProfileImageUrl()}
							alt={
								settings.home?.profileImage?.altText ||
								settings.display?.officialName ||
								"Profile"
							}
							className="w-full h-full object-cover"
						/>
					</div>
				</motion.div>

				{/* Greeting */}
				<motion.div className="mb-6" variants={fadeInUp}>
					<span className="text-xl md:text-2xl text-gray-300 font-light">
						{settings.home?.greeting || "Hi There! 👋🏻 I'm"}
					</span>
				</motion.div>

				{/* Name with Gradient */}
				<motion.h1
					className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 gradient-text"
					variants={fadeInUp}
					style={{
						backgroundImage:
							settings.home?.nameGradient ||
							"linear-gradient(to right, #c770f0, #ec4899, #ef4444)",
						backgroundSize: "100%",
						backgroundRepeat: "no-repeat",
					}}
				>
					{settings.home?.name || settings.display?.officialName || "Your Name"}
				</motion.h1>

				{/* Typewriter Effect */}
				<motion.div
					className="text-2xl md:text-3xl lg:text-4xl text-purple-400 font-semibold mb-8"
					variants={fadeInUp}
				>
					{settings.home?.typewriterStrings &&
						settings.home.typewriterStrings.length > 0 && (
							<Typewriter
								options={{
									strings: settings.home.typewriterStrings,
									autoStart:
										settings.home?.animations?.typewriterSettings?.autoStart ??
										true,
									loop:
										settings.home?.animations?.typewriterSettings?.loop ?? true,
									deleteSpeed:
										settings.home?.animations?.typewriterSettings
											?.deleteSpeed || 50,
									delay:
										settings.home?.animations?.typewriterSettings?.delay || 100,
								}}
							/>
						)}
				</motion.div>

				{/* Description */}
				<motion.p
					className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed"
					variants={fadeInUp}
				>
					{settings.home?.description || "Welcome to my portfolio!"}
				</motion.p>

				{/* Location */}
				{settings.home?.location?.show && (
					<motion.div
						className="flex items-center justify-center text-gray-400 mb-12"
						variants={fadeInUp}
					>
						<span className="text-lg">
							{settings.home.location.text ||
								`${settings.home.location.icon || "📍"} ${
									settings.home.location.city || ""
								}, ${settings.home.location.country || ""}`}
						</span>
					</motion.div>
				)}

				{/* Call to Action Buttons */}
				<motion.div
					className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 relative z-20"
					variants={fadeInUp}
				>
					{settings.home?.buttons?.map((button, index) => {
						const ButtonIcon = getButtonIcon(button.icon);

						if (button.type === "primary") {
							return (
								<Link key={index} to={button.link}>
									<motion.div
										className={`group relative inline-flex items-center px-8 py-3 bg-gradient-to-r ${button.gradient} text-white font-semibold rounded-full hover:${button.hoverGradient} transition-all duration-300 shadow-lg ${button.shadowColor} cursor-pointer`}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										{button.text}
										{ButtonIcon && (
											<ButtonIcon className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" />
										)}
									</motion.div>
								</Link>
							);
						} else if (button.type === "outline") {
							return (
								<Link key={index} to={button.link}>
									<motion.div
										className={`group relative inline-flex items-center px-8 py-3 border-2 ${button.borderColor} ${button.textColor} font-semibold rounded-full ${button.hoverBg} ${button.hoverText} transition-all duration-300 cursor-pointer`}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										{button.text}
										{ButtonIcon && (
											<ButtonIcon className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" />
										)}
									</motion.div>
								</Link>
							);
						}
						return null;
					})}
				</motion.div>

				{/* Social Links */}
				<motion.div
					className="flex justify-center space-x-6"
					variants={fadeInUp}
				>
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
								whileHover={{ scale: 1.2, y: -5 }}
								whileTap={{ scale: 0.9 }}
								aria-label={social.label}
							>
								<IconComponent className="w-6 h-6" />
							</motion.a>
						) : null;
					})}
				</motion.div>
			</motion.div>

			{/* Scroll Indicator */}
			{/* {settings.home?.showScrollIndicator !== false && (
				<motion.div
					className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1, duration: 0.6 }}
				>
					<motion.div
						animate={{ y: [0, 10, 0] }}
						transition={{ duration: 2, repeat: Infinity }}
						className="text-gray-400"
					>
						<ArrowDownIcon className="w-6 h-6" />
					</motion.div>
				</motion.div>
			)} */}
		</motion.div>
	);
};

export default Home;
