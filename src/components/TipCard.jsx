export default function TipCard({ icon, title, description }) {
  return (
    <div className="tip-card">
      <span className="tip-icon" aria-hidden="true">{icon}</span>
      <p className="tip-title">{title}</p>
      <p className="tip-desc">{description}</p>
    </div>
  );
}
