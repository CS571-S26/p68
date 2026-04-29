const COLORS = ["#b5612a", "#1a1a18", "#9a7a5a", "#c4a882", "#6b4e3d"];

export default function CompositionBar({ composition }) {
  return (
    <div className="composition-section">
      <p className="composition-label">Fabric Composition</p>
      <div className="composition-bar" role="img" aria-label={
        composition.map(c => `${c.name} ${c.percent}%`).join(", ")
      }>
        {composition.map((item, i) => (
          <div
            key={item.name}
            className="composition-segment"
            style={{
              width: `${item.percent}%`,
              background: COLORS[i % COLORS.length],
            }}
          />
        ))}
      </div>
      <div className="composition-items">
        {composition.map((item, i) => (
          <div className="composition-item" key={item.name}>
            <span className="composition-item-name">
              <span
                className="composition-dot"
                style={{ background: COLORS[i % COLORS.length] }}
                aria-hidden="true"
              />
              {item.name}
            </span>
            <span className="composition-pct">{item.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
