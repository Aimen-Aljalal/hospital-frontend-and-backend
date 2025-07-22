import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddDoctor() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    specialization: "",
    schedule: "8am - 2pm",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const payload = {
      ...formData,
      schedule: [formData.schedule],
    };

    try {
      const response = await fetch(
        "https://full-hospital.onrender.com/doctors/addDoctor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setMessage("Doctor added successfully.");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setMessage("Something went wrong, please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Doctor Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            name="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            name="contact"
            type="email"
            placeholder="Email"
            value={formData.contact}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            name="specialization"
            type="text"
            placeholder="Specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
          />
          <select
            style={styles.input}
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
          >
            <option value="8am - 2pm">8am - 2pm</option>
            <option value="4pm - 9pm">4pm - 9pm</option>
          </select>
          <input
            style={styles.input}
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button style={styles.button} type="submit">
            Register Doctor
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#f0f2f5",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
  },
  title: {
    fontSize: "22px",
    marginBottom: "25px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
  message: {
    marginTop: "15px",
    color: "#444",
  },
};

export default AddDoctor;
