#!/usr/bin/env node
/**
 * generate-ai-data.js
 * Generates AI-friendly static data files at build time.
 * Run: node scripts/generate-ai-data.js
 * Output: public/api/*.json, public/llms.txt, public/.well-known/ai-plugin.json
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const settingsPath = path.join(__dirname, "..", "public", "settings.json")
const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"))
const { home, about, github, projects } = settings

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

const portfolio = {
  generatedAt: new Date().toISOString(),
  owner: {
    name: home?.name || "",
    title: about?.title || "",
    location: home?.location || "",
    bio: bioText,
  },
  skills: allSkills,
  stats: about?.stats || [],
  contact: {
    github: `https://github.com/${github?.username || ""}`,
    site: `https://vkrishna04.me`,
  },
  projects: portfolioProjects,
}
fs.writeFileSync(
  path.join(OUT, "portfolio.json"),
  JSON.stringify(portfolio, null, 2)
)

// --- projects.json ---
const projectsOut = {
  generatedAt: new Date().toISOString(),
  total: portfolioProjects.length,
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
      stats: about?.stats || [],
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
      website: "https://vkrishna04.me",
      links: buttons.map((b) => ({ label: b.text || b.label || "", url: b.href || b.url || "" })),
    },
    null,
    2
  )
)

// --- llms.txt ---
const llmsTxt = `# ${home?.name || "Portfolio"} — AI Context

## About
${bioText}

## Skills
${allSkills.slice(0, 20).join(", ")}

## Projects (${portfolioProjects.length} total)
${portfolioProjects
  .slice(0, 10)
  .map((p) => `- **${p.name}**: ${p.description}`)
  .join("\n")}

## Links
- Portfolio: https://vkrishna04.me
- GitHub: https://github.com/${github?.username || ""}
- Projects API: https://vkrishna04.me/api/projects.json
- Full data: https://vkrishna04.me/api/portfolio.json

## Machine-Readable Data
All portfolio data available as JSON at build time:
- GET /api/portfolio.json — full portfolio data
- GET /api/projects.json — projects with markdown and plain-text formats
- GET /api/about.json — bio, skills, stats
- GET /api/contact.json — contact info and links
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
      logo_url: "https://vkrishna04.me/favicon.ico",
      contact_email: "",
      legal_info_url: `https://github.com/${github?.username || ""}`,
    },
    null,
    2
  )
)

console.log(
  "✓ Generated: llms.txt, api/portfolio.json, api/projects.json, api/about.json, api/contact.json, .well-known/ai-plugin.json"
)
