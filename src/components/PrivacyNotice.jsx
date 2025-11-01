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

const PrivacyNotice = () => {
	const [showNotice, setShowNotice] = useState(false);

	useEffect(() => {
		// Check if user has already acknowledged the notice
		const hasAcknowledged = localStorage.getItem("privacy-notice-acknowledged");
		if (!hasAcknowledged) {
			setShowNotice(true);
		}
	}, []);

	const handleAcknowledge = () => {
		localStorage.setItem("privacy-notice-acknowledged", "true");
		setShowNotice(false);
	};

	if (!showNotice) return null;

	return (
		<div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 shadow-lg z-50">
			<div className="text-white">
				<h3 className="font-semibold text-sm mb-2">Local Storage Notice</h3>
				<p className="text-xs text-white/80 mb-3">
					This site uses local storage to cache GitHub data for better
					performance. No personal data is stored or tracked.
				</p>
				<div className="flex gap-2">
					<button
						onClick={handleAcknowledge}
						className="px-3 py-1 bg-primary-500 text-white text-xs rounded hover:bg-primary-600 transition-colors"
					>
						Got it
					</button>
					<button
						onClick={() => setShowNotice(false)}
						className="px-3 py-1 text-white/70 text-xs hover:text-white transition-colors"
					>
						Dismiss
					</button>
				</div>
			</div>
		</div>
	);
};

export default PrivacyNotice;
