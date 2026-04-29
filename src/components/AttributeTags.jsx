export default function AttributeTags({ label, tags }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="attr-section">
      <p className="composition-label">{label}</p>
      <div className="attr-tags" role="list" aria-label={label}>
        {tags.map((tag, i) => (
          <span
            key={tag}
            className="attr-tag"
            role="listitem"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
