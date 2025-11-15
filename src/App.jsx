import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/users`)
      .then((r) => r.json())
      .then((data) => setUsuarios(data))
      .catch(() => setError("No se pudo cargar la lista de usuarios."));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setUsuarios((u) => [...u, ...data]);
        setForm({ name: "", email: "" });
      } else {
        setError(data?.error || "Error al guardar el usuario.");
      }
    } catch {
      setError("Error de conexión con la API.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui", padding: 16 }}>
      <h1>p_prueba — Gestión de usuarios</h1>
      <p>Aplicación de ejemplo conectada a API y base de datos.</p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginBottom: 24 }}>
        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <button disabled={cargando}>{cargando ? "Guardando..." : "Agregar usuario"}</button>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </form>

      <h2>Usuarios</h2>
      {usuarios.length === 0 ? (
        <p>No hay usuarios todavía.</p>
      ) : (
        <ul>
          {usuarios.map((u) => (
            <li key={u.id}>
              <strong>{u.name}</strong> — {u.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
