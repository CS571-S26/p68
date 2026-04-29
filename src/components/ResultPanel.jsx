import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import CompositionBar from "./CompositionBar";
import AttributeTags from "./AttributeTags";
import CareIcons from "./CareIcons";

export default function ResultPanel({ status, result }) {
  const navigate = useNavigate();

  if (status === "idle") {
    return (
      <div className="result-panel">
        <div className="result-empty">
          <span className="result-empty-icon" aria-hidden="true">🧵</span>
          <p className="result-empty-text">Upload a fabric image to get an analysis</p>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="result-panel">
        <div className="result-loading">
          <div className="spinner-ring" role="status" aria-label="Analyzing fabric…" />
          <p className="result-loading-text">Analyzing fabric…</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="result-panel">
        <div className="result-empty">
          <span className="result-empty-icon" aria-hidden="true">⚠️</span>
          <p className="result-empty-text">
            {result?.error || "Something went wrong. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  // status === "success"
  if (!result) return null;

  return (
    <div className="result-panel" aria-live="polite" aria-label="Fabric analysis results">
      {/* Fabric name + confidence */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
        <div>
          <p className="composition-label">Fabric Identified</p>
          <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.01em" }}>
            {result.fabricName}
          </p>
        </div>
        <div
          className="status-badge success"
          aria-label={`Confidence: ${result.confidence}%`}
        >
          <span className="status-dot" aria-hidden="true" />
          {result.confidence}% confidence
        </div>
      </div>

      {/* Composition */}
      {result.composition && result.composition.length > 0 && (
        <CompositionBar composition={result.composition} />
      )}

      {/* Texture & weave */}
      <AttributeTags label="Texture & Weave" tags={result.texture} />

      {/* Properties */}
      <AttributeTags label="Properties" tags={result.properties} />

      {/* Care */}
      <CareIcons careInstructions={result.care} />

      {/* CTA */}
      <div className="result-footer">
        <Button
          variant="dark"
          onClick={() => navigate("/recommend")}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        >
          See Garment Recommendations →
        </Button>
        <p style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", textAlign: "center" }}>
          Based on your fabric analysis
        </p>
      </div>
    </div>
  );
}
