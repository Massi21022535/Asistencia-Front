import React, { useState } from "react"; //para manejar estado local de un componente
import { useLocation } from "react-router-dom"; //para leer token
import api from "../services/api"

function AsistenciaAlumno() {
  const [dni, setDni] = useState(""); //dni y set dni vacios
  const [mensaje, setMensaje] = useState(null); //para mostrar mensajes de errores
  const location = useLocation();

  // Obtengo el token desde la URL
  const queryParams = new URLSearchParams(location.search); //para leer parametros de la query
  const token = queryParams.get("token"); //extraigo el valor del token

  const handleSubmit = async (e) => { //esto se ejecuta al enviar formulario
    e.preventDefault();
    try {
      const res = await api.post("/asistencia/marcar", { // solicitud al endpoint usando api. el token viene del qr y el alumno ingresa dni
        token,
        nro_documento: dni,
      });

      setMensaje(res.data.message || "Asistencia registrada correctamente ");
    } catch (err) {
      setMensaje(err.response?.data?.error || "Error al registrar asistencia ");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Registro de Asistencia</h2>
      {token ? (
        <>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ingrese su DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              required
              style={{ padding: "10px", margin: "10px", width: "100%" }}
            />
            <button type="submit" style={{ padding: "10px 20px" }}>
              Confirmar Asistencia
            </button>
          </form>
          {mensaje && <p style={{ marginTop: "20px" }}>{mensaje}</p>}
        </>
      ) : (
        <p>Token inválido o faltante</p>
      )}
    </div>
  );
}

export default AsistenciaAlumno;
