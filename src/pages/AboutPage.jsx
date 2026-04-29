import { Container } from "react-bootstrap";

const TECH_CARDS = [
  { icon: "⚛️", name: "React 19", desc: "Component-based UI with hooks and concurrent features for a smooth user experience." },
  { icon: "🔀", name: "React Router v7", desc: "Client-side routing with nested routes and URL-based navigation across all pages." },
  { icon: "🎨", name: "React Bootstrap", desc: "Accessible, responsive UI components built on Bootstrap 5 for consistent design." },
  { icon: "🤖", name: "Claude AI", desc: "Anthropic's vision model analyzes fabric images and generates personalized garment recommendations." },
  { icon: "⚡", name: "Vite 8", desc: "Lightning-fast build tooling with HMR for rapid development and optimized production builds." },
  { icon: "🚀", name: "GitHub Pages", desc: "Automated CI/CD deployment via gh-pages so every push ships to production instantly." },
];

const TEAM_MEMBERS = [
  { emoji: "🧑‍💻", name: "Team Member 1", role: "Frontend Dev" },
  { emoji: "🧑‍🎨", name: "Team Member 2", role: "UI / UX Design" },
  { emoji: "🧑‍🔬", name: "Team Member 3", role: "AI Integration" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Upload", desc: "Drag & drop or click to upload any photo of fabric or a garment." },
  { step: "02", title: "Analyze", desc: "Claude's vision AI identifies fiber composition, texture, weave, and care requirements." },
  { step: "03", title: "Recommend", desc: "Based on the analysis, we suggest the best garment types to sew or purchase with that fabric." },
];

export default function AboutPage() {
  return (
    <main className="about-page" aria-labelledby="about-title">
      <Container>
        {/* Hero */}
        <div className="about-hero">
          <h1 className="about-title" id="about-title">
            Fabric intelligence,<br />beautifully simple
          </h1>
          <p className="about-lead">
            FabricLens combines computer vision and generative AI to give anyone —
            from professional tailors to curious beginners — instant, accurate insights
            into any textile.
          </p>
        </div>

        {/* How it works */}
        <section aria-labelledby="how-heading" style={{ marginBottom: "3.5rem" }}>
          <h2 className="about-section-title" id="how-heading">How it works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.8rem",
                    fontWeight: 600,
                    color: "var(--accent-warm)",
                    lineHeight: 1,
                  }}
                  aria-hidden="true"
                >
                  {step.step}
                </span>
                <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.01em" }}>
                  {step.title}
                </p>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6, fontWeight: 300 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech stack */}
        <section aria-labelledby="tech-heading" style={{ marginBottom: "3.5rem" }}>
          <h2 className="about-section-title" id="tech-heading">Built with</h2>
          <div className="tech-grid">
            {TECH_CARDS.map((card) => (
              <div key={card.name} className="tech-card">
                <span className="tech-card-icon" aria-hidden="true">{card.icon}</span>
                <p className="tech-card-name">{card.name}</p>
                <p className="tech-card-desc">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section aria-labelledby="team-heading">
          <h2 className="about-section-title" id="team-heading">Team</h2>
          <div className="team-grid">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.name} className="team-card">
                <div className="team-avatar" aria-hidden="true">{member.emoji}</div>
                <p className="team-name">{member.name}</p>
                <p className="team-role">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Course note */}
        <div
          style={{
            marginTop: "3rem",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "1.5rem 2rem",
            display: "flex",
            gap: "1rem",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
          role="note"
        >
          <span style={{ fontSize: "1.5rem" }} aria-hidden="true">📚</span>
          <div>
            <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.25rem" }}>
              Course Project
            </p>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 300, lineHeight: 1.6 }}>
              FabricLens was built as the final project for CS571 Web Development at the University of Wisconsin–Madison, Spring 2026.
              The project demonstrates multi-page React architecture, AI API integration, and accessible, responsive design.
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
