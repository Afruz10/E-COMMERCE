"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Checking...");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.success) {
      setMessage(`🎉 ${data.message}`);
      // Iske baad tum admin panel dashboard par redirect ho sakte ho
    } else {
      setMessage(`❌ ${data.error}`);
    }
  };

  return (
    <div style={{ padding: "50px", maxWidth: "400px", margin: "auto", fontFamily: "sans-serif" }}>
      <h2>🔐 Admin Login Panel</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input 
          type="text" 
          placeholder="User ID" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: "10px", background: "#0070f3", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Login Karo
        </button>
      </form>
      {message && <p style={{ marginTop: "15px", fontWeight: "bold" }}>{message}</p>}
    </div>
  );
}
