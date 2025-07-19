import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../clientSocket";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ChatRoom() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  const userId = localStorage.getItem("userId");
  const chatPartnerId = localStorage.getItem("chatPartnerId");
  const userModel = localStorage.getItem("userModel");
  const token = localStorage.getItem("token");
  const clearChat = async () => {
    try {
      const res = await fetch(`https://full-hospital.onrender.com/chat/messages/${roomId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setMessages([]);
      } else {
        const data = await res.json();
        alert(data.message || "error deleting");
      }
    } catch (err) {
      console.error("Error clearing messages:", err);
      alert("error deleting");
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.emit("joinRoom", roomId);

    async function fetchMessages() {
      try {
        const res = await fetch(
          `https://full-hospital.onrender.com/chat/messages/${roomId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.messages) {
          setMessages(data.messages);
        } else {
          setError("No messages found or unauthorized");
        }
      } catch (err) {
        console.error("Failed to load messages", err);
        setError("Failed to load messages");
      }
    }

    fetchMessages();

    socket.on("chatMessage", (data) => {
      if (data.senderId !== userId) {
        setMessages((prev) => [...prev, data]);
      }
    });

    socket.on("sendingNotification", (notify) => {
      if (notify.senderId !== userId) {
        toast.info(`📨 رسالة جديدة: ${notify.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    });

    socket.on("error", ({ message }) => {
      setError(message);
    });

    return () => {
      socket.off("chatMessage");
      socket.off("sendingNotification");
      socket.off("error");
    };
  }, [roomId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const messageData = {
      roomId,
      message: input,
      senderId: userId,
      receiverId: chatPartnerId,
      senderModel: userModel,
      receiverModel: userModel === "Patient" ? "Doctor" : "Patient",
    };

    setMessages((prev) => [
      ...prev,
      {
        senderId: userId,
        message: input,
        sentAt: new Date().toISOString(),
      },
    ]);

    socket.emit("chatMessage", messageData);

    socket.emit("sendNotification", {
      receiverId: chatPartnerId,
      notify: {
        senderId: userId,
        message: input,
        time: new Date().toISOString(),
      },
    });

    setInput("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        <h2 style={styles.header}>Chat Room: {roomId}</h2>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div style={styles.messages}>
          {messages.map((m, i) => {
            const isSender = m.senderId === userId;
            return (
              <div key={i} style={isSender ? styles.sent : styles.received}>
                <strong>{isSender ? "You" : "Partner"}:</strong> {m.message}
              </div>
            );
          })}
          <div ref={chatEndRef}></div>
        </div>
        <div style={styles.inputArea}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={styles.input}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button onClick={sendMessage} style={styles.button}>
            Send
          </button>
          <button onClick={clearChat} style={styles.dangerButton}>
            delete all the messages
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f6f8",
  },
  chatBox: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    marginBottom: "15px",
    textAlign: "center",
    color: "#333",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    marginBottom: "10px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    height: "300px",
  },
  dangerButton: {
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: "#dcf8c6",
    padding: "8px",
    borderRadius: "6px",
    marginBottom: "5px",
    maxWidth: "80%",
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e5ea",
    padding: "8px",
    borderRadius: "6px",
    marginBottom: "5px",
    maxWidth: "80%",
  },
  inputArea: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default ChatRoom;
