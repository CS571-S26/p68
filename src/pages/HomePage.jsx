import { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DropZone from "../components/DropZone";
import ResultPanel from "../components/ResultPanel";
import { analyzeFabric } from "../fabricApi";

const FEATURE_PILLS = [
  "Fabric Composition Analysis",
  "Texture & Weave Detection",
  "Care Instruction Reading",
  "Smart Garment Matching",
];

export default function HomePage({ setAnalysisResult }) {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  async function handleImage(dataUrl) {
    setStatus("loading");
    setResult(null);
    try {
      const analysis = await analyzeFabric(dataUrl);
      setResult(analysis);
      setAnalysisResult(analysis);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setResult({ error: "Could not analyze the image. Please try a clearer photo." });
      setStatus("error");
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="hero-section" aria-labelledby="hero-title">
        <Container>
          <div className="hero-eyebrow" aria-hidden="true">
            <span>✦</span>
            AI-Powered Fabric Intelligence
          </div>
          <h1 className="hero-title" id="hero-title">
            Know Your<br />
            <em>Fabric</em> Instantly
          </h1>
          <p className="hero-subtitle">
            Upload any fabric or garment photo. Our AI identifies the material,
            texture, and weave — then recommends the perfect garments to make.
          </p>
          <div className="hero-cta">
            <Button variant="dark" onClick={() => document.getElementById("analyze-section").scrollIntoView({ behavior: "smooth" })}>
              Start Analyzing
            </Button>
            <Button variant="outline-dark" onClick={() => navigate("/about")}>
              Learn More
            </Button>
          </div>

          <div className="feature-pills" role="list" aria-label="Key features">
            {FEATURE_PILLS.map((pill) => (
              <div key={pill} className="feature-pill" role="listitem">
                <span className="feature-pill-dot" aria-hidden="true" />
                {pill}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Analyze section */}
      <section id="analyze-section" className="analyze-section" aria-labelledby="analyze-heading">
        <Container>
          <div className="analyze-card">
            <div className="analyze-card-header">
              <h2 id="analyze-heading">Fabric Analyzer</h2>
              <div className="status-badge pending">
                <span className="status-dot" aria-hidden="true" />
                {status === "loading" ? "Analyzing…" : status === "success" ? "Analysis complete" : "Ready"}
              </div>
            </div>
            <div className="analyze-card-body">
              <div>
                <p className="section-label">Upload Image</p>
                <DropZone onImage={handleImage} />
              </div>
              <div>
                <p className="section-label">Analysis Results</p>
                <ResultPanel status={status} result={result} />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
