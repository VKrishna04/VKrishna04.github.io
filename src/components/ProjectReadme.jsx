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

/*
 * Renders a project repo's README below its page.
 *
 * The Markdown is fetched at build time by scripts/fetch-project-manifests.js,
 * so it is in the prerendered HTML and a crawler reads it.
 *
 * This is third-party content, so two rules hold:
 *
 *  1. No rehype-raw. react-markdown skips raw HTML by default, which is exactly
 *     what we want — a README containing <script> or an onerror attribute
 *     renders as nothing, not as markup. `disallowedElements` below is a second
 *     line for the elements Markdown itself can produce.
 *  2. Every URL goes through urlTransform. READMEs are full of repo-relative
 *     paths that would 404 here, so images resolve against raw.githubusercontent
 *     and links against the repo's GitHub blob view, and only http(s) survives.
 *
 * Lazy-loaded from ProjectDetail so react-markdown stays out of the main bundle.
 */

import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

// Anchors that only make sense inside GitHub's own rendering, plus the two
// elements Markdown can emit that we would rather not style around.
const DISALLOWED = ["script", "style", "iframe", "object", "embed", "form"]

/*
 * `key` is the attribute the URL came from: "src" for images, "href" for links.
 * Anything that is not http(s) after resolution is dropped rather than passed
 * through, so `javascript:` and `data:` URLs never reach the DOM.
 */
const makeUrlTransform = (imageBase, linkBase) => (url, key) => {
	if (typeof url !== "string" || !url) return ""
	if (url.startsWith("#")) return url // in-document anchor, leave alone
	try {
		const resolved = new URL(url, key === "src" ? imageBase : linkBase)
		return resolved.protocol === "https:" || resolved.protocol === "http:"
			? resolved.href
			: ""
	} catch {
		return ""
	}
}

// README headings are shifted down one level: the page already owns the h1, and
// a README's own h1 is nearly always the project name repeated.
const heading = (Tag, className) =>
	function H({ children }) {
		return <Tag className={className}>{children}</Tag>
	}

const COMPONENTS = {
	h1: heading("h2", "text-2xl font-bold text-white mt-10 mb-4"),
	h2: heading("h3", "text-xl font-bold text-white mt-8 mb-3"),
	h3: heading("h4", "text-lg font-semibold text-white mt-6 mb-2"),
	h4: heading("h5", "text-base font-semibold text-gray-100 mt-5 mb-2"),
	h5: heading("h6", "text-base font-semibold text-gray-200 mt-4 mb-2"),
	h6: heading("h6", "text-sm font-semibold text-gray-300 mt-4 mb-2"),

	p: ({ children }) => (
		<p className="text-gray-300 leading-relaxed mb-4">{children}</p>
	),
	a: ({ href, children }) =>
		href ? (
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer nofollow ugc"
				className="text-purple-300 underline underline-offset-2 hover:text-purple-200"
			>
				{children}
			</a>
		) : (
			<span>{children}</span>
		),
	ul: ({ children }) => (
		<ul className="list-disc pl-6 space-y-2 text-gray-300 mb-4">{children}</ul>
	),
	ol: ({ children }) => (
		<ol className="list-decimal pl-6 space-y-2 text-gray-300 mb-4">
			{children}
		</ol>
	),
	li: ({ children }) => <li className="leading-relaxed">{children}</li>,
	blockquote: ({ children }) => (
		<blockquote className="border-l-2 border-purple-400/60 pl-4 italic text-gray-400 mb-4">
			{children}
		</blockquote>
	),
	hr: () => <hr className="my-8 border-white/10" />,
	img: ({ src, alt }) =>
		src ? (
			<img
				src={src}
				alt={alt || ""}
				loading="lazy"
				className="inline-block max-w-full rounded-lg border border-white/10 my-2"
			/>
		) : null,
	// react-markdown stopped passing an `inline` flag in v9, and an indented
	// code block carries no language class either — so style every <code> as
	// inline and let the <pre> undo it for the block case.
	code: ({ children }) => (
		<code className="px-1.5 py-0.5 rounded bg-black/50 text-purple-200 text-[0.9em]">
			{children}
		</code>
	),
	pre: ({ children }) => (
		<pre className="overflow-x-auto p-4 bg-black/40 border border-white/10 rounded-xl text-sm text-gray-200 mb-4 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">
			{children}
		</pre>
	),
	// GitHub-flavoured tables can be much wider than the column; scroll them
	// inside their own box rather than letting the page scroll sideways.
	table: ({ children }) => (
		<div className="overflow-x-auto border border-white/10 rounded-xl mb-4">
			<table className="w-full text-sm text-left">{children}</table>
		</div>
	),
	thead: ({ children }) => (
		<thead className="bg-white/5 text-gray-200">{children}</thead>
	),
	tbody: ({ children }) => <tbody className="text-gray-300">{children}</tbody>,
	tr: ({ children }) => (
		<tr className="border-t border-white/10">{children}</tr>
	),
	th: ({ children }) => (
		<th className="px-4 py-3 font-semibold">{children}</th>
	),
	td: ({ children }) => <td className="px-4 py-3 align-top">{children}</td>,
}

const ProjectReadme = ({ readme, accent }) => {
	if (!readme?.markdown) return null

	const body = (
		<>
			<Markdown
				remarkPlugins={[remarkGfm]}
				disallowedElements={DISALLOWED}
				unwrapDisallowed
				urlTransform={makeUrlTransform(readme.imageBase, readme.linkBase)}
				components={COMPONENTS}
			>
				{readme.markdown}
			</Markdown>
			{readme.truncated && (
				<p className="mt-6 text-sm text-gray-500">
					This README was truncated.{" "}
					<a
						href={readme.sourceUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="underline hover:text-gray-300"
					>
						Read the rest on GitHub
					</a>
					.
				</p>
			)}
		</>
	)

	return (
		<section className="mt-16 border-t border-white/10 pt-10">
			{readme.collapsed ? (
				<details className="group">
					<summary
						className="cursor-pointer text-2xl font-bold text-white marker:text-purple-400"
						style={accent ? { color: accent } : undefined}
					>
						{readme.heading}
					</summary>
					<div className="mt-6">{body}</div>
				</details>
			) : (
				<>
					<h2
						className="text-2xl font-bold text-white mb-6"
						style={accent ? { color: accent } : undefined}
					>
						{readme.heading}
					</h2>
					{body}
				</>
			)}
		</section>
	)
}

export default ProjectReadme
