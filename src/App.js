import React, { useState } from "react";
import {
  BrowserRouter as Router, //habilito las rutas
  Routes, //contenedor con rutas
  Route, //para definir cada ruta
  Navigate,
} from "react-router-dom";
import Login from "./pages/login";
import Materias from "./pages/Materias";
import DetalleMateria from "./pages/DetalleMateria";
import AsistenciaAlumno from "./pages/AsistenciaAlumno";
import Dashboard from "./pages/Dashboard";
import AsistenciaManual from "./pages/AsistenciaManual";
import DetalleClase from "./pages/DetalleClase";

function App() {
  const [rol, setRol] = useState(localStorage.getItem("rol") || null); //si hay una sesion anterior, se mantiene el rol

  return (
    <Router>
      <Routes>
        {/*ruta publica para que los alumnos marquen asistencia sin login */}
        <Route path="/asistencia" element={<AsistenciaAlumno />} />

        {!rol ? (
          // si no hay rol, mostrar login, si hay rol muestro dashboard
          <Route path="/" element={<Login onLogin={setRol} />} />
        ) : (
          <>
            <Route path="/materias" element={<Materias rol={rol} />} />
            <Route
              path="/materias/:id"
              element={<DetalleMateria rol={rol} />}
            />
            <Route path="/asistencia-manual/:id/:claseId" element={<AsistenciaManual />} />
            <Route path="/clases/:id/detalle" element={<DetalleClase />} />
            <Route
              path="/"
              element={
                <Dashboard
                  onLogout={() => {
                    localStorage.clear();
                    setRol(null);
                  }}
                />
              }
            />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
