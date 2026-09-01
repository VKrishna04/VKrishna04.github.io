#!/usr/bin/env node

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
 * Checks settings.json against settings.schema.json, and compiles both schemas.
 *
 * scripts/validate-json.js only parses; it never looked at the schema. The two
 * files drifted apart for a long time without anything noticing - whole section
 * schemas had been written but nested one level too deep, where JSON Schema
 * silently ignores them, and every $ref into #/definitions was dangling. The
 * compile step below is what catches that class of mistake: an unresolvable
 * $ref is a compile error, not a quiet pass.
 */

/* global process */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));

const SETTINGS = "public/settings.json";
const SETTINGS_SCHEMA = "public/settings.schema.json";
const MANIFEST_SCHEMA = "public/schemas/project-manifest.schema.json";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

let failed = false;

// Compiling is the $ref check. A schema that only parses can still be inert.
const compile = (file) => {
	const schema = read(file);
	// $schema declares draft-07, which is the dialect Ajv already uses here.
	delete schema.$schema;
	try {
		const validate = ajv.compile(schema);
		console.log(`✅ ${file} compiles`);
		return validate;
	} catch (error) {
		console.error(`❌ ${file} does not compile\n   ${error.message}`);
		failed = true;
		return null;
	}
};

const validateSettings = compile(SETTINGS_SCHEMA);
compile(MANIFEST_SCHEMA);

if (validateSettings && !validateSettings(read(SETTINGS))) {
	console.error(`❌ ${SETTINGS} does not match its schema:`);
	for (const e of validateSettings.errors) {
		const where = e.instancePath || e.dataPath || "(root)";
		const extra = Object.values(e.params).flat().join(", ");
		console.error(`   ${where} ${e.message}${extra ? ` - ${extra}` : ""}`);
	}
	failed = true;
} else if (validateSettings) {
	console.log(`✅ ${SETTINGS} matches its schema`);
}

process.exit(failed ? 1 : 0);
