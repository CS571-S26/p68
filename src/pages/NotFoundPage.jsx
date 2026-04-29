import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function NotFoundPage() {
  return (
    <main className="not-found" aria-labelledby="not-found-title">
      <p className="not-found-num" aria-hidden="true">404</p>
      <h1 id="not-found-title" style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.01em" }}>
        Page not found
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "360px" }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button variant="dark" as={Link} to="/" style={{ marginTop: "0.5rem" }}>
        Back to Home
      </Button>
    </main>
  );
}
