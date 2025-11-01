import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./detalleMateria.css";

function NotasAlumno() {
  const { comisionId, alumnoId } = useParams();
  const [notas, setNotas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [valor, setValor] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchNotas = async () => {
    try {
      const res = await api.get(
        `/profesor/comisiones/${comisionId}/alumnos/${alumnoId}/notas`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotas(res.data);
    } catch (err) {
      console.error("Error cargando notas:", err);
    }
  };

  useEffect(() => {
    fetchNotas();
  }, []);

  const guardarNota = async () => {
    if (!titulo || !valor) {
      alert("Completá ambos campos");
      return;
    }
    try {
      await api.post(
        `/profesor/comisiones/${comisionId}/alumnos/${alumnoId}/notas`,
        { titulo, valor },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitulo("");
      setValor("");
      fetchNotas();
    } catch (err) {
      console.error("Error guardando nota:", err);
      alert("Error guardando nota");
    }
  };

  return (
    <div className="detalle-materia-container">
      <button className="volver-btn" onClick={() => navigate(-1)}>
        Volver
      </button>
      <h2>Notas del Alumno</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Título (ej: Parcial 1)"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          style={{ marginRight: "10px", padding: "8px", marginBottom: "10px"}}
        />
        <input
          type="text"
          placeholder="Nota (ej: 8 o Aprobado)"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          style={{ marginRight: "10px", padding: "8px", marginBottom: "10px"}}
        />
        <button onClick={guardarNota}>Agregar Nota</button>
      </div>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Título</th>
            <th>Valor</th>
            <th>Fecha de Registro</th>
          </tr>
        </thead>
        <tbody>
          {notas.length === 0 ? (
            <tr>
              <td colSpan="3">No hay notas registradas</td>
            </tr>
          ) : (
            notas.map((n) => (
              <tr key={n.id}>
                <td>{n.titulo}</td>
                <td>{n.valor}</td>
                <td>{new Date(n.created_at).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default NotasAlumno;
