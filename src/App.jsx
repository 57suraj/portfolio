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
        title: 'Structure-Aware Chunking with BraceTracker',
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
        text: `Auth is also enforced at the database level through Supabase Row-Level Security policies. Users can only delete their own comments or see specific event records because the database policies themselves check the authenticated user's ID. Even if someone bypassed the frontend and hit the API directly, the RLS policies would reject unauthorized operations. It's also combined with custom validations in the backend.`,
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
      desc: 'Retrieval system over 25+ curated production JavaScript repositories (12,000+ code chunks). Hybrid BM25 + pgvector search with weighted score fusion inside PostgreSQL, a sub-150ms FastAPI backend, and an LLM reranker that scores relevance but never generates code. Every result traces to its source file. Zero hallucinations by design.',
      tech: ['RAG', 'Hybrid Search', 'BM25', 'pgvector', 'LLM Reranking', 'FastAPI', 'OpenAI'],
      repo: 'https://github.com/57suraj/Hybrid-search-project',
      live: 'https://hybrid-search-two.vercel.app/',
    },
    {
      name: 'Connect 4',
      tag: 'real-time',
      desc: 'Event discovery platform with RAG over vector embeddings for query-based recommendations across 100+ events. Multi-layer auth combining Supabase Row-Level Security with 10+ server validations, atomic join/leave through transactional Postgres RPC functions, and real-time group chat on Supabase Realtime.',
      tech: ['RAG', 'Vector Embeddings', 'Row-Level Security', 'Postgres RPC', 'Supabase Realtime', 'Next.js'],
      repo: 'https://github.com/57suraj/connect-4',
      live: 'https://connect-4-pearl.vercel.app/',
    },
  ]

  const experience = [
    {
      role: 'Software Developer',
      company: 'Livemindz Solutions, Hyderabad',
      duration: 'MAR 2026 - PRESENT',
      current: true,
      points: [
        `Shipped an AI job-application agent to 150+ users: a Manifest V3 Chrome extension that runs server-issued leases, with per-platform rate limits and backoffs, and autofills forms on 50+ ATS platforms including Workday, Greenhouse and Lever.`,
        `Rolled out LLM question classification and answer verification behind shadow, on and off flags, backed by golden-set evals, corpus audits and a parity check against a baseline before release.`,
        `Cut LLM cost with layered caching and budgets: verdicts shared across users per question wording, match scores cached 14 days per resume hash, per-user daily token budgets, and a DeepSeek primary with a Claude fallback under a hard deadline inside a 60s serverless limit.`,
        `Built an OAuth 2.1 MCP server (PKCE, dynamic client registration, refresh-token rotation) exposing 27 tools to Claude, on multi-tenant Postgres with row-level security and composite foreign keys so no row can point at another user's data.`,
        `Built candidate-to-job matching on AWS Bedrock (Nova Pro, Converse API): scores each job 0-100 against skills extracted from the resume, cached in Redis, with bounded concurrency and per-call timeouts so a slow model never blocks a page.`,
        `Designed the PostgreSQL schema from scratch, then migrated 32,000 users out of MongoDB with every foreign key, relation and integrity constraint preserved, zero data loss, and a parallel S3 asset migration.`,
        `Solely owned the AWS deployment: ECS, RDS, ALB and Route53 from scratch, separate dev and prod environments, and releases automated into a single Docker-based script. Built the Fastify monorepo and the FastAPI AI proxy behind it.`,
      ],
      tech: ['LLM Evaluation', 'AWS Bedrock', 'Claude API', 'MCP', 'OAuth 2.1', 'PostgreSQL', 'Redis', 'AWS ECS', 'Docker', 'FastAPI', 'Fastify', 'Chrome MV3'],
    },
    {
      role: 'Software Developer Intern',
      company: 'Livemindz Solutions, Hyderabad',
      duration: 'DEC 2025 - MAR 2026',
      points: [
        `Owned backend development for a production e-commerce platform: redesigned the schema, introduced strategic indexing and rewrote the heaviest MySQL queries to bring response times down.`,
        `Enforced ACID-compliant order flows across payment, inventory and fulfillment services, backed by Redis caching and Bull MQ for asynchronous job processing.`,
        `Integrated the META Business API and AWS SNS to power customer notifications and messaging.`,
      ],
      tech: ['MySQL', 'ACID', 'Redis', 'Bull MQ', 'AWS SNS', 'Meta Business API'],
    },
  ]

  const stack = [
    {
      label: 'AI',
      items: ['LLM Evaluation', 'LLM Classification', 'Prompt Engineering', 'MCP', 'RAG', 'AWS Bedrock', 'Claude API', 'OpenAI API', 'Token Budgets'],
    },
    {
      label: 'Retrieval',
      items: ['Hybrid Search', 'BM25', 'pgvector', 'Vector Embeddings', 'Semantic Search', 'Recommendation Systems'],
    },
    {
      label: 'Systems',
      items: ['Event-Driven Architecture', 'Microservices', 'Kafka', 'Bull MQ', 'Concurrency', 'Rate Limiting', 'OAuth 2.1', 'Webhooks'],
    },
    {
      label: 'Data + Cloud',
      items: ['PostgreSQL', 'Row-Level Security', 'Redis', 'Query Optimization', 'Data Migration', 'AWS ECS', 'Kubernetes', 'Docker'],
    },
  ]

  return (
    <div className="portfolio">
      {/* Hero */}
      <header className="hero fade-in">
        <p className="hero-prefix">// portfolio</p>
        <h1>Suraj Ambati<span className="cursor" /></h1>
        <p className="tagline">Software engineer shipping production AI systems, from first schema to live users.</p>
      </header>

      {/* About */}
      <section className="about fade-in">
        <p className="section-header">About</p>
        <div className="section-line" />
        <p className="about-text">
          <span className="prompt">&gt;</span>
          I own AI systems end to end: the data model, the LLM pipeline, the evals, the cloud and
          the release. I've migrated 32,000 users onto a schema I designed, stood up an AWS stack
          alone, and shipped an AI agent to real users. I'm looking for forward deployed roles,
          where the job is to walk into a messy real system and make AI work inside it.
        </p>
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
                        <GithubIcon />repo
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

      {/* Stack */}
      <section className="stack fade-in">
        <p className="section-header">Stack</p>
        <div className="section-line" />
        <div className="stack-list">
          {stack.map((group) => (
            <div className="stack-row" key={group.label}>
              <span className="stack-label">{group.label}</span>
              <div className="exp-tech">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
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
