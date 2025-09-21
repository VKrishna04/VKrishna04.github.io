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

import React, { memo, useEffect, useState } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
// import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Resume from "./pages/Resume";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import FaviconManager from "./components/FaviconManager";
import PrivacyNotice from "./components/PrivacyNotice";
import "./App.css";

// Custom hook for managing page titles and favicon
const usePageConfiguration = (location) => {
	const [settings, setSettings] = useState({});

	useEffect(() => {
		fetch("/settings.json")
			.then((response) => response.json())
			.then((data) => setSettings(data))
			.catch((error) => console.warn("Could not fetch settings:", error));
	}, []);

	useEffect(() => {
		if (!settings.display) return;

		// Update page title based on current route
		const getPageTitle = () => {
			const baseName = settings.display.officialName || "Portfolio";
			const titles = {
				"/": `${baseName} - Portfolio`,
				"/about": `About - ${baseName}`,
				"/projects": `Projects - ${baseName}`,
				"/resume": `Resume - ${baseName}`,
				"/contact": `Contact - ${baseName}`,
			};
			return titles[location.pathname] || `${baseName} - Portfolio`;
		};

		document.title = getPageTitle();

		// Update meta description
		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription && settings.display.officialName) {
			metaDescription.content = `${settings.display.officialName} - Full Stack Developer Portfolio`;
		}

		// Update author meta
		const metaAuthor = document.querySelector('meta[name="author"]');
		if (metaAuthor && settings.display.devUsername) {
			metaAuthor.content = settings.display.devUsername;
		}
	}, [location.pathname, settings]);

	return settings;
};

const AppContent = memo(() => {
	const location = useLocation();
	const settings = usePageConfiguration(location); // Use the hook to manage page configuration

	return (
		<div className="App">
			<FaviconManager settings={settings} />
			<Navbar />

			<main className="page-transition">
				<Routes location={location}>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/projects" element={<Projects />} />
					<Route path="/resume" element={<Resume />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</main>

			<Footer />
			<PrivacyNotice />
			{/* <ScrollToTop /> */}
		</div>
	);
});

const App = memo(() => {
	return (
		<Router
			future={{
				v7_startTransition: true,
				v7_relativeSplatPath: true,
			}}
		>
			<AppContent />
		</Router>
	);
});

export default App;
