#!/usr/bin/env node
/**
 * generate-ai-data.js
 * Generates AI-friendly static data files at build time.
 * Run: node scripts/generate-ai-data.js
 * Output: public/api/*.json, public/llms.txt, public/.well-known/ai-plugin.json
 */

/* global process */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { resolveDerivedValues } from "../src/utils/awards.js"
import { ATTRIBUTION } from "../src/utils/attribution.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const settingsPath = path.join(__dirname, "..", "public", "settings.json")
const settings = resolveDerivedValues(
	JSON.parse(fs.readFileSync(settingsPath, "utf8"))
)
const { home, about, github, projects, resume, seo } = settings

// The project credit, in the shape each generated file wants it. Every JSON
// endpoint carries the object; llms.txt and humans.txt carry the prose. The
// footer is the human-visible copy — these are the ones a crawler, an agent or
// a `curl` will read, and every build rewrites them.
const CREDIT = {
  builtBy: ATTRIBUTION.author,
  builtByUrl: ATTRIBUTION.github,
  sourceRepository: ATTRIBUTION.repository,
  generator: ATTRIBUTION.generator,
  license: ATTRIBUTION.license,
  notice:
    "Attribution required by NOTICE under Apache License 2.0 section 4(d).",
}

// NOTICE is the file Apache 2.0 section 4(d) actually names. Serving a copy
// means the deployed site carries its own licence terms, not just the repo.
fs.copyFileSync(
  path.join(__dirname, "..", "NOTICE"),
  path.join(__dirname, "..", "public", "NOTICE.txt")
)

// humans.txt is the oldest convention for exactly this, and it costs one file.
// Written before the opt-out below: a site owner may decline to publish a
// machine-readable copy of themselves without that also dropping the credit.
fs.writeFileSync(
  path.join(__dirname, "..", "public", "humans.txt"),
  `/* SITE */
Owner: ${home?.name || ""}
GitHub: https://github.com/${github?.username || ""}

/* BUILT WITH */
${ATTRIBUTION.credit}
Author: ${ATTRIBUTION.github}
Source: ${ATTRIBUTION.repository}
Generator: ${ATTRIBUTION.generator}
License: ${ATTRIBUTION.license}
`
)

// The whole point of these files is to be read by something that is not a
// browser. A site owner who would rather not publish a machine-readable copy
// of themselves turns it off here.
if (seo?.crawling?.aiData === false) {
  console.log("ℹ seo.crawling.aiData is false - skipping AI data generation")
  process.exit(0)
}

// The site's own address. Everything published under public/api and llms.txt is
// absolute, so this cannot be a fixed domain: a fork would advertise the
// upstream author's URLs as its own machine-readable endpoints.
const SITE = (seo?.canonical || seo?.customDomain || "").replace(/\/$/, "")

const OUT = path.join(__dirname, "..", "public", "api")
fs.mkdirSync(OUT, { recursive: true })
fs.mkdirSync(path.join(__dirname, "..", "public", ".well-known"), { recursive: true })

// --- portfolio.json ---
const bioText = Array.isArray(about?.paragraphs)
  ? about.paragraphs.join(" ")
  : typeof about?.paragraphs === "string"
  ? about.paragraphs
  : ""

const allSkills = (about?.skills || [])
  .flatMap((cat) => (Array.isArray(cat.items) ? cat.items : []))
  .map((s) => (typeof s === "string" ? s : s?.name || ""))
  .filter(Boolean)

const portfolioProjects = (projects?.staticProjects || [])
  .filter((p) => p.showInProjects !== false)
  .map((p) => ({
    name: p.name,
    description: p.description,
    technologies: p.technologies || [],
    category: p.category,
    status: p.status,
    featured: p.featured || false,
    githubUrl: p.githubUrl || null,
    liveUrl: p.liveUrl || null,
  }))

const experience = (resume?.experiences || []).map((e) => ({
  title: e.title || "",
  company: e.company || "",
  period: e.period || "",
  location: e.location || "",
  description: e.description || "",
}))

const education = (resume?.education || []).map((e) => ({
  degree: e.degree || "",
  field: e.field || "",
  school: e.school || "",
  period: e.period || "",
  gpa: e.gpa || "",
  achievements: e.achievements || [],
}))

const portfolio = {
  generatedAt: new Date().toISOString(),
  owner: {
    name: home?.name || "",
    title: about?.title || "",
    location: home?.location || "",
    bio: bioText,
  },
  skills: allSkills,
  experience,
  education,
  stats: about?.stats || [],
  contact: {
    github: `https://github.com/${github?.username || ""}`,
    site: SITE,
  },
  projects: portfolioProjects,
  _attribution: CREDIT,
}
fs.writeFileSync(
  path.join(OUT, "portfolio.json"),
  JSON.stringify(portfolio, null, 2)
)

// --- projects.json ---
const projectsOut = {
  generatedAt: new Date().toISOString(),
  total: portfolioProjects.length,
  _attribution: CREDIT,
  projects: portfolioProjects,
  markdown: portfolioProjects
    .map(
      (p) =>
        `## ${p.name}\n${p.description}\n**Tech:** ${(p.technologies || []).join(", ")}${p.githubUrl ? `\n**GitHub:** ${p.githubUrl}` : ""}`
    )
    .join("\n\n"),
  plain: portfolioProjects
    .map(
      (p) =>
        `${p.name}: ${p.description} | ${(p.technologies || []).join(", ")}`
    )
    .join("\n"),
}
fs.writeFileSync(
  path.join(OUT, "projects.json"),
  JSON.stringify(projectsOut, null, 2)
)

// --- about.json ---
fs.writeFileSync(
  path.join(OUT, "about.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      name: home?.name || "",
      title: about?.title || "",
      bio: bioText,
      location: home?.location || "",
      skills: allSkills,
      experience,
      education,
      stats: about?.stats || [],
      _attribution: CREDIT,
    },
    null,
    2
  )
)

// --- contact.json ---
const buttons = home?.buttons || []
fs.writeFileSync(
  path.join(OUT, "contact.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      github: `https://github.com/${github?.username || ""}`,
      website: SITE,
      _attribution: CREDIT,
      links: buttons.map((b) => ({ label: b.text || b.label || "", url: b.href || b.url || "" })),
    },
    null,
    2
  )
)

// --- llms.txt ---
const section = (title, body) => (body ? `\n## ${title}\n${body}\n` : "")

const experienceMd = experience
  .map((e) => {
    const head = [e.title, e.company].filter(Boolean).join(" @ ")
    const meta = [e.period, e.location].filter(Boolean).join(", ")
    const detail = Array.isArray(e.description)
      ? e.description.map((d) => `- ${d}`).join("\n")
      : e.description
    const body = [meta, detail].filter(Boolean).join("\n")
    return `### ${head}${body ? `\n${body}` : ""}`
  })
  .join("\n\n")

const educationMd = education
  .map((e) => {
    const head = [e.degree, e.field].filter(Boolean).join(", ")
    const meta = [e.school, e.period].filter(Boolean).join(" — ")
    const body = [meta, e.gpa ? `GPA: ${e.gpa}` : ""].filter(Boolean).join("\n")
    return `### ${head}${body ? `\n${body}` : ""}`
  })
  .join("\n\n")

const llmsTxt = `# ${home?.name || "Portfolio"} — AI Context

## About
${bioText}

## Skills
${allSkills.slice(0, 20).join(", ")}
${section("Experience", experienceMd)}${section("Education", educationMd)}
## Projects (${portfolioProjects.length} total)
${portfolioProjects
  .slice(0, 10)
  .map((p) => `- **${p.name}**: ${p.description}`)
  .join("\n")}

## Links
- Portfolio: ${SITE}
- GitHub: https://github.com/${github?.username || ""}
- Projects API: ${SITE}/api/projects.json
- Full data: ${SITE}/api/portfolio.json

## Machine-Readable Data
All portfolio data available as JSON at build time:
- GET /api/portfolio.json — full portfolio data
- GET /api/projects.json — projects with markdown and plain-text formats
- GET /api/about.json — bio, skills, stats
- GET /api/contact.json — contact info and links

## Credits
${ATTRIBUTION.credit} — ${ATTRIBUTION.github}
Source: ${ATTRIBUTION.repository}
Build your own: ${ATTRIBUTION.generator}
Licensed ${ATTRIBUTION.license}. Attribution required by NOTICE, Apache License 2.0 section 4(d).
`
fs.writeFileSync(path.join(__dirname, "..", "public", "llms.txt"), llmsTxt)

// --- .well-known/ai-plugin.json ---
fs.writeFileSync(
  path.join(__dirname, "..", "public", ".well-known", "ai-plugin.json"),
  JSON.stringify(
    {
      schema_version: "v1",
      name_for_human: `${home?.name || "Portfolio"} Data`,
      name_for_model: "portfolio_data",
      description_for_human:
        "Access portfolio data, projects, and bio information.",
      description_for_model:
        "Provides structured portfolio data including projects, skills, bio, and contact information for AI agents.",
      auth: { type: "none" },
      logo_url: SITE ? `${SITE}/favicon-96x96.png` : "",
      contact_email: "",
      legal_info_url: `https://github.com/${github?.username || ""}`,
    },
    null,
    2
  )
)

console.log(
  "✓ Generated: llms.txt, humans.txt, api/portfolio.json, api/projects.json, api/about.json, api/contact.json, .well-known/ai-plugin.json"
)
