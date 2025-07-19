import { Link } from "react-router-dom";

function Header({ user }) {
  if (!user.token) return null;

  const redirectPath =
    user.role === "doctor"
      ? "/doctor-dashboard"
      : user.role === "patient"
      ? "/patient-dashboard"
      : "/";

  return (
    <header style={{ padding: "10px", backgroundColor: "#f0f0f0" }}>
      <Link to={redirectPath} style={{ textDecoration: "none", fontWeight: "bold" }}>
        Back to main page
      </Link>
    </header>
  );
}

export default Header;
