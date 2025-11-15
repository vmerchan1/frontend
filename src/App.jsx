import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// 🔐 Componente de autenticación
function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    console.log(await res.json());
  };

  const login = async () => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    // Guardamos el token en localStorage
    if (data.session?.access_token) {
      localStorage.setItem("token", data.session?.access_token);
      alert("Login correcto, token guardado");
    } else {
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <h2>Autenticación</h2>
      <input
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={register}>Registrarse</button>
      <button onClick={login}>Iniciar sesión</button>
    </div>
  );
}

// 👥 Componente principal
export default function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "viewer",
  });

  // Cargar usuarios al inicio
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsuarios(data);
    };
    fetchUsers();
  }, []);

  // Crear usuario con token
  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // usamos el token guardado
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.error) {
      alert("Error: " + data.error);
    } else {
      setUsuarios((u) => [...u, ...data]);
      setForm({ name: "", email: "", phone: "", role: "viewer" });
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>p_prueba — Gestión de usuarios</h1>

      {/* Formulario de login/registro */}
      <AuthForm />

      {/* Formulario de usuarios */}
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 24 }}>
        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Correo"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Teléfono"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        <button>Agregar usuario</button>
      </form>

      {/* Listado de usuarios */}
      <h2 style={{ marginTop: 32 }}>Usuarios</h2>
      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>
            {u.name} — {u.email} — {u.phone || "sin teléfono"} — {u.role}
          </li>
        ))}
      </ul>
    </div>
  );
}
