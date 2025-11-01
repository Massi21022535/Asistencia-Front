import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./detalleMateria.css"; // reutiliza tus estilos generales

function NotasAlumno() {
  const { comisionId, alumnoId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [notas, setNotas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [valor, setValor] = useState("");
  const [alumnoNombre, setAlumnoNombre] = useState("");

  // 🔹 Obtener notas del alumno
  const fetchNotas = async () => {
    try {
      const res = await api.get(
        `/profesor/comisiones/${comisionId}/alumnos/${alumnoId}/notas`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotas(res.data.notas);
      setAlumnoNombre(res.data.alumno);
    } catch (err) {
      console.error("Error cargando notas:", err);
      alert("Error al obtener las notas del alumno");
    }
  };

  useEffect(() => {
    fetchNotas();
  }, [comisionId, alumnoId, token]);

  // 🔹 Agregar nueva nota
  const agregarNota = async () => {
    if (!titulo.trim() || !valor.trim()) {
      alert("Por favor completa ambos campos");
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
      console.error("Error agregando nota:", err);
      alert("Error al guardar la nota");
    }
  };

  // 🔹 Eliminar una nota
  const eliminarNota = async (notaId) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta nota?")) return;
    try {
      await api.delete(
        `/profesor/comisiones/${comisionId}/alumnos/${alumnoId}/notas/${notaId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotas();
    } catch (err) {
      console.error("Error eliminando nota:", err);
      alert("Error al eliminar la nota");
    }
  };

  return (
    <div className="detalle-materia-container">
      <button className="volver-btn" onClick={() => navigate(-1)}>
        Volver
      </button>

      <h2>Notas del alumno</h2>
      <h3>{alumnoNombre}</h3>

      <div className="nota-form">
        <input
          type="text"
          placeholder="Título (Ej: Parcial 1)"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Valor (Ej: 9 o Aprobado)"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        <button onClick={agregarNota}>Agregar Nota</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Valor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {notas.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No hay notas registradas
              </td>
            </tr>
          ) : (
            notas.map((n) => (
              <tr key={n.id}>
                <td>{n.titulo}</td>
                <td>{n.valor}</td>
                <td>
                  <button
                    className="nota-btn"
                    onClick={() => eliminarNota(n.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default NotasAlumno;
