import { Container } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <Container>
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="nav-brand-icon" style={{ width: 22, height: 22, fontSize: "0.6rem" }} aria-hidden="true">FL</div>
            FabricLens
          </div>
          <p className="footer-copy">CS571 Web Development · Spring 2026</p>
        </div>
      </Container>
    </footer>
  );
}
