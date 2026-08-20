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
 * Attribution — the one place the project credit lives.
 *
 * This file is part of the build-integrity protection set:
 *  - scripts/generate-hashes.js records its sha256 in protection-hashes.json
 *  - scripts/pre-build-validation.js requires it to exist, to contain the
 *    author's name, and to be rendered by the Footer — otherwise the build fails
 *  - the NOTICE file (Apache License §4(d)) makes retaining this credit a
 *    condition of redistributing the project
 *
 * Removing or blanking this credit therefore breaks `npm run build`. Forks are
 * welcome to use everything here — the license only asks that this line stays.
 */

export const ATTRIBUTION = Object.freeze({
	author: "Krishna GSVV",
	github: "https://github.com/VKrishna04",
	repository: "https://github.com/VKrishna04/VKrishna04.github.io",
	website: "https://vkrishna04.me",
	license: "Apache-2.0",
	credit: "Designed & built by Krishna GSVV",
})

export function getAttribution() {
	return ATTRIBUTION
}
