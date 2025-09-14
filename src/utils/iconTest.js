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

// Test utility to validate React Icons loading
export const testReactIcon = async (iconName) => {
	try {
		// Map icon prefixes to their respective packages
		const iconMappings = {
			Fa: () => import("react-icons/fa"),
			Fc: () => import("react-icons/fc"),
			Ai: () => import("react-icons/ai"),
			Bs: () => import("react-icons/bs"),
			Bi: () => import("react-icons/bi"),
			Di: () => import("react-icons/di"),
			Fi: () => import("react-icons/fi"),
			Go: () => import("react-icons/go"),
			Gr: () => import("react-icons/gr"),
			Hi: () => import("react-icons/hi"),
			Hi2: () => import("react-icons/hi2"),
			Im: () => import("react-icons/im"),
			Io: () => import("react-icons/io"),
			Io5: () => import("react-icons/io5"),
			Lu: () => import("react-icons/lu"),
			Md: () => import("react-icons/md"),
			Pi: () => import("react-icons/pi"),
			Ri: () => import("react-icons/ri"),
			Si: () => import("react-icons/si"),
			Sl: () => import("react-icons/sl"),
			Tb: () => import("react-icons/tb"),
			Ti: () => import("react-icons/ti"),
			Vsc: () => import("react-icons/vsc"),
			Wi: () => import("react-icons/wi"),
		};

		// Detect icon prefix and load appropriate package
		const prefix = Object.keys(iconMappings).find((p) =>
			iconName.startsWith(p)
		);
		if (!prefix) {
			console.warn(`Unknown icon prefix for ${iconName}`);
			return { success: false, error: `Unknown prefix for ${iconName}` };
		}

		const iconModule = await iconMappings[prefix]();
		const IconComponent = iconModule[iconName];

		if (!IconComponent) {
			return {
				success: false,
				error: `Icon ${iconName} not found in ${prefix} package`,
			};
		}

		return { success: true, component: IconComponent, prefix };
	} catch (error) {
		return { success: false, error: error.message };
	}
};

// Test common icons
export const testCommonIcons = async () => {
	const testIcons = [
		"FaReact",
		"FaGithub",
		"FaHeart",
		"SiJavascript",
		"SiTypescript",
		"SiNodedotjs",
		"MdHome",
		"MdSettings",
		"MdFavorite",
		"AiFillStar",
		"AiOutlineCode",
		"BiCodeAlt",
		"BiUser",
	];

	const results = [];

	for (const iconName of testIcons) {
		const result = await testReactIcon(iconName);
		results.push({ iconName, ...result });
	}

	return results;
};
