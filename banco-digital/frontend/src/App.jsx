import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Historial from './pages/Historial';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  // Verifica si hay un token para saber si el usuario entró
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Si no está logueado, va a Login. Si lo está, va al Historial */}
          <Route 
            path="/login" 
            element={!isAuth ? <Login onLogin={() => setIsAuth(true)} /> : <Navigate to="/historial" />} 
          />

          {/* Ruta del historial protegida */}
          <Route 
            path="/historial" 
            element={isAuth ? <Historial /> : <Navigate to="/login" />} 
          />

          {/* Redirección por defecto al login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;