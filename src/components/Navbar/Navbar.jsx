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
import { Link, useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
// === LEGACY/BACKUP: Direct icon imports (deprecated) ===
// import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"; // REPLACED
// import { FaGithub, ... } from "react-icons/fa"; // REPLACED
// ========================================================

// === MODULAR SYSTEMS: Use unified icon system ===
import { UnifiedIcon } from "../UnifiedIcon";
// ================================================

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [settings, setSettings] = useState({});
	const location = useLocation();

	useEffect(() => {
		// Fetch settings for navbar configuration
		fetch("/settings.json")
			.then((response) => response.json())
			.then((data) => setSettings(data))
			.catch((error) => console.warn("Could not fetch settings:", error));
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			const isScrolled = window.scrollY > 10;
			setScrolled(isScrolled);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const getNavItems = () => {
		return (
			settings.navbar?.navigation || [
				{ name: "Home", path: "/" },
				{ name: "About", path: "/about" },
				{ name: "Projects", path: "/projects" },
				{ name: "Resume", path: "/resume" },
				{ name: "Contact", path: "/contact" },
			]
		);
	};

	const getLogoContent = () => {
		const logoConfig = settings.navbar?.logo;
		if (!logoConfig) return { text: "VK", name: "Krishna GSVV" };

		switch (logoConfig.type) {
			case "text":
				return {
					text: logoConfig.text || "VK",
					name:
						logoConfig.name || settings.display?.officialName || "Krishna GSVV",
				};
			case "image":
				return {
					imageUrl: logoConfig.customImageUrl,
					name:
						logoConfig.name || settings.display?.officialName || "Krishna GSVV",
				};
			case "github":
				return {
					imageUrl: settings.display?.profileImage,
					name:
						logoConfig.name || settings.display?.officialName || "Krishna GSVV",
				};
			case "auto":
				return {
					imageUrl: settings.display?.profileImage,
					name:
						logoConfig.name || settings.display?.officialName || "Krishna GSVV",
				};
			default:
				return {
					text: logoConfig.text || "VK",
					name:
						logoConfig.name || settings.display?.officialName || "Krishna GSVV",
				};
		}
	};

	const navItems = getNavItems();
	const logoContent = getLogoContent();
	const styling = settings.navbar?.styling || {};
	const animations = settings.navbar?.animations || {};

	return (
		<motion.nav
			initial={{ y: animations.initialY || -100 }}
			animate={{ y: 0 }}
			className={`fixed top-0 w-full z-50 transition-all duration-300 ${
				scrolled
					? styling.scrolledBg ||
					  "bg-black/80 backdrop-blur-md border-b border-white/10"
					: styling.transparentBg || "bg-transparent"
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<Link to="/" className="flex items-center space-x-2">
						{logoContent.imageUrl ? (
							<div className="w-10 h-10 rounded-lg overflow-hidden">
								<img
									src={logoContent.imageUrl}
									alt={logoContent.name}
									className="w-full h-full object-cover"
								/>
							</div>
						) : (
							<div
								className={`w-10 h-10 bg-gradient-to-r ${
									settings.navbar?.logo?.gradient ||
									"from-primary-500 to-accent-500"
								} rounded-lg flex items-center justify-center`}
							>
								<span className="text-white font-bold text-lg">
									{logoContent.text}
								</span>
							</div>
						)}
						{settings.navbar?.logo?.showName !== false &&
							(settings.navbar?.logo?.showNameOnMobile !== false ||
								window.innerWidth >= 640) && (
								<span className="text-white font-semibold text-xl hidden sm:block">
									{logoContent.name}
								</span>
							)}
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						{navItems.map((item) => (
							<Link
								key={item.name}
								to={item.path}
								className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
									location.pathname === item.path
										? styling.activeColor || "text-primary-400"
										: styling.inactiveColor ||
										  "text-white hover:text-primary-400"
								}`}
							>
								{item.name}
								{location.pathname === item.path && (
									<motion.div
										layoutId="activeTab"
										className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${
											styling.activeTabGradient ||
											"from-primary-500 to-accent-500"
										}`}
										initial={false}
										transition={{
											type: "spring",
											stiffness: animations.springStiffness || 380,
											damping: animations.springDamping || 30,
										}}
									/>
								)}
							</Link>
						))}
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="text-white hover:text-primary-400 transition-colors"
						>
							{isOpen ? (
								<UnifiedIcon
									name="HiXMark"
									className="h-6 w-6"
									fallback="FaTimes"
								/>
							) : (
								<UnifiedIcon
									name="HiBars3"
									className="h-6 w-6"
									fallback="FaBars"
								/>
							)}
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className={`md:hidden ${
							styling.mobileMenuBg || "bg-black/90 backdrop-blur-md"
						} rounded-lg mt-2 mb-4`}
					>
						<div className="px-2 pt-2 pb-3 space-y-1">
							{navItems.map((item) => (
								<Link
									key={item.name}
									to={item.path}
									onClick={() => setIsOpen(false)}
									className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
										location.pathname === item.path
											? "text-primary-400 bg-white/10"
											: "text-white hover:text-primary-400 hover:bg-white/5"
									}`}
								>
									{item.name}
								</Link>
							))}
						</div>
					</motion.div>
				)}
			</div>
		</motion.nav>
	);
};

export default Navbar;

/*
Enhanced navbar logo to support dynamic types:
- github: Use GitHub profile image with fallback
- image: Use custom image URL
- auto: Match home page profile image settings
- text: Use text logo (default)

The logo section needs to be updated to handle these cases
with proper error handling and fallbacks
*/
