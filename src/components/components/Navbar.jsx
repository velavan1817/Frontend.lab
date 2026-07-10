import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ padding: "1rem 1.5rem", background: "#1f2937", color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 700 }}>
          Lab Resource Platform
        </Link>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/dashboard" style={{ color: "#fff", textDecoration: "none" }}>
            Dashboard
          </Link>
          <Link to="/equipment" style={{ color: "#fff", textDecoration: "none" }}>
            Equipment
          </Link>
          <Link to="/profile" style={{ color: "#fff", textDecoration: "none" }}>
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
