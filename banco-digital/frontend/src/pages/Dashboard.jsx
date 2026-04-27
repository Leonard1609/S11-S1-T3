import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [saldo, setSaldo] = useState(0);
  const [usuario, setUsuario] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Recuperar datos del usuario guardados en el login
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUsuario(userData.usuario);
    } else {
      // Si no hay datos, redirigir al login por seguridad
      navigate("/login");
    }

    // 2. Consultar el saldo actual al backend usando el Token JWT [cite: 18, 51]
    fetch("http://localhost:3001/saldo", {
      method: "GET",
      headers: {
        "Authorization": localStorage.getItem("token"), // Enviamos el token de seguridad [cite: 41, 52]
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      if (res.status === 403) throw new Error("Token inválido");
      return res.json();
    })
    .then(data => {
      if (data && data.saldo !== undefined) {
        setSaldo(data.saldo); // Actualizamos el estado con el saldo real de la DB [cite: 44]
      }
    })
    .catch(err => console.error("Error al obtener saldo:", err));
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.welcome}>Bienvenido, {usuario}</h1>
          <p style={styles.subtitle}>Panel de Control Bancario</p>
        </div>
        <button onClick={cerrarSesion} style={styles.logoutBtn}>
          Cerrar Sesión
        </button>
      </header>

      <div style={styles.grid}>
        {/* Card de Saldo [cite: 43] */}
        <div style={styles.cardSaldo}>
          <h3>Saldo Disponible</h3>
          <p style={styles.monto}>${Number(saldo).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>

        {/* Acceso a Historial [cite: 19] */}
        <div style={styles.cardAction} onClick={() => navigate("/historial")}>
          <div style={styles.icon}>📋</div>
          <h3>Movimientos</h3>
          <p>Revisa tus últimas transacciones</p>
        </div>

        {/* Acceso a Transferencia [cite: 45, 46] */}
        <div style={styles.cardAction} onClick={() => navigate("/transferencia")}>
          <div style={styles.icon}>💸</div>
          <h3>Transferir</h3>
          <p>Envía dinero de forma segura</p>
        </div>
      </div>
    </div>
  );
}

// Estilos rápidos en JS para no depender de archivos externos
const styles = {
  container: { padding: '40px', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  welcome: { margin: 0, color: '#333' },
  subtitle: { margin: 0, color: '#777' },
  logoutBtn: { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' },
  cardSaldo: { background: 'linear-gradient(135deg, #0056b3 0%, #00aaff 100%)', color: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,86,179,0.3)' },
  monto: { fontSize: '3rem', fontWeight: 'bold', margin: '10px 0 0 0' },
  cardAction: { backgroundColor: 'white', padding: '30px', borderRadius: '15px', border: '1px solid #ddd', cursor: 'pointer', transition: 'transform 0.2s', textAlign: 'center' },
  icon: { fontSize: '2.5rem', marginBottom: '15px' }
};

export default Dashboard;