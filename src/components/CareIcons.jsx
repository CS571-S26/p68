export default function CareIcons({ careInstructions }) {
  if (!careInstructions || careInstructions.length === 0) return null;

  return (
    <div>
      <p className="composition-label" style={{ marginBottom: "0.5rem" }}>Care Instructions</p>
      <div className="care-icons" role="list" aria-label="Care instructions">
        {careInstructions.map((care) => (
          <div
            key={care.symbol}
            className="care-icon"
            role="listitem"
            title={care.label}
            aria-label={care.label}
          >
            {care.symbol}
          </div>
        ))}
      </div>
    </div>
  );
}
