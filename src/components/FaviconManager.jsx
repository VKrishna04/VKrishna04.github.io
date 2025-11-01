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
import { initializeFavicons } from "../utils/faviconEnhanced";

// Enhanced Component to automatically manage favicons with React Icons support
const FaviconManager = ({ settings, children }) => {
	const initializedRef = useRef(false);
	const lastSettingsRef = useRef(null);

	useEffect(() => {
		// Only initialize once on mount or when favicon settings actually change
		const faviconSettings = settings?.favicon;
		if (!faviconSettings) return;

		// Check if favicon settings have actually changed
		const faviconKey = JSON.stringify(faviconSettings);
		if (lastSettingsRef.current === faviconKey && initializedRef.current) {
			return;
		}

		// Debounce initialization to avoid performance issues
		const timeoutId = setTimeout(() => {
			try {
				initializeFavicons(settings);
				initializedRef.current = true;
				lastSettingsRef.current = faviconKey;
			} catch (error) {
				console.warn("Failed to initialize favicons:", error);
			}
		}, 100);

		return () => clearTimeout(timeoutId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [settings?.favicon?.default, settings?.favicon?.darkMode]); // Only depend on actual favicon values

	return children || null;
};

export default FaviconManager;
