import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Historial() {
  const [transacciones, setTransacciones] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:3001/historial", {
      headers: {
        "Authorization": token
      }
    })
      .then(res => res.json())
      .then(data => {
        // Validación para evitar que la página se ponga en blanco
        if (Array.isArray(data)) {
          setTransacciones(data);
        } else {
          setTransacciones([]);
        }
      })
      .catch(err => {
        console.error("Error:", err);
        setTransacciones([]);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; 
  };

  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: '#121212', 
      minHeight: '100vh', 
      color: 'white',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        maxWidth: '900px',
        margin: '0 auto 30px auto'
      }}>
        <h2 style={{ margin: 0, color: '#f3f4f6' }}>Historial de Movimientos</h2>
        <button 
          onClick={handleLogout}
          style={{ 
            backgroundColor: '#ef4444', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '8px', 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto', 
        overflow: 'hidden', 
        borderRadius: '12px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        border: '1px solid #2e303a'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', backgroundColor: '#1e1e1e' }}>
          <thead style={{ backgroundColor: '#a855f7', color: 'white' }}>
            <tr>
              <th style={{ padding: '15px' }}>Fecha</th>
              <th style={{ padding: '15px' }}>Tipo</th>
              <th style={{ padding: '15px' }}>Monto</th>
            </tr>
          </thead>
          <tbody>
            {transacciones.length > 0 ? (
              transacciones.map((t, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #2e303a' }}>
                  <td style={{ padding: '15px' }}>{new Date(t.fecha).toLocaleDateString()}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      backgroundColor: 'rgba(168, 85, 247, 0.15)',
                      color: '#c084fc',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '0.9em',
                      fontWeight: 'bold',
                      border: '1px solid rgba(168, 85, 247, 0.3)'
                    }}>
                      {t.tipo}
                    </span>
                  </td>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>
                    ${Number(t.monto).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ padding: '40px', color: '#9ca3af' }}>
                  No hay movimientos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <button 
        onClick={() => navigate("/dashboard")}
        style={{
          display: 'block',
          margin: '30px auto',
          background: 'none',
          border: '1px solid #a855f7',
          color: '#a855f7',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Volver al Panel
      </button>
    </div>
  );
}

export default Historial;