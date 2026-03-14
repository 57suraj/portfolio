import React from 'react';
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

function App() {
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

  const techStack = ['NestJS', 'NodeJS', 'TypeScript', 'AWS', 'MySQL', 'PostgreSQL', 'Redis', 'Prisma', 'TypeORM',]

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
          {projects.map((project) => (
            <div className="project-row" key={project.name}>
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
                </div>
              </div>
              <div className="project-tech">
                {project.tech.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="experience fade-in">
        <p className="section-header">Experience</p>
        <div className="section-line" />
        <div className="exp-card">
          <div className="exp-top">
            <span className="exp-role">Backend Developer Intern</span>
            <span className="exp-duration">3 MONTHS</span>
          </div>
          <div className="exp-company">LiveMindz | SheJobs</div>
          <p className="exp-desc">
            Owned backend services end-to-end across a production codebase.
            Redesigned critical database schemas and wrote optimized queries
            that cut response times significantly. Refactored legacy service
            layers, implemented cache invalidation strategies with Redis,
            and shipped multiple features from schema migration to API
            endpoint to deployment.
          </p>
          <div className="exp-tech">
            {techStack.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
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
