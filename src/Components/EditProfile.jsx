import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    contact: "",
    gender: "male",
    medicalHistory: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("https://full-hospital.onrender.com/patients/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setFormData({
            name: data.name || "",
            age: data.age || "",
            contact: data.contact || "",
            gender: data.gender || "male",
            medicalHistory: data.medicalHistory || "",
          });
        } else {
          setMessage(data.message || "Failed to fetch profile");
        }
      } catch (err) {
        setMessage("Error loading profile");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://full-hospital.onrender.com/patients/edit-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Profile updated successfully");
        navigate("/patient-dashboard");
      } else {
        setMessage(data.message || "Update failed");
      }
    } catch (err) {
      setMessage("Error updating profile");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            style={styles.input}
            name="age"
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
          />
          <input
            style={styles.input}
            name="contact"
            type="email"
            placeholder="Contact Email"
            value={formData.contact}
            onChange={handleChange}
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
          />
          <button style={styles.button} type="submit">
            Save Changes
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

export default EditProfile;
