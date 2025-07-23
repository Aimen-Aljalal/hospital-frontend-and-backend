import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "doctor") {
        navigate("/doctor-dashboard");
      } else if (role === "patient") {
        navigate("/patient-dashboard");
      }
    }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>🏥 Hospital Management System</h1>
        <p style={styles.subtitle}>
          Welcome to the hospital system. Please sign up or log in to continue.
        </p>
        <div style={styles.buttons}>
          <Link to="/signup-doctor">
            <button style={{ ...styles.button, backgroundColor: "#007BFF" }}>
              Sign Up as Doctor
            </button>
          </Link>
          <Link to="/signup-patient">
            <button style={{ ...styles.button, backgroundColor: "#28A745" }}>
              Sign Up as Patient
            </button>
          </Link>
          <Link to="/login">
            <button style={{ ...styles.button, backgroundColor: "#6C757D" }}>
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f0f2f5",
  },
  box: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "100%",
    maxWidth: "500px",
  },
  title: {
    fontSize: "28px",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "30px",
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  button: {
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Home;
