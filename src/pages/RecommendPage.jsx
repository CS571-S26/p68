import { useState, useEffect, useRef } from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import GarmentCard from "../components/GarmentCard";
import TipCard from "../components/TipCard";
import FabricSummaryBar from "../components/FabricSummaryBar";
import { getRecommendations, searchByQuery } from "../fabricApi";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchStatus, setSearchStatus] = useState("idle");
  const searchInputRef = useRef(null);

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

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchStatus("loading");
    setSearchResults(null);
    try {
      const results = await searchByQuery(searchQuery.trim());
      setSearchResults(results);
      setSearchStatus("success");
    } catch (err) {
      console.error(err);
      setSearchStatus("error");
    }
  }

  const filtered = activeFilter === "All"
    ? garments
    : garments.filter((g) => g.type === activeFilter);

  return (
    <main className="recommendation-page" aria-labelledby="rec-title">
      {/* Hero */}
      <div className="rec-hero">
        <Container>
          <h1 className="rec-title" id="rec-title">
            {analysisResult
              ? <>Garments for <em>{analysisResult.fabricName}</em></>
              : "Garment Recommendations"}
          </h1>
          <p className="rec-subtitle">
            {analysisResult
              ? "Based on your fabric analysis, here are the best garments you can create."
              : "Search a fabric or garment type to get AI-powered recommendations."}
          </p>
        </Container>
      </div>

      <Container>
        {/* Search Bar */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "1.5rem",
          marginBottom: "2rem",
          boxShadow: "var(--shadow-sm)",
        }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "0.75rem" }}>
            Smart Search
          </p>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }} role="search">
            <label htmlFor="search-input" style={{ display: "none" }}>Search fabric or garment</label>
            <input
              id="search-input"
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Try "silk" or "winter jacket"…'
              style={{
                flex: 1,
                minWidth: "200px",
                padding: "0.6rem 1rem",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.9rem",
                fontFamily: "var(--font)",
                background: "var(--bg)",
                color: "var(--text)",
                outline: "none",
              }}
              aria-label="Search for a fabric or garment type"
            />
            <Button
              type="submit"
              variant="dark"
              disabled={searchStatus === "loading"}
            >
              {searchStatus === "loading" ? "Searching…" : "Search"}
            </Button>
            {searchResults && (
              <Button
                variant="outline-dark"
                onClick={() => { setSearchResults(null); setSearchStatus("idle"); setSearchQuery(""); }}
              >
                Clear
              </Button>
            )}
          </form>
          <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "0.5rem" }}>
            Search a fabric type to get garment ideas, or search a garment to find the best fabrics.
          </p>
        </div>

        {/* Search Results */}
        {searchStatus === "loading" && (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <div className="spinner-ring" role="status" aria-label="Searching…" style={{ margin: "0 auto 1rem" }} />
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Getting AI recommendations…</p>
          </div>
        )}

        {searchStatus === "error" && (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <p style={{ color: "var(--text-secondary)" }}>Search failed. Please try again.</p>
          </div>
        )}

        {searchResults && searchStatus === "success" && (
          <div style={{ marginBottom: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text)", margin: 0 }}>
                {searchResults.mode === "fabric_to_garment"
                  ? `Garments for "${searchResults.inputLabel}"`
                  : `Fabrics for "${searchResults.inputLabel}"`}
              </h2>
              <span style={{
                fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
                background: "var(--accent-warm-light)", color: "var(--accent-warm)",
                border: "1px solid var(--accent-warm-border)", padding: "0.2rem 0.6rem", borderRadius: "100px"
              }}>
                AI Result
              </span>
            </div>
            <div className="garment-grid">
              {searchResults.results.map((item, i) => (
                <GarmentCard key={item.name} garment={item} delay={i * 0.07} />
              ))}
            </div>
          </div>
        )}

        {/* Analysis-based recommendations */}
        {!analysisResult && !searchResults && (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ fontSize: "3rem", marginBottom: "1rem" }} aria-hidden="true">🧵</p>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Upload a fabric image on the Analyze page, or use the search above.
            </p>
            <Button variant="dark" onClick={() => navigate("/")}>
              Go to Analyzer
            </Button>
          </div>
        )}

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

            {status === "loading" && (
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <div className="spinner-ring" role="status" aria-label="Loading recommendations…" style={{ margin: "0 auto 1rem" }} />
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Generating recommendations…</p>
              </div>
            )}

            {status === "error" && (
              <div style={{ textAlign: "center", padding: "3rem 0" }}>
                <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>Could not load recommendations.</p>
                <Button variant="outline-dark" onClick={fetchRecommendations}>Retry</Button>
              </div>
            )}

            {status === "success" && (
              <>
                {filtered.length === 0 ? (
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>No garments in this category.</p>
                ) : (
                  <section aria-label="Garment recommendations">
                    <div className="garment-grid">
                      {filtered.map((garment, i) => (
                        <GarmentCard key={garment.name} garment={garment} delay={i * 0.07} />
                      ))}
                    </div>
                  </section>
                )}
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