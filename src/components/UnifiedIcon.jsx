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
 * UNIFIED ICON COMPONENT
 *
 * React component wrapper for the universal icon system.
 * This file contains ONLY the React component for Fast Refresh compatibility.
 *
 * USAGE:
 * import { UnifiedIcon } from '@/components/UnifiedIcon';
 *
 * <UnifiedIcon name="FaReact" className="w-6 h-6" />
 * <UnifiedIcon name="MdHome" size={24} color="#FF0000" />
 * <UnifiedIcon name="HiUser" fallback={<DefaultIcon />} />
 */

import React, { useState, useEffect } from "react";
import { getCachedIcon, getIconWithFallback } from "../utils/iconSystemCore.js"

// ============================================================================
// REACT COMPONENT (ONLY COMPONENT EXPORTS FOR FAST REFRESH)
// ============================================================================

/**
 * UnifiedIcon Component
 *
 * A universal React component that can render ANY icon from react-icons
 * by automatically detecting and loading the appropriate library.
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Icon name (e.g., "FaReact", "MdHome", "HiUser")
 * @param {string} [props.className] - Tailwind/CSS classes
 * @param {number|string} [props.size] - Icon size (pixels or rem)
 * @param {string} [props.color] - Icon color
 * @param {Object} [props.style] - Inline styles
 * @param {React.Component} [props.fallback] - Fallback component while loading
 * @param {boolean} [props.showError] - Show error message if icon not found
 *
 * @example
 * // Basic usage
 * <UnifiedIcon name="FaReact" className="w-6 h-6" />
 *
 * @example
 * // With custom fallback
 * <UnifiedIcon
 *   name="SiJavascript"
 *   fallback={<span>Loading...</span>}
 * />
 *
 * @example
 * // With size and color
 * <UnifiedIcon
 *   name="MdSettings"
 *   size={24}
 *   color="#FF0000"
 * />
 */
export const UnifiedIcon = ({
	name,
	className = "",
	size,
	color,
	style,
	fallback = <span className="inline-block w-6 h-6" />,
	showError = false,
	...props
}) => {
	const [IconComponent, setIconComponent] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!name) {
			setError("No icon name provided");
			setIsLoading(false);
			return;
		}

		// Check cache first (synchronous)
		const cachedIcon = getCachedIcon(name);
		if (cachedIcon) {
			setIconComponent(() => cachedIcon);
			setIsLoading(false);
			return;
		}

		// Load icon asynchronously
		let isMounted = true;

		const loadIcon = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const icon = await getIconWithFallback(name);

				if (isMounted) {
					if (icon) {
						setIconComponent(() => icon);
					} else {
						setError(`Icon "${name}" not found`);
					}
					setIsLoading(false);
				}
			} catch (err) {
				if (isMounted) {
					setError(err.message);
					setIsLoading(false);
					console.error(`[UnifiedIcon] Error loading icon "${name}":`, err);
				}
			}
		};

		loadIcon();

		// Cleanup function
		return () => {
			isMounted = false;
		};
	}, [name]);

	// Show fallback while loading
	if (isLoading) {
		return fallback;
	}

	// Show error message if enabled
	if (error && showError) {
		return (
			<span className={`text-red-500 text-xs ${className}`} title={error}>
				⚠️
			</span>
		);
	}

	// Show fallback if icon not found
	if (!IconComponent) {
		console.warn(`Icon "${name}" not found`);
		return fallback;
	}

	// Render the icon
	return (
		<IconComponent
			className={className}
			size={size}
			color={color}
			style={style}
			{...props}
		/>
	);
};

export default UnifiedIcon;
