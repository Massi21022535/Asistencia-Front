import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./detalleMateria.css"; // reutilizamos los estilos

function DetalleClase() {
  const { id } = useParams(); // id de la clase
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAsistencias = async () => {
      try {
        const res = await api.get(`/profesor/clases/${id}/asistencias`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlumnos(res.data);
      } catch (err) {
        console.error("Error al cargar asistencias:", err);
        alert("Error al cargar los detalles de la clase");
      } finally {
        setLoading(false);
      }
    };

    fetchAsistencias();
  }, [id, token]);

  if (loading) return <p>Cargando detalles...</p>;

  return (
    <div className="detalle-materia-container">
      <button className="volver-btn" onClick={() => navigate(-1)}>
        Volver
      </button>
      <h2>Detalles de la clase</h2>

      <table>
        <thead>
          <tr>
            <th>Apellido</th>
            <th>Nombre</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((a) => (
            <tr key={a.id}>
              <td>{a.apellido}</td>
              <td>{a.nombres}</td>
              <td
                style={{
                  textAlign: "center",
                  color: a.presente ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {a.presente ? "Presente" : "Ausente"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DetalleClase;
