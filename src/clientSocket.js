import { io } from "socket.io-client";

const socket = io("https://full-hospital.onrender.com");
export default socket;