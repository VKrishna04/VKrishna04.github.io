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

import { useEffect } from "react";
import { initializeFavicons } from "../utils/favicon";

// Component to automatically manage favicons
const FaviconManager = ({ settings, children }) => {
	useEffect(() => {
		if (settings) {
			initializeFavicons(settings);
		}
	}, [settings]);

	return children;
};

export default FaviconManager;
