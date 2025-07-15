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

const useMasonry = (
	itemSelector = ".masonry-item",
	containerSelector = ".masonry-grid"
) => {
	const containerRef = useRef(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const resizeObserver = new ResizeObserver(() => {
			layoutMasonry();
		});

		const layoutMasonry = () => {
			const items = container.querySelectorAll(itemSelector);
			if (items.length === 0) return;

			// Get container width and calculate columns
			const containerWidth = container.offsetWidth;
			const itemWidth = items[0].offsetWidth;
			const gap = 32; // 2rem = 32px
			const columns = Math.floor((containerWidth + gap) / (itemWidth + gap));

			if (columns <= 1) {
				// Single column layout - reset any transforms
				items.forEach((item) => {
					item.style.transform = "";
					item.style.position = "";
				});
				return;
			}

			// Calculate column heights
			const columnHeights = new Array(columns).fill(0);
			const columnWidth = itemWidth;

			items.forEach((item) => {
				// Find the shortest column
				const shortestColumnIndex = columnHeights.indexOf(
					Math.min(...columnHeights)
				);

				// Position the item
				const x = shortestColumnIndex * (columnWidth + gap);
				const y = columnHeights[shortestColumnIndex];

				item.style.position = "absolute";
				item.style.transform = `translate(${x}px, ${y}px)`;
				item.style.transition = "transform 0.3s ease-in-out";

				// Update column height
				columnHeights[shortestColumnIndex] += item.offsetHeight + gap;
			});

			// Set container height
			const maxHeight = Math.max(...columnHeights);
			container.style.height = `${maxHeight}px`;
			container.style.position = "relative";
		};

		// Initial layout
		const timer = setTimeout(layoutMasonry, 100);

		// Observe container for size changes
		resizeObserver.observe(container);

		// Observe all items for size changes
		const items = container.querySelectorAll(itemSelector);
		items.forEach((item) => resizeObserver.observe(item));

		// Listen for window resize
		window.addEventListener("resize", layoutMasonry);

		// Cleanup
		return () => {
			clearTimeout(timer);
			resizeObserver.disconnect();
			window.removeEventListener("resize", layoutMasonry);
		};
	}, [itemSelector, containerSelector]);

	return containerRef;
};

export default useMasonry;
