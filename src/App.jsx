import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import socket from "./clientSocket";
import Header from "./Components/Header";
import Home from "./Components/Home";
import SignUpDoctor from "./Components/signUpDoctor";
import SignUpPatient from "./Components/SignUpPatient";
import Login from "./Components/Login";
import PatientsList from "./Components/PatientsList";
import DoctorDashboard from "./Components/DoctorDashboard";
import PatientDashboard from "./Components/PatientDashboard";
import BookAppointment from "./Components/BookAppointment";
import ViewBills from "./Components/ViewBills";
import EditProfile from "./Components/EditProfile";
import ChatRoom from "./Components/ChatRoom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, setUser] = useState({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
  });

  const handleLogout = () => {
    localStorage.clear();
    setUser({ token: null, role: null });
  };

  // هذا التحديث يتفعل بعد التنقل لأي صفحة (مثلاً بعد login)
  const location = useLocation();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setUser({ token, role });
  }, [location]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;
    socket.emit("registerUserRoom", userId);

    socket.on("sendingNotification", (notify) => {
      if (notify.senderId !== userId) {
        toast.info(`new message :  ${notify.message}`, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    });

    return () => {
      socket.off("sendingNotification");
    };
  }, []);

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup-doctor" element={<SignUpDoctor />} />
        <Route path="/chat/:roomId" element={<ChatRoom />} />
        <Route path="/signup-patient" element={<SignUpPatient />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/bills" element={<ViewBills />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patients" element={<PatientsList />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      </Routes>
    </>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
