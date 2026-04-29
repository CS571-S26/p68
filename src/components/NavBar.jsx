import { NavLink } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";

export default function NavBar() {
  return (
    <Navbar expand="md" className="site-navbar" aria-label="Main navigation">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div className="nav-brand-icon" aria-hidden="true">FL</div>
            FabricLens
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" aria-label="Toggle navigation" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto" style={{ gap: "0.25rem" }}>
            <Nav.Link as={NavLink} to="/" end>
              Analyze
            </Nav.Link>
            <Nav.Link as={NavLink} to="/recommend">
              Recommend
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about">
              About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
