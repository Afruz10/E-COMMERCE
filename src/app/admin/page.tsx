"use client";
import { useState, useEffect } from "react";

export default function UltimateAdminHub() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Form States
  const [editId, setEditId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [instructor, setInstructor] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // 📸 Image/Thumbnail State
  const [formMsg, setFormMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Live Products Grid State
  const [productsList, setProductsList] = useState([]);
  const [fetching, setFetching] = useState(false);

  const fetchActiveProducts = async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/admin/products/get");
      const data = await res.json();
      if (data.success) setProductsList(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchActiveProducts();
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "afruz_admin" && password === "AfruzStore@2026") {
      setIsLoggedIn(true);
    } else {
      setLoginMsg("❌ System Access Blocked.");
    }
  };

  // Create OR Update Course Handler Trigger
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !instructor) {
      setFormMsg("❌ Required data bounds parameters missing.");
      return;
    }
    setFormMsg("Processing operational matrix pipeline...");
    setLoading(true);

    const endpoint = editId ? "/api/admin/products/update" : "/api/admin/products";
    const payload = editId 
      ? { id: editId, title, subtitle, description, price, instructor, imageUrl }
      : { title, subtitle, description, price, instructor, imageUrl };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setFormMsg(editId ? "🎉 Asset Entry modified successfully!" : "🎉 New Asset deployed successfully!");
        clearForm();
        fetchActiveProducts();
      } else {
        setFormMsg(`❌ Interrupted: ${data.error}`);
      }
    } catch {
      setFormMsg("❌ Connection pipeline dropped.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger Edit Mode configuration mapping
  const startEdit = (product: any) => {
    setEditId(product.id);
    setTitle(product.title || "");
    setSubtitle(product.subtitle || "");
    setDescription(product.description || "");
    setPrice(product.price || "");
    setInstructor(product.instructor || "");
    setImageUrl(product.accent && product.accent.startsWith("http") ? product.accent : "");
    setFormMsg("✏️ Editing selected row entity.");
  };

  // Trigger Dynamic Row Eraser execution logic
  const deleteProduct = async (id: number) => {
    if (!confirm("Kya aap sach me yeh course delete karna chahte hain?")) return;
    try {
      const res = await fetch("/api/admin/products/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        fetchActiveProducts();
      } else {
        alert("Delete failed: " + data.error);
      }
    } catch {
      alert("Network server error.");
    }
  };

  const clearForm = () => {
    setEditId(null);
    setTitle(""); setSubtitle(""); setDescription(""); setPrice(""); setInstructor(""); setImageUrl("");
  };

  if (isLoggedIn) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#030712", padding: "40px 20px", fontFamily: "system-ui, sans-serif", color: "#f3f4f6" }}>
        <div style={{ maxWidth: "1000px", margin: "auto" }}>
          
          {/* Main Control Hub Title Block */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(10px)", padding: "20px 30px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.08)", marginBottom: "30px" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "700", background: "linear-gradient(to right, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AFRUZ CORE CMS CONTROL</h1>
              <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#9ca3af" }}>Active Live Management Engine Node</p>
            </div>
            <button onClick={() => setIsLoggedIn(false)} style={{ padding: "8px 16px", background: "rgba(239, 68, 68, 0.2)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>Disconnect</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px" }}>
            
            {/* MUTABLE DYNAMIC INPUT ENTITY FORM */}
            <div style={{ background: "rgba(255, 255, 255, 0.02)", backdropFilter: "blur(16px)", padding: "30px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", color: editId ? "#f59e0b" : "#60a5fa" }}>
                  {editId ? "📝 Modify Active Asset Entry" : "📊 System Control: Deploy Asset Node"}
                </h3>
                {editId && <button onClick={clearForm} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", padding: "4px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>Cancel Edit</button>}
              </div>

              <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <input type="text" placeholder="Course Title Structure" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)", backgroundColor: "rgba(0,0,0,0.2)", color: "#fff" }} />
                <input type="text" placeholder="Subtitle Manifest" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)", backgroundColor: "rgba(0,0,0,0.2)", color: "#fff" }} />
                <textarea placeholder="Description Log Definition" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ padding: "12px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)", backgroundColor: "rgba(0,0,0,0.2)", color: "#fff" }} />
                
                {/* 📸 COURSE IMAGE / THUMBNAIL URL COMPONENT INPUT */}
                <input type="text" placeholder="Course Thumbnail Image URL (e.g., https://images.unsplash.com/photo-...)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid rgba(59, 130, 246, 0.3)", backgroundColor: "rgba(0,0,0,0.3)", color: "#38bdf8", outline: "none" }} />
                
                <div style={{ display: "flex", gap: "16px" }}>
                  <input type="number" placeholder="Value Metrics (INR)" value={price} onChange={(e) => setPrice(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)", backgroundColor: "rgba(0,0,0,0.2)", color: "#fff", flex: 1 }} />
                  <input type="text" placeholder="Assigned Instructor Node" value={instructor} onChange={(e) => setInstructor(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)", backgroundColor: "rgba(0,0,0,0.2)", color: "#fff", flex: 1 }} />
                </div>
                <button type="submit" disabled={loading} style={{ padding: "14px", background: editId ? "linear-gradient(135deg, #d97706, #b45309)" : "linear-gradient(135deg, #2563eb, #059669)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>
                  {loading ? "PROCESSING OPERATION ROUTINE..." : editId ? "UPDATE LIVE SYSTEM SCHEMA VALUE" : "EXECUTE SECURE DYNAMIC DATABASE SYNC"}
                </button>
              </form>
              {formMsg && <p style={{ marginTop: "15px", fontSize: "14px", color: formMsg.startsWith("❌") ? "#f87171" : "#34d399", fontWeight: "600" }}>{formMsg}</p>}
            </div>

            {/* INTERACTIVE DATA CRUD REGISTRY TABLE */}
            <div style={{ background: "rgba(255, 255, 255, 0.02)", backdropFilter: "blur(16px)", padding: "30px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", color: "#34d399" }}>📂 Dynamic Data Registry: Core Active Records</h3>
                <button onClick={fetchActiveProducts} style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "#aaa", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>
                  {fetching ? "Syncing Grid..." : "🔄 Refresh Nodes"}
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}>
                      <th style={{ padding: "12px 8px" }}>IMAGE</th>
                      <th style={{ padding: "12px 8px" }}>TITLE</th>
                      <th style={{ padding: "12px 8px" }}>VALUE</th>
                      <th style={{ padding: "12px 8px" }}>INSTRUCTOR</th>
                      <th style={{ padding: "12px 8px", textAlign: "right" }}>ACTIONS SYSTEM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsList.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: "30px 8px", textAlign: "center", color: "#6b7280" }}>No data entities mapped onto active registry matrix.</td>
                      </tr>
                    ) : (
                      productsList.map((product: any) => (
                        <tr key={product.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <td style={{ padding: "14px 8px" }}>
                            {product.accent && product.accent.startsWith("http") ? (
                              <img src={product.accent} alt="thumb" style={{ width: "50px", height: "30px", borderRadius: "4px", objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" }} />
                            ) : (
                              <span style={{ fontSize: "11px", color: "#6b7280" }}>No Img</span>
                            )}
                          </td>
                          <td style={{ padding: "14px 8px", fontWeight: "600" }}>{product.title}</td>
                          <td style={{ padding: "14px 8px", color: "#34d399", fontWeight: "600" }}>₹{product.price}</td>
                          <td style={{ padding: "14px 8px", color: "#9ca3af" }}>{product.instructor}</td>
                          <td style={{ padding: "14px 8px", textAlign: "right" }}>
                            <button onClick={() => startEdit(product)} style={{ padding: "5px 10px", background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "4px", marginRight: "8px", cursor: "pointer", fontSize: "12px" }}>✏️ Edit</button>
                            <button onClick={() => deleteProduct(product.id)} style={{ padding: "5px 10px", background: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>🗑️ Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#030712", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "system-ui, sans-serif", backgroundImage: "radial-gradient(circle at center, rgba(139, 92, 246, 0.1), transparent)" }}>
      <div style={{ background: "rgba(255, 255, 255, 0.02)", backdropFilter: "blur(20px)", padding: "40px", borderRadius: "20px", border: "1px solid rgba(255, 255, 255, 0.08)", width: "100%", maxWidth: "360px" }}>
        <h2 style={{ textAlign: "center", margin: "0 0 8px 0", color: "#fff", fontSize: "22px", fontWeight: "700" }}>CORE CMS ENTRY</h2>
        <p style={{ textAlign: "center", margin: "0 0 25px 0", color: "#6b7280", fontSize: "11px", letterSpacing: "1px" }}>AUTHORIZATION REQUIRED</p>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input type="text" placeholder="Identity Node Name" value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(0,0,0,0.3)", color: "white", outline: "none" }} />
          <input type="password" placeholder="Key Validation Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(0,0,0,0.3)", color: "white", outline: "none" }} />
          <button type="submit" style={{ padding: "12px", background: "linear-gradient(135deg, #4c1d95, #065f46)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}>AUTHENTICATE SIGNATURE</button>
        </form>
        {loginMsg && <p style={{ marginTop: "15px", textAlign: "center", fontWeight: "600", fontSize: "13px", color: "#f87171" }}>{loginMsg}</p>}
      </div>
    </div>
  );
}
