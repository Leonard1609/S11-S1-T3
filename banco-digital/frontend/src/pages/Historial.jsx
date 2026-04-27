import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importante para la redirección

function Historial() {
  const [transacciones, setTransacciones] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el historial desde el backend protegido [cite: 45]
    fetch("http://localhost:3001/historial", {
      headers: {
        "Authorization": localStorage.getItem("token") // Enviamos el JWT [cite: 52]
      }
    })
      .then(res => res.json())
      .then(data => setTransacciones(data))
      .catch(err => console.error("Error:", err));
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    // 1. Limpiamos el almacenamiento
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  
    // 2. Redireccionamos forzando la recarga del navegador
    window.location.href = "/login"; 
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Historial de Movimientos</h2>
        <button 
          onClick={handleLogout}
          style={{ 
            backgroundColor: '#ff4d4d', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '5px', 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', backgroundColor: '#1e1e1e' }}>
        <thead style={{ backgroundColor: '#0056b3', color: 'white' }}>
          <tr>
            <th style={{ padding: '12px' }}>Fecha</th>
            <th style={{ padding: '12px' }}>Tipo</th>
            <th style={{ padding: '12px' }}>Monto</th>
          </tr>
        </thead>
        <tbody>
          {transacciones.length > 0 ? (
            transacciones.map((t, index) => (
              <tr key={index}>
                <td style={{ padding: '10px' }}>{new Date(t.fecha).toLocaleString()}</td>
                <td style={{ padding: '10px' }}>{t.tipo}</td>
                <td style={{ padding: '10px' }}>${t.monto}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ padding: '20px' }}>No hay movimientos registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Historial;