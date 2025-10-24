import React, { useState } from "react";
import api from "../services/api";
import "./login.css";
import logo from "../assets/logo undav.webp";

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => { //maneja el envio del formulario
    e.preventDefault(); //esto evita que se recargue la pagina al enviar el formulario
    try {
      const res = await api.post("/usuarios/login", { //peticion al endpoint con user y pass en el body
        usuario,
        password,
      });

      localStorage.setItem("token", res.data.token); // guardo el token
      localStorage.setItem("rol", res.data.rol); // guardo el rol

      onLogin(res.data.rol); // aviso al app que se logueo
    } catch (err) {
      setError(err.response?.data?.error || "Error en el login");
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Logo UNDAV" className="logo" />
        <div className="input-box">
          <input
            type="text"
            placeholder="Usuario"
            required
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Contraseña"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Acceder</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Login;
