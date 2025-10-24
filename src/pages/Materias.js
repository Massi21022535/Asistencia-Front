import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./materias.css";

function Materias({ rol }) {
  const [materias, setMaterias] = useState([]); //inicialmente vacio, se llena cuando responde el back
  const navigate = useNavigate(); //para cambiar de ruta

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const token = localStorage.getItem("token"); //leo el token
        const url =
          rol === "profesor"
            ? "/profesor/materias"
            : "/director/materias";

        const res = await api.get(url, {
          // llamo al api y guardo los datos con setMaterias
          headers: { Authorization: `Bearer ${token}` },
        });

        setMaterias(res.data);
      } catch (err) {
        console.error("Error al obtener materias", err);
      }
    };

    fetchMaterias();
  }, [rol]);

  const handleClick = (comisionId) => {
    //cuando se presiona ver detalles, va a la ruta con esa id de comision y muestra el detalle de esa materia
    navigate(`/materias/${comisionId}`);
  };

  return (
    <div className="materias-container">
      <button className="volver-btn" onClick={() => navigate(-1)}>
        Volver
      </button>
      <h2>{rol === "profesor" ? "Tus materias" : "Materias de la carrera"}</h2>
      <ul>
        {materias.map((m) => (
          <li key={m.comision_id}>
            {m.materia} - Comisión {m.comision}
            <button onClick={() => handleClick(m.comision_id)}>
              Ver detalles
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Materias;
