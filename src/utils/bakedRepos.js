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

// Build-time GitHub listing baked by scripts/fetch-project-manifests.js.
// Reading it spares every visitor the api.github.com calls (and their rate
// limit); callers fall back to the live API when the file is missing.
export async function fetchBakedRepos() {
	try {
		const res = await fetch("/data/github/repos.json", {
			signal: AbortSignal.timeout(8000),
		})
		if (!res.ok) return null
		const data = await res.json()
		return Array.isArray(data?.repos) && data.repos.length ? data.repos : null
	} catch {
		return null
	}
}
