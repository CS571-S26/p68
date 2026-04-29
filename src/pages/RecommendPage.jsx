import { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import GarmentCard from "../components/GarmentCard";
import TipCard from "../components/TipCard";
import FabricSummaryBar from "../components/FabricSummaryBar";
import { getRecommendations } from "../fabricApi";

const FILTER_OPTIONS = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Accessories"];

const DEFAULT_TIPS = [
  { icon: "✂️", title: "Pre-wash your fabric", description: "Always wash before cutting to avoid shrinkage after sewing." },
  { icon: "📐", title: "Use the right needle", description: "Match your needle type and size to the fabric weight for clean stitching." },
  { icon: "🧲", title: "Press as you sew", description: "Use an iron after each seam for professional-looking results." },
  { icon: "🪡", title: "Check grain lines", description: "Align pattern pieces with the fabric grain for proper drape and fit." },
];

export default function RecommendPage({ analysisResult }) {
  const navigate = useNavigate();
  const [garments, setGarments] = useState([]);
  const [status, setStatus] = useState("idle");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (!analysisResult) return;
    fetchRecommendations();
  }, [analysisResult]);

  async function fetchRecommendations() {
    setStatus("loading");
    setGarments([]);
    try {
      const recs = await getRecommendations(analysisResult);
      setGarments(recs);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  const filtered = activeFilter === "All"
    ? garments
    : garments.filter((g) => g.type === activeFilter);

  return (
    <main className="recommendation-page" aria-labelledby="rec-title">
      <Container>
        {/* Hero */}
        <div className="rec-hero">
          <h1 className="rec-title" id="rec-title">
            {analysisResult
              ? <>Garments for <em style={{ fontStyle: "italic", color: "var(--accent-warm)" }}>{analysisResult.fabricName}</em></>
              : "Garment Recommendations"}
          </h1>
          <p className="rec-subtitle">
            {analysisResult
              ? "Based on your fabric analysis, here are the best garments you can create."
              : "Analyze a fabric first to get personalized garment recommendations."}
          </p>
        </div>

        {/* No analysis state */}
        {!analysisResult && (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ fontSize: "3rem", marginBottom: "1rem" }} aria-hidden="true">🧵</p>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              No fabric analysis found. Upload an image on the Analyze page first.
            </p>
            <Button variant="dark" onClick={() => navigate("/")}>
              Go to Analyzer
            </Button>
          </div>
        )}

        {/* Summary bar */}
        {analysisResult && (
          <>
            <FabricSummaryBar result={analysisResult} />

            {/* Filter bar */}
            <div
              style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.5rem" }}
              role="group"
              aria-label="Filter garment types"
            >
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setActiveFilter(opt)}
                  aria-pressed={activeFilter === opt}
                  style={{
                    padding: "0.35rem 1rem",
                    borderRadius: "100px",
                    border: "1px solid var(--border)",
                    background: activeFilter === opt ? "var(--text)" : "var(--surface)",
                    color: activeFilter === opt ? "var(--bg)" : "var(--text-secondary)",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    fontFamily: "var(--font)",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Loading */}
            {status === "loading" && (
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <div className="spinner-ring" role="status" aria-label="Loading recommendations…" style={{ margin: "0 auto 1rem" }} />
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Generating recommendations…</p>
              </div>
            )}

            {/* Error */}
            {status === "error" && (
              <div style={{ textAlign: "center", padding: "3rem 0" }}>
                <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
                  Could not load recommendations. Please try again.
                </p>
                <Button variant="outline-dark" onClick={fetchRecommendations}>Retry</Button>
              </div>
            )}

            {/* Garment grid */}
            {status === "success" && (
              <>
                {filtered.length === 0 ? (
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    No garments in this category. Try a different filter.
                  </p>
                ) : (
                  <section aria-label="Garment recommendations">
                    <div className="garment-grid">
                      {filtered.map((garment, i) => (
                        <GarmentCard key={garment.name} garment={garment} delay={i * 0.07} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Tips */}
                <div className="tips-section">
                  <h2 className="tips-title">Sewing Tips for {analysisResult.fabricName}</h2>
                  <div className="tips-grid" role="list" aria-label="Sewing tips">
                    {DEFAULT_TIPS.map((tip) => (
                      <div key={tip.title} role="listitem">
                        <TipCard {...tip} />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </Container>
    </main>
  );
}
