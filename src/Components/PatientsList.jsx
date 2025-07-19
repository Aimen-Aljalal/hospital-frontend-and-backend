import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPatients = async () => {
      try {
        const response = await fetch("https://full-hospital.onrender.com/patients/allPatients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch patients");
        }

        setPatients(data.allPaitent || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPatients();
  }, [navigate]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Patients List</h2>
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.table}>
        <div style={styles.headerRow}>
          <span style={styles.cell}>Name</span>
          <span style={styles.cell}>Age</span>
          <span style={styles.cell}>Medical History</span>
        </div>
        {patients.map((patient) => (
          <div key={patient._id} style={styles.row}>
            <span style={styles.cell}>{patient.name}</span>
            <span style={styles.cell}>{patient.age}</span>
            <span style={styles.cell}>
              {patient.medicalHistory.join(", ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    background: "#f9f9f9",
    minHeight: "100vh",
  },
  heading: {
    marginBottom: "20px",
    fontSize: "24px",
  },
  error: {
    color: "red",
    marginBottom: "20px",
  },
  table: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  headerRow: {
    display: "flex",
    fontWeight: "bold",
    backgroundColor: "#ddd",
    padding: "10px",
    borderRadius: "6px",
  },
  row: {
    display: "flex",
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "6px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  cell: {
    flex: 1,
    textAlign: "left",
  },
};

export default PatientsList;
