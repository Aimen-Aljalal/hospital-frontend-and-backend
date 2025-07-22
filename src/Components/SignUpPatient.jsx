import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUpPatient() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    contact: "",
    gender: "male",
    medicalHistory: "",
    doctorName: "",
    password: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(
          "https://full-hospital.onrender.com/doctors/allDoc"
        );
        const data = await res.json();
        if (res.ok) {
          setDoctors(data.allDoc);
        } else {
          setMessage("Failed to fetch doctors.");
        }
      } catch (err) {
        setMessage("Error fetching doctors.");
      }
    };

    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const selectedDoctor = doctors.find(
      (doc) => doc.name === formData.doctorName
    );

    if (!selectedDoctor) {
      setMessage("Doctor not found.");
      return;
    }

    const payload = {
      ...formData,
      age: Number(formData.age),
      medicalHistory: formData.medicalHistory.split(",").map((s) => s.trim()),
      doctorId: selectedDoctor._id,
    };

    try {
      const response = await fetch(
        "https://full-hospital.onrender.com/patients/addPatient",
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

      navigate("/");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Patient Sign Up</h2>
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
            name="age"
            type="number"
            placeholder="Age"
            value={formData.age}
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
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select
            style={styles.input}
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input
            style={styles.input}
            name="medicalHistory"
            type="text"
            placeholder="Medical History (comma separated)"
            value={formData.medicalHistory}
            onChange={handleChange}
            required
          />
          <select
            style={styles.input}
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc.name}>
                {doc.name} ({doc.specialization})
              </option>
            ))}
          </select>

          <button style={styles.button} type="submit">
            Register Patient
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
    backgroundColor: "#2196F3",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
  message: {
    marginTop: "15px",
    color: "#d32f2f",
  },
};

export default SignUpPatient;
