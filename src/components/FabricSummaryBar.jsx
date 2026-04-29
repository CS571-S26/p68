export default function FabricSummaryBar({ result }) {
  if (!result) return null;

  const topFiber = result.composition?.[0]?.name ?? "Unknown";
  const weave = result.texture?.[0] ?? "Unknown";

  return (
    <div className="fabric-summary-bar" role="region" aria-label="Fabric summary">
      <div>
        <p className="fabric-summary-label">Fabric</p>
        <p className="fabric-summary-value">{result.fabricName}</p>
      </div>
      <div className="fabric-summary-divider" aria-hidden="true" />
      <div>
        <p className="fabric-summary-label">Primary Fiber</p>
        <p className="fabric-summary-value">{topFiber}</p>
      </div>
      <div className="fabric-summary-divider" aria-hidden="true" />
      <div>
        <p className="fabric-summary-label">Weave / Texture</p>
        <p className="fabric-summary-value">{weave}</p>
      </div>
      <div className="fabric-summary-divider" aria-hidden="true" />
      <div>
        <p className="fabric-summary-label">Confidence</p>
        <p className="fabric-summary-value">{result.confidence}%</p>
      </div>
    </div>
  );
}
