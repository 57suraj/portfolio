import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';

const GithubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ marginRight: '6px', verticalAlign: 'text-bottom' }}
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

const ChevronIcon = ({ open }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      marginRight: '6px',
      verticalAlign: 'text-bottom',
      transition: 'transform 0.3s ease',
      transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
    }}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const deepDives = {
  'Hybrid Semantic Code Search': {
    sections: [
      {
        label: 'hardest problem',
        title: 'AST-Aware Chunking with BraceTracker',
        text: `Most RAG pipelines blindly split code at fixed token intervals, cutting functions in half, orphaning JSDoc from its target, or merging unrelated blocks. I wrote a custom BraceTracker class that pre-scans every file to build a line-by-line depth map of brace balance, while masking out all non-code regions like strings, block comments, and template literal interpolations with nested braces. The chunker only detects boundaries at depth 0, meaning it never splits mid-function or mid-class. Large classes get split by method, not by line count. Each method chunk carries its parent class name for retrieval context. Each of the 12,000+ chunks is a complete, self-contained unit of logic.`,
      },
      {
        label: 'architecture',
        title: 'Offline Indexing ↔ Online Serving Separation',
        text: `The ingestion pipeline runs entirely offline. It's a Python batch job that processes JSONL output from the chunker, generates text-embedding-3-small vectors, and upserts into Supabase with rate-limited batches. The search API is a separate FastAPI service that receives a query, vectorizes it in real-time, calls a hybrid_search PostgreSQL RPC with BM25 + pgvector score fusion, and optionally passes candidates through a GPT-4.1-mini reranking layer that scores each chunk 0 to 100 for contextual relevance. Indexing never blocks search. Search never triggers reindexing.`,
      },
      {
        label: 'source integrity',
        title: 'Zero Hallucinations by Design',
        text: `Every result returned is a verbatim code chunk with a direct GitHub file path and line range. The LLM reranker evaluates and scores existing chunks but never generates code. If a query matches nothing above the relevance threshold, it returns zero results instead of fabricating an answer. The system prompt enforces strict scoring: config files, type-only definitions, and tangentially related utils get scored below 30 and discarded. What ships to the frontend is always real, traced, production source code.`,
      },
    ],
  },
  'Connect 4': {
    sections: [
      {
        label: 'hardest problem',
        title: 'Atomic Joins Under Concurrent Load',
        text: `If 50 people try to join the same event at once, a basic "read count, check capacity, insert" flow will overfill the event every time. I handled this with Supabase RPC to keep the logic atomic. The capacity check and membership insert happen in a single database transaction. If two requests hit at the same millisecond, the DB handles them in order so the second one gets a clean 'full' response. No race conditions.`,
      },
      {
        label: 'architecture',
        title: 'Vector-Embedded Event Discovery',
        text: `Search is way deeper than just matching keywords. Every event description is embedded via OpenAI and stored in pgvector. If someone searches for 'outdoor vibes', it doesn't just look for those words. It finds semantically similar events like hiking or beach meetups that keyword search would completely miss. Combined with Supabase Realtime for the group chat, the discovery flow feels instant and snappy.`,
      },
      {
        label: 'security',
        title: 'Shift-Left Access Control with Database RLS',
        text: `Auth is also enforced at the database level through Supabase Row-Level Security policies. Users can only delete their own comments or see specific event records because the database policies itself check the authenticated user's ID. Even if someone bypassed the frontend and hit the API directly, the RLS policies would reject unauthorized operations. Its also combined with a bunch of custom validations in the backend.`,
      },
    ],
  },
  'CineChat': {
    sections: [
      {
        label: 'hardest problem',
        title: 'Infinite Recursion Without Infinite Load Times',
        text: `Reddit-style nested comments are a performance nightmare if you fetch the whole tree all at once. I used a self-referencing MongoDB schema with compound indexes on parent ID and movie ID to keep things fastt. The React side only fetches top-level comments and lazy-loads child threads on expand. It cut query times by nearly 50%. Sub-200ms initial paint even on deep threads.`,
      },
      {
        label: 'architecture',
        title: 'Dual-API Real-Time Search Layerr',
        text: `The search layer syncs TMDB and OMDB data in real-time. TMDB handles the posters and discovery while OMDB fills in metadata like cast info and plot. It's all lazy-loaded to keep perceived latency sub-200ms. The discussion database is fully decoupled from the external APIs, so movie threads stay up even if an API goes down.`,
      },
      {
        label: 'security',
        title: 'Silent Refresh + Middleware-Driven Ownership',
        text: `JWT auth with silent refresh token rotation so sessions stay alive without a random re-login. Every like, delete, or comment action runs through ownership validation middleware before touching the database. If you don't own it, the request dies immediately.`,
      },
    ],
  },
}

function App() {
  const [openDive, setOpenDive] = useState(null)

  const toggleDive = (name) => {
    setOpenDive((prev) => (prev === name ? null : name))
  }

  const projects = [
    {
      name: 'Hybrid Semantic Code Search',
      tag: 'RAG + retrieval',
      desc: 'Agentic retrieval pipeline over a hand-curated corpus of 25+ production JavaScript repositories (12,000+ AST-aware chunks). Hybrid BM25 + pgvector search with weighted score fusion executed inside PostgreSQL, sub-150ms P95 latency via FastAPI, and an LLM reranking layer that evaluates contextual relevance and returns results with full source provenance. Zero hallucinations by design.',
      tech: ['Python', 'FastAPI', 'React', 'Supabase', 'pgvector', 'OpenAI', 'BM25'],
      repo: 'https://github.com/57suraj/Hybrid-search-project',
      live: 'https://hybrid-search-two.vercel.app/',
    },
    {
      name: 'Connect 4',
      tag: 'real-time',
      desc: 'Event discovery platform with vector-embedded semantic search (OpenAI text-embedding-3-small) across 1,000+ events. Multi-layer auth combining Supabase Row-Level Security policies with 10+ server-side validation rules. Real-time group chat via Supabase Realtime subscriptions, with atomic join/leave operations through edge-invoked RPC functions.',
      tech: ['Next.js', 'TypeScript', 'Supabase', 'RAG', 'Tailwind', 'Real-time'],
      repo: 'https://github.com/57suraj/connect-4',
      live: 'https://connect-4-pearl.vercel.app/',
    },
    {
      name: 'CineChat',
      tag: 'full-stack',
      desc: 'Reddit meets Letterboxd. A movie discussion platform with infinitely nested comment threads powered by recursive React tree rendering and a self-referencing MongoDB schema with 3+ compound indexes. Real-time keystroke search across TMDB + OMDB APIs, lazy-loaded comment trees for sub-200ms paint, and JWT auth with silent refresh token rotation.',
      tech: ['React', 'Node.js', 'Tailwind', 'Express', 'MongoDB', 'JWT', 'TMDB API', 'Framer-Motion', 'Indexing'],
      repo: 'https://github.com/57suraj/movie-server',
      clientRepo: 'https://github.com/57suraj/movie-client',
      live: 'https://movie-client-tau.vercel.app',
    },
  ]

  const experience = [
    {
      role: 'Software Developer',
      company: 'LiveMindz Solutions, Hyderabad',
      duration: 'MAR 2026 — PRESENT',
      current: true,
      points: [
        `Designed the PostgreSQL schema for a new platform from scratch, then migrated 32,000 users off MongoDB with every foreign key, relation and integrity constraint preserved. Zero data loss, with the associated S3 assets moved in parallel.`,
        `Owned the AWS deployment end-to-end. Provisioned the ECS cluster, RDS instance, ALB, target groups and Route53 records from scratch, split development and production environments, and collapsed the release process into a single Docker-based script.`,
        `Built the platform on both sides. Next.js on the client, a Fastify monorepo on the API layer, while running the branch strategy, merge process and release flow for the codebase.`,
        `Shipped a second backend in Python and FastAPI with AI capabilities baked in, serving as the proxy layer the platform consumes. Redesigned its core tables and indexes to bring API response times down, and handle production issues across both services.`,
      ],
      tech: ['PostgreSQL', 'AWS ECS', 'RDS', 'Docker', 'Fastify', 'Next.js', 'FastAPI', 'Python', 'TypeScript'],
    },
    {
      role: 'Software Developer Intern',
      company: 'LiveMindz Solutions | SheJobs',
      duration: 'DEC 2025 — MAR 2026',
      points: [
        `Owned backend development for a production e-commerce platform. Redesigned the database schema, introduced strategic indexing and rewrote the slow MySQL queries, cutting average response times by ~60%.`,
        `Enforced ACID-compliant order flows across 8 microservices spanning payments, inventory and fulfillment, backed by Redis caching, a refactored service architecture with structured error handling, and Bull MQ for asynchronous job processing.`,
        `Integrated the META Business API and AWS SNS to power customer notifications and messaging, while shipping features and clearing bugs across the core backend services.`,
      ],
      tech: ['Node.js', 'Express', 'TypeScript', 'MySQL', 'Redis', 'Bull MQ', 'Microservices', 'AWS SNS'],
    },
  ]

  return (
    <div className="portfolio">
      {/* Hero */}
      <header className="hero fade-in">
        <p className="hero-prefix">// portfolio</p>
        <h1>Suraj Ambati<span className="cursor" /></h1>
        <p className="tagline">Full stack developer. I build things that just...work, then make them work better.</p>
      </header>

      {/* About */}
      <section className="about fade-in">
        <p className="section-header">About</p>
        <div className="section-line" />
        <p className="about-text">
          <span className="prompt">&gt;</span>
          I focus on building systems that solve actual problems rather than just chasing new tech.
          Whether it's designing resilient database schemas, optimizing slow queries, or building
          interfaces users actually understand, I care about shipping code that delivers value and
          doesn't break when it matters most.
        </p>
      </section>

      {/* Projects */}
      <section className="projects fade-in">
        <p className="section-header">Projects</p>
        <div className="section-line" />
        <div className="project-list">
          {projects.map((project) => {
            const dive = deepDives[project.name]
            const isOpen = openDive === project.name

            return (
              <div className={`project-row ${isOpen ? 'project-row--expanded' : ''}`} key={project.name}>
                <div className="project-content">
                  <div className="project-top">
                    <div className="project-title-group">
                      <span className="project-name">{project.name}</span>
                      {project.live && (
                        <a className="project-visit-link" href={project.live} target="_blank" rel="noopener noreferrer">
                          visit ↗
                        </a>
                      )}
                    </div>
                    <span className="project-tag">{project.tag}</span>
                  </div>
                  <div className="project-desc">{project.desc}</div>
                  <div className="project-links">
                    {project.repo && (
                      <a className="project-repo-link" href={project.repo} target="_blank" rel="noopener noreferrer">
                        <GithubIcon />{project.name == "CineChat" ? "backend repo" : "repo"}
                      </a>
                    )}
                    {project.clientRepo && (
                      <a className="project-repo-link" href={project.clientRepo} target="_blank" rel="noopener noreferrer">
                        <GithubIcon />frontend repo
                      </a>
                    )}
                    {dive && (
                      <button
                        className={`deep-dive-toggle ${isOpen ? 'deep-dive-toggle--active' : ''}`}
                        onClick={() => toggleDive(project.name)}
                      >
                        <ChevronIcon open={isOpen} />
                        {isOpen ? 'hide internals' : 'view internals'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Tech tags */}
                <div className="project-tech">
                  {project.tech.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>

                {/* Deep Dive Panel */}
                {dive && (
                  <div className={`deep-dive ${isOpen ? 'deep-dive--open' : ''}`}>
                    <div className="deep-dive-inner">
                      {dive.sections.map((section, idx) => (
                        <div className="deep-dive-section" key={idx}>
                          <div className="deep-dive-label">{section.label}</div>
                          <div className="deep-dive-title">{section.title}</div>
                          <p className="deep-dive-text">{section.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Experience */}
      <section className="experience fade-in">
        <p className="section-header">Experience</p>
        <div className="section-line" />
        <div className="exp-list">
          {experience.map((job) => (
            <div className="exp-card" key={job.role}>
              <div className="exp-top">
                <span className="exp-role">{job.role}</span>
                <span className="exp-duration">
                  {job.current && <span className="exp-dot" />}
                  {job.duration}
                </span>
              </div>
              <div className="exp-company">{job.company}</div>
              <ul className="exp-points">
                {job.points.map((point, idx) => (
                  <li className="exp-point" key={idx}>{point}</li>
                ))}
              </ul>
              <div className="exp-tech">
                {job.tech.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <footer className="contact fade-in">
        <p className="contact-prompt">// get in touch</p>
        <div className="contact-links">
          <a href="mailto:ambatisuraj5@gmail.com">[email]</a>
          <a href="https://www.linkedin.com/in/surajambati5/" target="_blank" rel="noopener noreferrer">[linkedin]</a>
          <a href="https://github.com/57suraj" target="_blank" rel="noopener noreferrer">[github]</a>
        </div>

      </footer>
      <Analytics />
    </div>
  )
}

export default App
