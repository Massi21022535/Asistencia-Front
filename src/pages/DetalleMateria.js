import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; //para obtener el id de la ruta (comision)
import api from "../services/api";
import { QRCodeCanvas } from "qrcode.react"; //libreria para renderizar qr
import "./detalleMateria.css";

function DetalleMateria({ rol }) {
  //depende el rol que recibe muestra una cosa u otra
  const { id } = useParams(); // id de la comisión que sale del URL
  const [alumnos, setAlumnos] = useState([]); //alumnos con porcentaje
  const [clases, setClases] = useState([]); //solo para el profesor
  const [qrUrl, setQrUrl] = useState(null); //url usada para generar el QR
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); //para volver atras
  const [mostrarModal, setMostrarModal] = useState(false);
  const [contenidoClase, setContenidoClase] = useState("");
  const [tipoClase, setTipoClase] = useState(null);

  // cargar alumnos con su porcentaje de asistencia
  useEffect(() => {
    const fetchAlumnos = async () => {
      //segun el rol (profesor ve solo sus comisiones y el director ve todo)
      try {
        const endpoint =
          rol === "profesor"
            ? `/profesor/comisiones/${id}/asistencias`
            : `/director/comisiones/${id}/asistencias`;

        const res = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlumnos(res.data); //guardo los datos
      } catch (err) {
        console.error("Error cargando alumnos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumnos();
    if (rol === "profesor") fetchClases();
  }, [id, rol, token]);

  // listo las clases creadas para esa comision y las actualizo
  const fetchClases = async () => {
    try {
      const res = await api.get(`/profesor/comisiones/${id}/clases`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClases(res.data);
    } catch (err) {
      console.error("Error cargando clases:", err);
    }
  };

  // crear nueva clase y generar QR (solo profesor)
  const crearClase = async (contenido) => {
    try {
      const res = await api.post(
        //llamo al endpoint que crea la clase en backend, guardo el token y devuelvo la url completa
        `/profesor/comisiones/${id}/clases`,
        { contenido },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQrUrl(res.data.qr_url);
      fetchClases(); // refresco listado
    } catch (err) {
      console.error("Error creando clase:", err);
      alert("Error al crear clase");
    }
  };

  const eliminarClase = async (claseId) => {
    //eliminar una clase de una comision
    if (!window.confirm("¿Queres eliminar esta clase?")) return;
    try {
      await api.delete(`/profesor/comisiones/${id}/clases/${claseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchClases();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la clase");
    }
  };

  // Crear clase y tomar asistencia manual
  const crearClaseManual = async (contenido) => {
    try {
      const res = await api.post(
        `/profesor/comisiones/${id}/clases`,
        { manual: true, contenido },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const nuevaClaseId = res.data.clase_id;
      if (!nuevaClaseId) {
        alert("Error: no se pudo crear la clase manual");
        return;
      }

      navigate(`/asistencia-manual/${id}/${nuevaClaseId}`);
    } catch (err) {
      console.error("Error creando clase manual:", err);
      alert("Error al crear clase para asistencia manual");
    }
  };

  return (
    <div className="detalle-materia-container">
      <button className="volver-btn" onClick={() => navigate(-1)}>
        Volver
      </button>
      <h2>Detalle de sus alumnos</h2>

      {/* Tabla de alumnos */}
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Apellido</th>
            <th>Nombre</th>
            <th>Asistencias</th>
            <th>Total clases</th>
            <th>Porcentaje</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((al) => (
            <tr key={al.alumno_id}>
              <td>{al.apellido}</td>
              <td>{al.nombres}</td>
              <td>{al.presentes}</td>
              <td>{al.total}</td>
              <td>{al.porcentaje}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* funcionalidad solo para profesor */}
      {rol === "profesor" && (
        <div className="profesor-section">
          <h3>Crear nueva clase</h3>

          <button
            onClick={() => {
              setTipoClase("qr");
              setMostrarModal(true);
            }}
          >
            Crear clase y mostrar código QR
          </button>

          <button
            onClick={() => {
              setTipoClase("manual");
              setMostrarModal(true);
            }}
            style={{ marginLeft: "10px" }}
          >
            Crear clase y tomar asistencia manual
          </button>

          {mostrarModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Ingresá los contenidos de la clase</h3>
                <textarea
                  rows="4"
                  value={contenidoClase}
                  onChange={(e) => setContenidoClase(e.target.value)}
                />
                <div className="modal-buttons">
                  <button
                    onClick={() => {
                      if (tipoClase === "manual") {
                        crearClaseManual(contenidoClase);
                      } else {
                        crearClase(contenidoClase);
                      }
                      setMostrarModal(false);
                      setContenidoClase("");
                    }}
                  >
                    Confirmar
                  </button>
                  <button onClick={() => setMostrarModal(false)}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {qrUrl && (
            <div className="qr-container">
              <h4>Escaneá este código QR</h4>
              <QRCodeCanvas value={qrUrl} size={200} />
            </div>
          )}

          <h3>Clases creadas</h3>
          <ul className="clases-list">
            {clases.map((c) => (
              <li key={c.id}>
                Clase - {new Date(c.fecha).toLocaleDateString()}
                <button onClick={() => eliminarClase(c.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DetalleMateria;
