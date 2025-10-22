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
import { useEffect, useRef } from "react";

/**
 * Enhanced masonry hook with intelligent column calculation
 * Automatically determines optimal columns based on item count and viewport
 */
const useMasonry = (
	itemSelector = ".masonry-item-about",
	containerSelector = ".masonry-grid-about"
) => {
	const containerRef = useRef(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const calculateOptimalColumns = () => {
			const items = container.querySelectorAll(itemSelector);
			const itemCount = items.length;
			if (itemCount === 0) return 1;

			// Get viewport width
			const viewportWidth = window.innerWidth;

			// Define optimal columns based on item count and viewport
			let optimalColumns = 1;

			if (viewportWidth < 640) {
				// Mobile: 1-2 columns max
				optimalColumns = Math.min(itemCount, 2);
			} else if (viewportWidth < 1024) {
				// Tablet: 2-3 columns
				optimalColumns = Math.min(itemCount, 3);
			} else if (viewportWidth < 1536) {
				// Desktop: 3-4 columns
				optimalColumns = Math.min(itemCount, 4);
			} else if (viewportWidth < 1920) {
				// Large desktop: 4-5 columns
				optimalColumns = Math.min(itemCount, 5);
			} else {
				// Ultra-wide: up to 6 columns
				optimalColumns = Math.min(itemCount, 6);
			}

			// Ensure we never have more columns than items
			return Math.min(optimalColumns, itemCount);
		};

		const updateMasonryColumns = () => {
			const optimalColumns = calculateOptimalColumns();
			container.style.setProperty("--about-masonry-columns", optimalColumns);
		};

		// Initial calculation
		updateMasonryColumns();

		// Update on window resize with debounce
		let resizeTimeout;
		const handleResize = () => {
			if (resizeTimeout) clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(updateMasonryColumns, 150);
		};

		window.addEventListener("resize", handleResize);

		// Observe container for content changes
		const resizeObserver = new ResizeObserver(() => {
			requestAnimationFrame(updateMasonryColumns);
		});

		resizeObserver.observe(container);

		// Observe all items for changes
		const items = container.querySelectorAll(itemSelector);
		items.forEach((item) => resizeObserver.observe(item));

		// Cleanup
		return () => {
			if (resizeTimeout) clearTimeout(resizeTimeout);
			window.removeEventListener("resize", handleResize);
			resizeObserver.disconnect();
		};
	}, [itemSelector, containerSelector]);

	return containerRef;
};

export default useMasonry;
