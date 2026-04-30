import { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getShopRecommendations } from "../fabricApi";

const ALL_PRODUCTS = [
  { id: 1, name: "Premium Cotton Poplin", material: "100% Cotton", weight: "Lightweight", color: "#e8d5b7", price: "$12/yd", uses: ["Shirts", "Dresses", "Blouses"] },
  { id: 2, name: "Italian Wool Tweed", material: "90% Wool 10% Nylon", weight: "Heavyweight", color: "#6b5a4e", price: "$28/yd", uses: ["Coats", "Suits", "Jackets"] },
  { id: 3, name: "Stretch Denim", material: "98% Cotton 2% Elastane", weight: "Medium", color: "#3d5a80", price: "$15/yd", uses: ["Jeans", "Skirts", "Jackets"] },
  { id: 4, name: "Silk Charmeuse", material: "100% Silk", weight: "Lightweight", color: "#f0c8a0", price: "$45/yd", uses: ["Blouses", "Lingerie", "Scarves"] },
  { id: 5, name: "Linen Canvas", material: "100% Linen", weight: "Medium", color: "#c8b89a", price: "$18/yd", uses: ["Pants", "Blazers", "Tote Bags"] },
  { id: 6, name: "Velvet Crush", material: "80% Polyester 20% Nylon", weight: "Medium", color: "#7b4f8c", price: "$22/yd", uses: ["Dresses", "Blazers", "Cushions"] },
  { id: 7, name: "Jersey Knit", material: "95% Cotton 5% Elastane", weight: "Lightweight", color: "#d0d0d0", price: "$10/yd", uses: ["T-Shirts", "Leggings", "Dresses"] },
  { id: 8, name: "Cashmere Blend", material: "70% Cashmere 30% Wool", weight: "Medium", color: "#d4b896", price: "$65/yd", uses: ["Sweaters", "Scarves", "Cardigans"] },
  { id: 9, name: "Organza Sheer", material: "100% Polyester", weight: "Lightweight", color: "#f5e6d3", price: "$8/yd", uses: ["Evening Wear", "Overlays", "Veils"] },
  { id: 10, name: "Canvas Duck", material: "100% Cotton", weight: "Heavyweight", color: "#8b7355", price: "$9/yd", uses: ["Bags", "Workwear", "Upholstery"] },
  { id: 11, name: "Satin Duchess", material: "100% Polyester", weight: "Medium", color: "#e8d44d", price: "$16/yd", uses: ["Bridal", "Evening Wear", "Linings"] },
  { id: 12, name: "Fleece Polar", material: "100% Polyester", weight: "Heavyweight", color: "#c0c8d0", price: "$11/yd", uses: ["Jackets", "Blankets", "Sportswear"] },
];

function ProductCard({ product, matchScore, matchReason }) {
  return (
    <article
      className="garment-card"
      aria-label={product.name}
      style={{ position: "relative" }}
    >
      {matchScore && (
        <div style={{
          position: "absolute", top: "0.75rem", right: "0.75rem",
          background: "rgba(26,26,24,0.85)", color: "#e8a060",
          fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.6rem",
          borderRadius: "100px", zIndex: 1,
        }}>
          {matchScore}% match
        </div>
      )}
      <div
        className="garment-card-image"
        role="img"
        aria-label={`${product.name} fabric swatch`}
        style={{ background: product.color }}
      />
      <div className="garment-card-body">
        <p className="garment-card-type">{product.weight}</p>
        <h3 className="garment-card-name">{product.name}</h3>
        <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", fontWeight: 500 }}>
          {product.material}
        </p>
        {matchReason && (
          <p className="garment-card-desc">{matchReason}</p>
        )}
        <div className="garment-card-tags" role="list" aria-label="Best for">
          {product.uses.map((use) => (
            <span key={use} className="garment-tag" role="listitem">{use}</span>
          ))}
        </div>
        <div style={{
          marginTop: "0.75rem", display: "flex",
          alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)" }}>
            {product.price}
          </span>
          
        </div>
      </div>
    </article>
  );
}

export default function ShopPage({ analysisResult }) {
  const navigate = useNavigate();
  const [matched, setMatched] = useState([]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!analysisResult) return;
    fetchMatches();
  }, [analysisResult]);

  async function fetchMatches() {
    setStatus("loading");
    setMatched([]);
    try {
      const results = await getShopRecommendations(analysisResult);
      setMatched(results);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  const matchedIds = matched.map((m) => m.id);
  const otherProducts = ALL_PRODUCTS.filter((p) => !matchedIds.includes(p.id));

  return (
    <main aria-labelledby="shop-title">
      {/* Hero */}
      <div className="rec-hero">
        <Container>
          <h1 className="rec-title" id="shop-title">
            {analysisResult
              ? <>Shop for <em>{analysisResult.fabricName}</em></>
              : "Fabric Shop"}
          </h1>
          <p className="rec-subtitle">
            {analysisResult
              ? "We found the most similar fabrics from our collection based on your analysis."
              : "Browse our curated fabric collection. Analyze a fabric first for personalized matches."}
          </p>
        </Container>
      </div>

      <Container style={{ paddingBottom: "6rem" }}>
        {/* No analysis */}
        {!analysisResult && (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{ fontSize: "3rem", marginBottom: "1rem" }} aria-hidden="true">🛍️</p>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Analyze a fabric first to get personalized product matches.
            </p>
            <Button variant="dark" onClick={() => navigate("/")}>
              Go to Analyzer
            </Button>
          </div>
        )}

        {/* Loading */}
        {status === "loading" && (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <div className="spinner-ring" role="status" aria-label="Finding matches…" style={{ margin: "0 auto 1rem" }} />
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Finding best matches…</p>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>Could not load matches.</p>
            <Button variant="outline-dark" onClick={fetchMatches}>Retry</Button>
          </div>
        )}

        {/* Matched products */}
        {status === "success" && matched.length > 0 && (
          <section aria-label="Recommended products" style={{ marginBottom: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text)", margin: 0 }}>
                Best Matches for Your Fabric
              </h2>
              <span style={{
                fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em",
                textTransform: "uppercase", background: "var(--accent-warm-light)",
                color: "var(--accent-warm)", border: "1px solid var(--accent-warm-border)",
                padding: "0.2rem 0.6rem", borderRadius: "100px"
              }}>
                AI Matched
              </span>
            </div>
            <div className="garment-grid">
              {matched.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  matchScore={product.matchScore}
                  matchReason={product.matchReason}
                />
              ))}
            </div>
          </section>
        )}

        {/* All products */}
        {analysisResult && status === "success" && (
          <section aria-label="All products">
            <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text)", marginBottom: "1.25rem" }}>
              All Products
            </h2>
            <div className="garment-grid">
              {otherProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Show all if no analysis */}
        {!analysisResult && (
          <section aria-label="All products">
            <div className="garment-grid">
              {ALL_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}
//