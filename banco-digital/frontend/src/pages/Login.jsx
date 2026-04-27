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
      localStorage.setItem("token", data.token); // Guardar JWT 
      window.location.href = "/dashboard";
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); // Guarda los datos del usuario
      onLogin();
    } else {
      alert(data.msg);
    }
    
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="text" placeholder="Usuario" onChange={(e) => setUsuario(e.target.value)} />
      <input type="password" placeholder="Clave" onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Ingresar</button>
    </form>
  );
}

export default Login;