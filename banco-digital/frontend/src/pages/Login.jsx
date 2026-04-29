import { useState } from "react";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/dashboard";
    } else {
      alert(data.msg);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#121212', // Match con el historial
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      
      <form onSubmit={handleLogin}  style={{
        backgroundColor: '#1e1e1e',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        width: '100%',
        maxWidth: '360px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        border: '1px solid #2e303a'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h1 style={{ color: 'white', fontSize: '28px', margin: '0' }}>Banca Digital</h1>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>Ingresa a tu cuenta profesional</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ color: '#c084fc', fontSize: '14px', fontWeight: 'bold' }}>Usuario</label>
          <input 
            type="text" 
            placeholder="Ej: admin" 
            onChange={(e) => setUsuario(e.target.value)} 
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #333',
              backgroundColor: '#252525',
              color: 'white',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ color: '#c084fc', fontSize: '14px', fontWeight: 'bold' }}>Contraseña</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            onChange={(e) => setPassword(e.target.value)} 
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #333',
              backgroundColor: '#252525',
              color: 'white',
              outline: 'none'
            }}
          />
        </div>

        <button type="submit" style={{
          marginTop: '10px',
          padding: '14px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: '#a855f7', // El mismo morado del historial
          color: 'white',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)',
          transition: 'transform 0.2s'
        }}>
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}

export default Login;