import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./detalleMateria.css";

function AsistenciaManual() {
  const { id: comisionId, claseId } = useParams();
  const [alumnos, setAlumnos] = useState([]);
  const [presentes, setPresentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const res = await api.get(
          `/profesor/comisiones/${comisionId}/alumnos`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAlumnos(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error cargando alumnos:", err);
        alert("Error cargando alumnos.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlumnos();
  }, [comisionId, token]);

  const togglePresente = (alumnoId) => {
    setPresentes((prev) =>
      prev.includes(alumnoId)
        ? prev.filter((id) => id !== alumnoId)
        : [...prev, alumnoId]
    );
  };

  const guardarAsistencia = async () => {
    try {
      await api.post(
        `/profesor/comisiones/${comisionId}/clases/${claseId}/asistencias`,
        { presentes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Asistencia guardada correctamente");
      navigate(-1);
    } catch (err) {
      console.error("Error guardando asistencias:", err);
      alert("Error guardando asistencias.");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
  <div className="detalle-materia-container">
    <button className="volver-btn" onClick={() => navigate(-1)}>
      Volver
    </button>

    <h2>Registro de Asistencia Manual</h2>

    <table className="tabla-asistencia">
      <thead>
        <tr>
          <th>Apellido</th>
          <th>Nombre</th>
          <th>Presente</th>
          <th>Ausente</th>
        </tr>
      </thead>
      <tbody>
        {alumnos.length === 0 ? (
          <tr>
            <td colSpan="4" className="no-alumnos">
              No se encontraron alumnos
            </td>
          </tr>
        ) : (
          alumnos.map((a) => (
            <tr key={a.id}>
              <td>{a.apellido}</td>
              <td>{a.nombres}</td>
              <td className="checkbox-cell">
                <input
                  type="checkbox"
                  checked={presentes.includes(a.id)}
                  onChange={() => togglePresente(a.id)}
                />
              </td>
              <td className="checkbox-cell">
                <input
                  type="checkbox"
                  checked={!presentes.includes(a.id)}
                  onChange={() => togglePresente(a.id)}
                />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>

    <div className="boton-guardar-container">
      <button onClick={guardarAsistencia}>Guardar Asistencia</button>
    </div>
  </div>
);

}

export default AsistenciaManual;
