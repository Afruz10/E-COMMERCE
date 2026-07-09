"use client";
import { useState } from "react";

export default function SuperAdminHub() {
  // Authentication states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // New Course submission fields states
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [instructor, setInstructor] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return setLoginMsg("❌ Credential structures can't be empty.");
    setLoginMsg("Checking authorization states...");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsLoggedIn(true);
        setLoginMsg("");
      } else {
        setLoginMsg(`❌ ${data.error || "Access Denied."}`);
      }
    } catch {
      setLoginMsg("❌ API Endpoint authorization validation error.");
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !instructor) {
      setFormMsg("❌ Title, Price, aur Instructor fills zaroori hain!");
      return;
    }
    setFormMsg("Database pipeline syncing initiated...");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subtitle,
          description,
          price: Number(price),
          compareAtPrice: Number(comparePrice) || Number(price) * 2,
          instructor,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormMsg(`🎉 Course successfully live ho chuka hai! Slug: ${data.product.slug}`);
        // Resetting the fields upon operational completion tracking
        setTitle(""); setSubtitle(""); setDescription(""); setPrice(""); setComparePrice(""); setInstructor("");
      } else {
        setFormMsg(`❌ Errors: ${data.error}`);
      }
    } catch {
      setFormMsg("❌ Critical pipeline connection sync interruption error.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div style={{ padding: "30px", maxWidth: "700px", margin: "auto", fontFamily: "system-ui, sans-serif", color: "#e6edf3", backgroundColor: "#0d1117", borderRadius: "12px", border: "1px solid #30363d", marginTop: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #30363d", paddingBottom: "15px" }}>
          <h2 style={{ color: "#58a6ff", margin: 0 }}>😎 Afruz Control Dashboard</h2>
          <button onClick={() => setIsLoggedIn(false)} style={{ padding: "8px 16px", background: "#f85149", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Logout</button>
        </div>

        {/* 📚 LIVE ADD COURSE FORM CONTAINER */}
        <div style={{ marginTop: "25px", padding: "20px", border: "1px solid #30363d", borderRadius: "8px", backgroundColor: "#161b22" }}>
          <h3 style={{ color: "#7ee787", margin: "0 0 15px 0" }}>➕ Publish New Product / Course dynamically</h3>
          
          <form onSubmit={handleCreateCourse} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input type="text" placeholder="Course Title (e.g., Python Automation Pro)" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #30363d", backgroundColor: "#0d1117", color: "white" }} />
            <input type="text" placeholder="Subtitle (e.g., Learn scripts in Hindi)" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #30363d", backgroundColor: "#0d1117", color: "white" }} />
            <textarea placeholder="Description (Course details configuration block...)" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #30363d", backgroundColor: "#0d1117", color: "white", resize: "vertical" }} />
            
            <div style={{ display: "flex", gap: "10px" }}>
              <input type="number" placeholder="Selling Price (e.g., 99)" value={price} onChange={(e) => setPrice(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #30363d", backgroundColor: "#0d1117", color: "white", flex: 1 }} />
              <input type="number" placeholder="Original Price (e.g., 499)" value={comparePrice} onChange={(e) => setComparePrice(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #30363d", backgroundColor: "#0d1117", color: "white", flex: 1 }} />
            </div>

            <input type="text" placeholder="Instructor Name (e.g., Afruz Bhai)" value={instructor} onChange={(e) => setInstructor(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #30363d", backgroundColor: "#0d1117", color: "white" }} />
            
            <button type="submit" disabled={loading} style={{ padding: "12px", background: loading ? "#234a85" : "#1f6feb", color: "white", border: "none", borderRadius: "6px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "bold", fontSize: "11pt" }}>
              {loading ? "Publishing Status Online..." : "🚀 Direct Database Sync Live"}
            </button>
          </form>

          {formMsg && <p style={{ marginTop: "12px", fontWeight: "bold", color: formMsg.startsWith("❌") ? "#f85149" : "#58a6ff", margin: "10px 0 0 0" }}>{formMsg}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "380px", margin: "auto", fontFamily: "system-ui, sans-serif", color: "#c9d1d9", backgroundColor: "#0d1117", borderRadius: "10px", border: "1px solid #30363d", marginTop: "8px" }}>
      <h2 style={{ textAlign: "center", color: "#58a6ff", marginBottom: "20px" }}>🔐 Admin Login Panel</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input type="text" placeholder="User ID" value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #30363d", backgroundColor: "#161b22", color: "white" }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #30363d", backgroundColor: "#161b22", color: "white" }} />
        <button type="submit" style={{ padding: "11px", background: "#238636", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Secure Login Verification</button>
      </form>
      {loginMsg && <p style={{ marginTop: "15px", textAlign: "center", fontWeight: "bold", color: loginMsg.startsWith("❌") ? "#f85149" : "#58a6ff" }}>{loginMsg}</p>}
    </div>
  );
}
