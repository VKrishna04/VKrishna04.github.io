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

/**
 * React Icons Integration Utility
 * Dynamically loads and renders React Icons for favicons
 */

// Icon library mappings to react-icons packages
const ICON_LIBRARIES = {
	// Ant Design Icons
	ai: () => import("react-icons/ai"),
	// Bootstrap Icons
	bs: () => import("react-icons/bs"),
	// Boxicons
	bi: () => import("react-icons/bi"),
	// Devicons
	di: () => import("react-icons/di"),
	// Feather
	fi: () => import("react-icons/fi"),
	// Font Awesome
	fa: () => import("react-icons/fa"),
	fa6: () => import("react-icons/fa6"),
	// Game Icons
	gi: () => import("react-icons/gi"),
	// GitHub Octicons
	go: () => import("react-icons/go"),
	// Heroicons
	hi: () => import("react-icons/hi"),
	hi2: () => import("react-icons/hi2"),
	// Ionicons
	io: () => import("react-icons/io"),
	io5: () => import("react-icons/io5"),
	// Lucide
	lu: () => import("react-icons/lu"),
	// Material Design
	md: () => import("react-icons/md"),
	// Phosphor Icons
	pi: () => import("react-icons/pi"),
	// React Icons
	ri: () => import("react-icons/ri"),
	// Simple Icons
	si: () => import("react-icons/si"),
	// Tabler Icons
	tb: () => import("react-icons/tb"),
	// Themify Icons
	tfi: () => import("react-icons/tfi"),
	// Typicons
	ti: () => import("react-icons/ti"),
	// VS Code Icons
	vsc: () => import("react-icons/vsc"),
	// Weather Icons
	wi: () => import("react-icons/wi"),
};

/**
 * Parse icon name to extract library and icon
 * Examples: "FaReact", "MdHome", "AiFillHeart"
 */
export const parseIconName = (iconName) => {
	if (!iconName || typeof iconName !== "string") {
		return null;
	}

	// Extract prefix (first 2-3 letters) and convert to lowercase
	const prefixMatch = iconName.match(/^([A-Z][a-z]+)/);
	if (!prefixMatch) {
		return null;
	}

	const prefix = prefixMatch[1].toLowerCase();

	// Map common prefixes to library names
	const libraryMap = {
		ai: "ai", // AiOutlineHome
		bs: "bs", // BsHouse
		bi: "bi", // BiHome
		di: "di", // DiReact
		fi: "fi", // FiHome
		fa: "fa", // FaHome
		gi: "gi", // GiHouse
		go: "go", // GoHome
		hi: "hi", // HiHome
		io: "io", // IoHome
		lu: "lu", // LuHome
		md: "md", // MdHome
		mdi: "mdi", // MdiHome
		pi: "pi", // PiHouse
		ri: "ri", // RiHome
		si: "si", // SiReact
		tb: "tb", // TbHome
		ti: "ti", // TiHome
		ty: "ty", // TyHome
		vsc: "vsc", // VscHome
		wi: "wi", // WiDaySunny
	};

	const library = libraryMap[prefix];
	return library ? { library, iconName } : null;
};

/**
 * Dynamically load and get React Icon component
 */
export const getReactIcon = async (iconName) => {
	const parsed = parseIconName(iconName);
	if (!parsed) {
		console.warn(`Invalid icon name format: ${iconName}`);
		return null;
	}

	const { library, iconName: fullIconName } = parsed;

	try {
		if (!ICON_LIBRARIES[library]) {
			console.warn(`Unsupported icon library: ${library}`);
			return null;
		}

		const iconModule = await ICON_LIBRARIES[library]();
		const IconComponent = iconModule[fullIconName];

		if (!IconComponent) {
			console.warn(`Icon "${fullIconName}" not found in library "${library}"`);
			return null;
		}

		return IconComponent;
	} catch (error) {
		console.error(`Error loading icon ${iconName}:`, error);
		return null;
	}
};

/**
 * Convert React Icon to SVG data URL for favicon
 */
export const reactIconToDataUrl = async (iconName, options = {}) => {
	const {
		size = 32,
		color = "#000000",
		backgroundColor = "transparent",
		padding = 4,
	} = options;

	try {
		const IconComponent = await getReactIcon(iconName);
		if (!IconComponent) {
			return null;
		}

		// Create a temporary div to render the icon
		const div = document.createElement("div");
		div.style.position = "absolute";
		div.style.top = "-9999px";
		div.style.left = "-9999px";
		div.style.width = `${size}px`;
		div.style.height = `${size}px`;
		document.body.appendChild(div);

		// Import React and ReactDOM for rendering
		const React = (await import("react")).default;
		const { createRoot } = await import("react-dom/client");

		// Create root and render icon
		const root = createRoot(div);
		await new Promise((resolve) => {
			root.render(
				React.createElement(IconComponent, {
					size: size - padding * 2,
					color: color,
					style: {
						margin: `${padding}px`,
						backgroundColor:
							backgroundColor === "transparent"
								? "transparent"
								: backgroundColor,
						borderRadius: backgroundColor !== "transparent" ? "4px" : "0",
					},
				})
			);
			setTimeout(resolve, 100); // Give time for rendering
		});

		// Get the SVG element
		const svgElement = div.querySelector("svg");
		if (!svgElement) {
			console.warn("No SVG element found for icon:", iconName);
			return null;
		}

		// Clone and enhance the SVG
		const svg = svgElement.cloneNode(true);
		svg.setAttribute("width", size);
		svg.setAttribute("height", size);
		svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

		// Add background if specified
		if (backgroundColor && backgroundColor !== "transparent") {
			const rect = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"rect"
			);
			rect.setAttribute("width", "100%");
			rect.setAttribute("height", "100%");
			rect.setAttribute("fill", backgroundColor);
			rect.setAttribute("rx", "4");
			svg.insertBefore(rect, svg.firstChild);
		}

		// Convert to data URL
		const svgData = new XMLSerializer().serializeToString(svg);
		const dataUrl = `data:image/svg+xml;base64,${btoa(svgData)}`;

		// Cleanup
		root.unmount();
		document.body.removeChild(div);

		return dataUrl;
	} catch (error) {
		console.error(`Error converting icon ${iconName} to data URL:`, error);
		return null;
	}
};

/**
 * Get popular React Icons for suggestions
 */
export const getPopularIcons = () => {
	return {
		general: [
			"FaHome",
			"FaUser",
			"FaCog",
			"FaHeart",
			"FaStar",
			"MdHome",
			"MdPerson",
			"MdSettings",
			"MdFavorite",
			"AiOutlineHome",
			"AiOutlineUser",
			"AiOutlineSetting",
			"BiHome",
			"BiUser",
			"BiCog",
			"HiHome",
			"HiUser",
			"HiCog",
			"IoHome",
			"IoPersonSharp",
			"IoSettings",
		],
		tech: [
			"FaReact",
			"FaVuejs",
			"FaAngular",
			"FaNodeJs",
			"SiReact",
			"SiVuedotjs",
			"SiAngular",
			"SiNodedotjs",
			"SiJavascript",
			"SiTypescript",
			"SiPython",
			"SiJava",
			"DiReact",
			"DiVue",
			"DiAngularSimple",
			"DiNodejs",
			"VscCode",
			"VscGithub",
			"VscGitlab",
		],
		social: [
			"FaGithub",
			"FaLinkedin",
			"FaTwitter",
			"FaInstagram",
			"SiGithub",
			"SiLinkedin",
			"SiTwitter",
			"SiInstagram",
			"AiFillGithub",
			"AiFillLinkedin",
			"AiFillTwitterSquare",
			"BsGithub",
			"BsLinkedin",
			"BsTwitter",
		],
	};
};

/**
 * Search for icons by name or category
 */
export const searchIcons = (query, category = "all") => {
	const popularIcons = getPopularIcons();
	let icons = [];

	if (category === "all") {
		icons = [
			...popularIcons.general,
			...popularIcons.tech,
			...popularIcons.social,
		];
	} else if (popularIcons[category]) {
		icons = popularIcons[category];
	}

	if (!query) {
		return icons;
	}

	return icons.filter((icon) =>
		icon.toLowerCase().includes(query.toLowerCase())
	);
};
