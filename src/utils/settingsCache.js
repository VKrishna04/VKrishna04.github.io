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
 * Single shared fetch for /settings.json.
 *
 * Before this, eleven components and hooks each issued their own
 * fetch("/settings.json") (~119 KB per request; the projects page fired
 * eight of them concurrently). The file is static per deploy, so one
 * in-flight/settled promise serves every consumer.
 */

let settingsPromise = null

export function fetchSettings() {
	if (!settingsPromise) {
		settingsPromise = fetch("/settings.json")
			.then((res) => {
				if (!res.ok) throw new Error(`settings.json HTTP ${res.status}`)
				return res.json()
			})
			.catch((err) => {
				// don't cache a failure — the next caller retries
				settingsPromise = null
				throw err
			})
	}
	return settingsPromise
}
