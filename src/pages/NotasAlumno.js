import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./detalleMateria.css";

function NotasAlumno() {
  const { comisionId, alumnoId } = useParams();
  const [notas, setNotas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [valor, setValor] = useState("");
  const [editando, setEditando] = useState(null); // almacena la nota que se está editando
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  //obtener notas del alumno
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

  //guardar nueva nota o actualizar existente
  const guardarNota = async () => {
    if (!titulo || !valor) {
      alert("Completá ambos campos");
      return;
    }

    try {
      if (editando) {
        //editar nota existente
        await api.put(
          `/profesor/comisiones/${comisionId}/alumnos/${alumnoId}/notas/${editando}`,
          { titulo, valor },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditando(null);
      } else {
        //crear nota nueva
        await api.post(
          `/profesor/comisiones/${comisionId}/alumnos/${alumnoId}/notas`,
          { titulo, valor },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setTitulo("");
      setValor("");
      fetchNotas();
    } catch (err) {
      console.error("Error guardando nota:", err);
      alert("Error guardando nota");
    }
  };

  //cargar datos para edición
  const editarNota = (nota) => {
    setTitulo(nota.titulo);
    setValor(nota.valor);
    setEditando(nota.id);
  };

  //eliminar nota
  const eliminarNota = async (notaId) => {
    if (!window.confirm("¿Estás seguro que querés eliminar esta nota?")) return;
    try {
      await api.delete(
        `/profesor/comisiones/${comisionId}/alumnos/${alumnoId}/notas/${notaId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotas();
    } catch (err) {
      console.error("Error eliminando nota:", err);
      alert("Error eliminando nota");
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
          style={{ marginRight: "10px", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="text"
          placeholder="Nota (ej: 8 o Aprobado)"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          style={{ marginRight: "10px", padding: "8px", marginBottom: "10px" }}
        />
        <button onClick={guardarNota}>
          {editando ? "Guardar Cambios" : "Agregar Nota"}
        </button>
        {editando && (
          <button
            onClick={() => {
              setEditando(null);
              setTitulo("");
              setValor("");
            }}
            style={{ marginLeft: "10px", backgroundColor: "#888", marginTop: "10px", }}
          >
            Cancelar
          </button>
        )}
      </div>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Título</th>
            <th>Valor</th>
            <th>Fecha de Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {notas.length === 0 ? (
            <tr>
              <td colSpan="4">No hay notas registradas</td>
            </tr>
          ) : (
            notas.map((n) => (
              <tr key={n.id}>
                <td>{n.titulo}</td>
                <td>{n.valor}</td>
                <td>{new Date(n.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    style={{ marginRight: "10px", padding: "8px 15px" }}
                    onClick={() => editarNota(n)}
                  >
                    Editar
                  </button>
                  <button
                    style={{ backgroundColor: "#b02a37", marginTop: "10px", padding: "8px 15px" }}
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
