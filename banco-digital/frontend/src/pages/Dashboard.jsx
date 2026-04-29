import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [saldo, setSaldo] = useState(0);
  const [usuario, setUsuario] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setUsuario(userData.usuario);
    else navigate("/login");

    fetch("http://localhost:3001/saldo", {
      headers: { "Authorization": localStorage.getItem("token") }
    })
    .then(res => res.json())
    .then(data => setSaldo(data.saldo))
    .catch(err => console.error(err));
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div style={{ padding: '40px', backgroundColor: 'var(--bg)', minHeight: '100vh', color: 'var(--text-h)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ margin: 0 }}>Hola, {usuario}</h1>
        <button onClick={cerrarSesion} style={{ backgroundColor: '#ff4b2b', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
          Salir
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: 'var(--accent)', padding: '30px', borderRadius: '15px', color: 'white' }}>
          <h3>Saldo Actual</h3>
          <h2 style={{ fontSize: '3rem' }}>${Number(saldo).toFixed(2)}</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className="counter" onClick={() => navigate("/transferencia")} style={{ height: '50%', cursor: 'pointer' }}>
            💸 Realizar Transferencia
          </button>
          <button className="counter" onClick={() => navigate("/historial")} style={{ height: '50%', cursor: 'pointer' }}>
            📋 Ver Movimientos
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;