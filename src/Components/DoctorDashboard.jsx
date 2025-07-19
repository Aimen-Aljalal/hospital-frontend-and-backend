import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState("");
  const [appointments, setAppointments] = useState([]);

  const doctorId = localStorage.getItem("userId");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const storedName = localStorage.getItem("name");

    if (!token || role !== "doctor") {
      navigate("/login");
      return;
    }

    if (storedName) {
      setDoctorName(storedName);
    }

    const fetchAppointments = async () => {
      try {
        const res = await fetch("https://full-hospital.onrender.com/appointments/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setAppointments(data.appointments || []);
        }
      } catch (err) {
        console.error("Error fetching appointments", err);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleCreateInvoice = async (patientId) => {
    const amount = prompt("Enter invoice amount:");
    if (!amount || isNaN(amount)) {
      alert("Invalid amount");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("https://full-hospital.onrender.com/Inv/createInv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientId,
          amount: Number(amount),
          status: "unpaid",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Invoice created successfully");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Invoice error", err);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `https://full-hospital.onrender.com/appointments/update-status/${appointmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        setAppointments((prev) =>
          prev.map((appt) =>
            appt._id === appointmentId ? { ...appt, status: newStatus } : appt
          )
        );
      } else {
        const data = await res.json();
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>Welcome Dr. {doctorName}</h1>
        <p style={styles.subtitle}>Your Dashboard</p>

        <div className="responsive-section">
          <div className="desktop-table">
            {appointments.length > 0 ? (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Patient</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Medical History</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt, index) => (
                    <tr
                      key={appt._id}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                      }}
                    >
                      <td style={styles.td}>
                        {appt.patientId?.name || "Unknown"}
                      </td>
                      <td style={styles.td}>
                        {new Date(appt.date).toLocaleDateString("en-GB")}
                      </td>
                      <td style={styles.td}>{appt.status}</td>
                      <td style={{ ...styles.td, ...styles.medicalHistoryCell }}>
                        {appt.patientId?.medicalHistory || "N/A"}
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          {appt.status === "pending" && (
                            <>
                              <button
                                style={styles.approveButton}
                                onClick={() =>
                                  handleStatusChange(appt._id, "approved")
                                }
                              >
                                Approve
                              </button>
                              <button
                                style={styles.rejectButton}
                                onClick={() =>
                                  handleStatusChange(appt._id, "rejected")
                                }
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            style={styles.invoiceButton}
                            onClick={() =>
                              handleCreateInvoice(appt.patientId._id)
                            }
                          >
                            Create Invoice
                          </button>
                          <button
                            style={{
                              ...styles.invoiceButton,
                              backgroundColor: "#9c27b0",
                            }}
                            onClick={() => {
                              localStorage.setItem("userId", doctorId);
                              localStorage.setItem(
                                "chatPartnerId",
                                appt.patientId._id
                              );
                              localStorage.setItem("userModel", "Doctor");
                              navigate(
                                `/chat/${appt.patientId._id}_${doctorId}`
                              );
                            }}
                          >
                            Chat
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No appointments found</p>
            )}
          </div>
        </div>

        <div style={styles.buttons}>
          <button
            style={{ ...styles.button, backgroundColor: "#d32f2f" }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#f0f2f5",
    minHeight: "100vh",
    padding: "20px 10px",
    display: "flex",
    justifyContent: "center",
  },
  box: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "1100px",
  },
  title: {
    fontSize: "24px",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "30px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "auto",
  },
  th: {
    borderBottom: "2px solid #ccc",
    padding: "14px 8px",
    textAlign: "left",
  },
  td: {
    borderBottom: "1px solid #eee",
    padding: "12px 8px",
    overflowWrap: "break-word",
    wordBreak: "break-word",
    whiteSpace: "normal",
    verticalAlign: "top",
  },
  medicalHistoryCell: {
    maxWidth: "200px",
  },
  actions: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "8px",
    alignItems: "center",
  },
  invoiceButton: {
    padding: "6px 10px",
    fontSize: "14px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  approveButton: {
    padding: "6px 10px",
    fontSize: "14px",
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  rejectButton: {
    padding: "6px 10px",
    fontSize: "14px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  buttons: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    padding: "12px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#1976d2",
    color: "#fff",
  },
};

export default DoctorDashboard;
