import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PatientDashboard() {
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState("");
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState("");
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "patient") {
      navigate("/login");
      return;
    }

    const fetchPatientInfo = async () => {
      try {
        const res = await fetch("https://full-hospital.onrender.com/patients/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setPatientName(data.name || "");
          setDoctorInfo(data.doctor);
          setMedicalHistory(data.medicalHistory || "No history available");

          localStorage.setItem("userId", data._id);
        }
      } catch (err) {
        console.log("Error fetching patient info", err);
      }
    };

    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          "https://full-hospital.onrender.com/appointments/my-appointments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok) {
          setAppointments(data.appointments);
        }
      } catch (err) {
        console.log("Error fetching appointments", err);
      }
    };

    fetchPatientInfo();
    fetchAppointments();
  }, [navigate]);

  const handleViewBills = () => {
    navigate("/bills");
  };
  const handleCancel = async (id) => {
    const token = localStorage.getItem("token");
    const confirmDelete = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `https://full-hospital.onrender.com/appointments/cancel/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setAppointments((prev) => prev.filter((a) => a._id !== id));
        alert("Appointment cancelled");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Cancel error:", err);
    }
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleBookAppointment = () => {
    navigate("/book-appointment");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <img
          src="/images/hospital-header.jpeg"
          alt="Hospital Header"
          style={styles.headerImage}
        />

        <div style={styles.dashboard}>
          <h1 style={styles.title}>Welcome, {patientName}</h1>
          <p style={styles.subtitle}>Patient Dashboard</p>

          <section style={styles.section}>
            <h3>Your Assigned Doctor</h3>
            {doctorInfo ? (
              <div style={styles.card}>
                <p>
                  <strong>Name:</strong> {doctorInfo.name}
                </p>
                <p>
                  <strong>Specialization:</strong> {doctorInfo.specialization}
                </p>
                <p>
                  <strong>Contact:</strong> {doctorInfo.contact}
                </p>
              </div>
            ) : (
              <p>No doctor assigned yet.</p>
            )}
          </section>

          <section style={styles.section}>
            <h3>Medical History</h3>
            <div style={styles.card}>
              <p>{medicalHistory}</p>
            </div>
          </section>

          <section style={styles.section}>
            <h3>Your Appointments</h3>
            {appointments.length === 0 ? (
              <p style={{ color: "#777" }}>No appointments yet.</p>
            ) : (
              <div style={styles.card}>
                {appointments.map((appt) => (
                  <div
                    key={appt._id}
                    style={{
                      marginBottom: "15px",
                      borderBottom: "1px solid #ccc",
                      paddingBottom: "10px",
                    }}
                  >
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(appt.date).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        style={{
                          color:
                            appt.status === "approved"
                              ? "green"
                              : appt.status === "rejected"
                              ? "red"
                              : "#f39c12",
                          fontWeight: "bold",
                        }}
                      >
                        {appt.status.charAt(0).toUpperCase() +
                          appt.status.slice(1)}
                      </span>
                    </p>
                    <p>
                      <strong>Doctor:</strong> {appt.doctorId?.name} (
                      {appt.doctorId?.specialization})
                    </p>
                    <div
                      style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                    >
                      <button
                        style={styles.cancelButton}
                        onClick={() => handleCancel(appt._id)}
                      >
                        Cancel
                      </button>

                      <button
                        style={{
                          ...styles.cancelButton,
                          backgroundColor: "#1976d2",
                        }}
                        onClick={() => {
                          const patientId = localStorage.getItem("userId");
                          const doctorId = appt.doctorId?._id;

                          if (!patientId || !doctorId) {
                            alert("Chat info missing");
                            return;
                          }

                          localStorage.setItem("chatPartnerId", doctorId);
                          localStorage.setItem("userModel", "Patient");

                          navigate(`/chat/${patientId}_${doctorId}`);
                        }}
                      >
                        Chat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section style={styles.section}>
            <h3>Actions</h3>
            <div style={styles.buttonGroup}>
              <button style={styles.button} onClick={handleBookAppointment}>
                Book Appointment
              </button>
              <button style={styles.button} onClick={handleViewBills}>
                View Bills
              </button>
              <button style={styles.button} onClick={handleEditProfile}>
                Edit Profile
              </button>
              <button
                style={{ ...styles.button, backgroundColor: "#d32f2f" }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundImage: "url('/images/hospital-bg.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    padding: "0",
    margin: "0",
  },
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0)",
    backdropFilter: "blur(4px)",
    minHeight: "100vh",
  },
  cancelButton: {
    marginTop: "8px",
    padding: "6px 12px",
    fontSize: "14px",
    backgroundColor: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  headerImage: {
    width: "100%",
    maxHeight: "150px",
    objectFit: "cover",
    borderBottom: "3px solid #007bff",
  },
  dashboard: {
    padding: "40px 20px",
    maxWidth: "800px",
    margin: "auto",
    background: "#ffffffee",
    borderRadius: "12px",
    marginTop: "-30px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "28px",
    color: "#222",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "25px",
  },
  section: {
    marginBottom: "25px",
  },
  card: {
    background: "#f1f3f5",
    padding: "15px 20px",
    borderRadius: "8px",
    textAlign: "left",
    fontSize: "16px",
    boxShadow: "inset 0 0 3px rgba(0, 0, 0, 0.05)",
  },
  buttonGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    justifyContent: "center",
  },
  button: {
    padding: "12px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "#fff",
    transition: "0.2s ease",
  },
};

export default PatientDashboard;

