import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ViewBills() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "patient") {
      navigate("/login");
      return;
    }

    const fetchInvoices = async () => {
      try {
        const res = await fetch("https://full-hospital.onrender.com/Inv/my-invoice", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setInvoices(data.invoices);
        } else {
          setError(data.message || "Failed to fetch invoices");
        }
      } catch (err) {
        setError("Error fetching invoices");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [navigate]);

  const handleDownload = (invoiceId) => {
    const downloadUrl = `https://full-hospital.onrender.com/Inv/download/${invoiceId}`;
    window.open(downloadUrl, "_blank");
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>Your Invoices</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={styles.error}>{error}</p>
        ) : invoices.length === 0 ? (
          <p>No invoices found.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Download</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td>
                    {new Date(invoice.date).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td style={styles.td}>${invoice.amount.toFixed(2)}</td>
                  <td
                    style={{
                      ...styles.td,
                      color: invoice.status === "paid" ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {invoice.status.toUpperCase()}
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.downloadButton}
                      onClick={() => handleDownload(invoice._id)}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button
          style={styles.button}
          onClick={() => navigate("/patient-dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#f0f2f5",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "90%",
    maxWidth: "700px",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  th: {
    backgroundColor: "#f5f5f5",
    padding: "10px",
    borderBottom: "1px solid #ccc",
    fontSize: "16px",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #eee",
    fontSize: "15px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  downloadButton: {
    padding: "6px 12px",
    fontSize: "14px",
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "20px",
  },
};

export default ViewBills;
