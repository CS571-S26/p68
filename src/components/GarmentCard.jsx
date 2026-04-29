export default function GarmentCard({ garment, delay = 0 }) {
  return (
    <article
      className="garment-card"
      style={{ animationDelay: `${delay}s` }}
      aria-label={garment.name}
    >
      <div
        className="garment-card-image"
        role="img"
        aria-label={`${garment.name} illustration`}
      >
        {garment.emoji}
      </div>
      <div className="garment-card-body">
        <p className="garment-card-type">{garment.type}</p>
        <h3 className="garment-card-name">{garment.name}</h3>
        <p className="garment-card-desc">{garment.description}</p>
        <div className="garment-card-tags" role="list" aria-label="Style tags">
          {garment.tags.map((tag) => (
            <span key={tag} className="garment-tag" role="listitem">{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
