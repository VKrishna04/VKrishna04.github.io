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

import { Link, useLocation } from "react-router-dom"
import { FaArrowRight } from "react-icons/fa"

// Guided flow through the portfolio: each page hands off to the next one.
// Contact loops back to Home so the trail never dead-ends.
const PAGE_FLOW = {
	"/": {
		path: "/about",
		label: "About",
		tagline: "The story, skills, and experience behind the work",
	},
	"/about": {
		path: "/projects",
		label: "Projects",
		tagline: "What I've built — extensions, full-stack apps, and more",
	},
	"/projects": {
		path: "/resume",
		label: "Resume",
		tagline: "Experience, education, and achievements at a glance",
	},
	"/resume": {
		path: "/stats",
		label: "DSA Stats",
		tagline: "Live problem-solving stats, streaks, and progress",
	},
	"/stats": {
		path: "/contact",
		label: "Contact",
		tagline: "Let's build something together",
	},
	"/contact": {
		path: "/",
		label: "Home",
		tagline: "Back to the start",
	},
}

const NextPageNav = () => {
	const location = useLocation()
	const next = PAGE_FLOW[location.pathname]

	// Unknown routes (404) get no teaser
	if (!next) return null

	return (
		<section className="relative border-t border-gray-800/60 bg-gray-950">
			<Link
				to={next.path}
				className="group block max-w-7xl mx-auto px-4 py-14 md:py-16"
			>
				<div className="flex items-center justify-between gap-6">
					<div>
						<div className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-2">
							Next up
						</div>
						<div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent group-hover:from-primary-300 group-hover:to-accent-300 transition-colors duration-300">
							{next.label}
						</div>
						<p className="mt-2 text-sm md:text-base text-gray-400">
							{next.tagline}
						</p>
					</div>
					<div className="shrink-0 p-4 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-400 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-primary-500/20 group-hover:text-primary-300">
						<FaArrowRight className="w-5 h-5" />
					</div>
				</div>
			</Link>
			{/* bottom gradient hairline to hand off into the footer */}
			<div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent"></div>
		</section>
	)
}

export default NextPageNav
