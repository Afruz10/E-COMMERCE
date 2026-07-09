"use client";
import { useState } from "react";

export default function AdminPanel() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 🔐 Admin check karne ke liye

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage("❌ ID aur Password dono daalo bhai!");
      return;
    }
    
    setMessage("Checking...");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        setMessage("");
        setIsLoggedIn(true); // 🎉 Tumhe andar entry mil gayi!
      } else {
        setMessage(`❌ ${data.error || "Login nahi ho paya!"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Connection Error!");
    }
  };

  // 🔥 1. JAB LOGIN HO JAYE - TOH YEH DASHBOARD DIKHEGA
  if (isLoggedIn) {
    return (
      <div style={{ padding: "40px", maxWidth: "800px", margin: "auto", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
          <h2>😎 Afruz Bhai Ka Admin Control Center</h2>
          <button 
            onClick={() => setIsLoggedIn(false)} 
            style={{ padding: "8px 15px", background: "#ff4d4f", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            Logout
          </button>
        </div>

        {/* Quick Actions Panel */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "30px" }}>
          <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
            <h3>📚 Products & Courses</h3>
            <p style={{ color: "#666" }}>Yahan se aap naye 99/- wale courses direct website par live kar sakte hain.</p>
            <button style={{ padding: "10px", background: "#0070f3", color: "white", border: "none", borderRadius: "5px", width: "100%", fontWeight: "bold" }}>
              + Add New Course (Soon)
            </button>
          </div>

          <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
            <h3>📊 Live Order Tracking</h3>
            <p style={{ color: "#666" }}>Telegram ke alawa pure orders ka data direct table form me dekhne ka system.</p>
            <button style={{ padding: "10px", background: "#4caf50", color: "white", border: "none", borderRadius: "5px", width: "100%", fontWeight: "bold" }}>
              View All Orders (Soon)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 🔒 2. JAB TAK LOGIN NAHI HAI - TOH YEH BOX DIKHEGA
  return (
    <div style={{ padding: "50px", maxWidth: "400px", margin: "auto", fontFamily: "sans-serif" }}>
      <h2>🔐 Admin Login Panel</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input 
          type="text" 
          placeholder="User ID" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", color: "#000" }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", color: "#000" }}
        />
        <button type="submit" style={{ padding: "10px", background: "#0070f3", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
          Login Karo
        </button>
      </form>
      {message && <p style={{ marginTop: "15px", fontWeight: "bold", color: message.startsWith("❌") ? "red" : "blue" }}>{message}</p>}
    </div>
  );
}
