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
 * React Icon → SVG data URL conversion, used for the dynamic favicon.
 * Icons resolve from the build-time generated map via iconSystemCore.
 */

import React from "react"
import { createRoot } from "react-dom/client"
import { getUnifiedIcon } from "./iconSystemCore.js"

/**
 * Convert React Icon to SVG data URL for favicon
 */
export const reactIconToDataUrl = async (iconName, options = {}) => {
	const {
		size = 32,
		color = "#000000",
		backgroundColor = "transparent",
		padding = 4,
	} = options

	try {
		const IconComponent = await getUnifiedIcon(iconName)
		if (!IconComponent) {
			return null
		}

		// Create a temporary div to render the icon
		const div = document.createElement("div")
		div.style.position = "absolute"
		div.style.top = "-9999px"
		div.style.left = "-9999px"
		div.style.width = `${size}px`
		div.style.height = `${size}px`
		document.body.appendChild(div)

		// Create root and render icon
		const root = createRoot(div)
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
			)
			setTimeout(resolve, 100) // Give time for rendering
		})

		// Get the SVG element
		const svgElement = div.querySelector("svg")
		if (!svgElement) {
			console.warn("No SVG element found for icon:", iconName)
			return null
		}

		// Clone and enhance the SVG
		const svg = svgElement.cloneNode(true)
		svg.setAttribute("width", size)
		svg.setAttribute("height", size)
		svg.setAttribute("viewBox", `0 0 ${size} ${size}`)

		// Add background if specified
		if (backgroundColor && backgroundColor !== "transparent") {
			const rect = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"rect"
			)
			rect.setAttribute("width", "100%")
			rect.setAttribute("height", "100%")
			rect.setAttribute("fill", backgroundColor)
			rect.setAttribute("rx", "4")
			svg.insertBefore(rect, svg.firstChild)
		}

		// Convert to data URL
		const svgData = new XMLSerializer().serializeToString(svg)
		const dataUrl = `data:image/svg+xml;base64,${btoa(svgData)}`

		// Cleanup
		root.unmount()
		document.body.removeChild(div)

		return dataUrl
	} catch (error) {
		console.error(`Error converting icon ${iconName} to data URL:`, error)
		return null
	}
}
