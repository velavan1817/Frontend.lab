import { Link } from "react-router-dom";

const Sidebar = () => {
  const items = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Equipment List", to: "/equipment" },
    { label: "Book Equipment", to: "/book-equipment" },
    { label: "Booking History", to: "/booking-history" },
    { label: "Maintenance", to: "/maintenance" },
    { label: "Profile", to: "/profile" },
  ];

  return (
    <aside style={{ width: "220px", background: "#f3f4f6", padding: "1rem", minHeight: "100vh" }}>
      <h3 style={{ marginBottom: "1rem" }}>Menu</h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((item) => (
          <li key={item.to} style={{ marginBottom: "0.75rem" }}>
            <Link to={item.to} style={{ textDecoration: "none", color: "#111827" }}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
