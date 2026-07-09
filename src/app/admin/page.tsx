"use client";
import { useState } from "react";

export default function SuperAdminHub() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [instructor, setInstructor] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    if (username === "afruz_admin" && password === "AfruzStore@2026") {
      setIsLoggedIn(true);
      setLoginMsg("");
    } else {
      setLoginMsg("❌ Galat User ID ya Password!");
    }
  };

  const handleCreateCourse = async (e: any) => {
    e.preventDefault();
    if (!title || !price || !instructor) {
      setFormMsg("❌ Title, Price, aur Instructor mandatory hain!");
      return;
    }
    setFormMsg("Syncing with database...");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subtitle, description, price, instructor }),
      });
      const data = await res.json();
      if (data.success) {
        setFormMsg("🎉 Course Live Ho Gaya Aur Telegram Par Message Chala Gaya!");
        setTitle(""); setSubtitle(""); setDescription(""); setPrice(""); setInstructor("");
      } else {
        setFormMsg(`❌ Error: ${data.error}`);
      }
    } catch {
      setFormMsg("❌ Pipeline Sync Error!");
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div style={{ padding: "30px", maxWidth: "600px", margin: "auto", fontFamily: "sans-serif", color: "#fff", backgroundColor: "#0d1117", borderRadius: "12px", marginTop: "40px", border: "1px solid #30363d" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #30363d", paddingBottom: "15px" }}>
          <h2 style={{ margin: 0, color: "#58a6ff" }}>😎 Afruz Admin Panel</h2>
          <button onClick={() => setIsLoggedIn(false)} style={{ padding: "8px 16px", background: "#f85149", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Logout</button>
        </div>
        <form onSubmit={handleCreateCourse} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}>
          <input type="text" placeholder="Course Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #30363d", backgroundColor: "#161b22", color: "white" }} />
          <input type="text" placeholder="Subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #30363d", backgroundColor: "#161b22", color: "white" }} />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #30363d", backgroundColor: "#161b22", color: "white" }} />
          <input type="number" placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #30363d", backgroundColor: "#161b22", color: "white" }} />
          <input type="text" placeholder="Instructor Name" value={instructor} onChange={(e) => setInstructor(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #30363d", backgroundColor: "#161b22", color: "white" }} />
          <button type="submit" disabled={loading} style={{ padding: "12px", background: "#1f6feb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
            {loading ? "Publishing..." : "🚀 Live Sync Course"}
          </button>
        </form>
        {formMsg && <p style={{ marginTop: "12px", fontWeight: "bold", color: formMsg.startsWith("❌") ? "#f85149" : "#58a6ff" }}>{formMsg}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "340px", margin: "auto", fontFamily: "sans-serif", color: "#c9d1d9", backgroundColor: "#0d1117", borderRadius: "10px", border: "1px solid #30363d", marginTop: "100px" }}>
      <h2 style={{ textAlign: "center", color: "#58a6ff", marginBottom: "20px" }}>🔐 Admin Login</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input type="text" placeholder="User ID" value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #30363d", backgroundColor: "#161b22", color: "white" }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #30363d", backgroundColor: "#161b22", color: "white" }} />
        <button type="submit" style={{ padding: "11px", background: "#238636", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Login Karo</button>
      </form>
      {loginMsg && <p style={{ marginTop: "15px", textAlign: "center", fontWeight: "bold", color: "#f85149" }}>{loginMsg}</p>}
    </div>
  );
}
