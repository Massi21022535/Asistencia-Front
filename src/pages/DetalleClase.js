import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./detalleMateria.css";

function DetalleClase() {
  const { id } = useParams();
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claseInfo, setClaseInfo] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAsistencias = async () => {
      try {
        const res = await api.get(`/profesor/clases/${id}/asistencias`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlumnos(res.data.alumnos || res.data);
        setClaseInfo(res.data.clase || null);
      } catch (err) {
        console.error("Error al cargar asistencias:", err);
        alert("Error al cargar los detalles de la clase");
      } finally {
        setLoading(false);
      }
    };

    fetchAsistencias();
  }, [id, token]);

  const exportarExcel = () => {
    if (alumnos.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    // Datos para exportar
    const datos = alumnos.map((a) => ({
      Apellido: a.apellido,
      Nombre: a.nombres,
      Estado: a.presente ? "Presente" : "Ausente",
    }));

    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Asistencias");

    //nombre del archivo con fecha
    const fecha = claseInfo?.fecha
      ? new Date(claseInfo.fecha).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    const nombreArchivo = `asistencias_${fecha}.xlsx`;

    //generar archivo
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, nombreArchivo);
  };

  if (loading) return <p>Cargando detalles...</p>;

  return (
    <div className="detalle-materia-container">
      <button className="volver-btn" onClick={() => navigate(-1)}>
        Volver
      </button>
      <h2>Detalles de la clase</h2>

      <button className="exportar-btn" onClick={exportarExcel}>
        Exportar a Excel
      </button>

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
