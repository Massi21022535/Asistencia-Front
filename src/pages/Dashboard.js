import React from "react";
import "./dashboard.css";
import logo from "../assets/logo undav.webp"

function Dashboard({ rol, onLogout }) { //creo el dashboard para los dos roles (profesor y director)
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <img
          src={logo}
          alt="Logo"
          className="dashboard-logo"
        />
        <div className="user-info">
          <button className="logout-btn" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <h1>Bienvenido al sistema de gestión de asistencia</h1>
        <div className="dashboard-actions">
          <a className="btn" href="/materias">Ver Materias</a>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
