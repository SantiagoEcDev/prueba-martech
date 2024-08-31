import { useState } from "react";
import "./SignupForm.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const SignupForm = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8081/register", values)
      .then((res) => {
        if (res.data.Status === "Success") {
          toast.success("Registro exitoso");
          navigate("/");
        } else {
          toast.error("Error al registrarse");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error de servidor");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="signup__form">
      <h1 className="signup__form--title">Registrarse</h1>
      <p className="signup__form--subtitle">Crea tu cuenta para empezar</p>

      <label htmlFor="name">Nombre</label>
      <input
        onChange={(e) => setValues({ ...values, name: e.target.value })}
        type="text"
        name="name"
        placeholder="John Doe"
        required
      />

      <label htmlFor="email">Correo</label>
      <input
        onChange={(e) => setValues({ ...values, email: e.target.value })}
        type="email"
        name="email"
        placeholder="john@example.com"
        required
      />

      <label htmlFor="password">Contraseña</label>
      <input
        onChange={(e) => setValues({ ...values, password: e.target.value })}
        type="password"
        name="password"
        placeholder="*********"
        required
      />

      <button>Registrarse</button>

      <p className="signup__form--text">
        Ya tengo una cuenta <Link to="/">Iniciar sesión</Link>
      </p>

      <ToastContainer autoClose={3000} closeButton={false} />
    </form>
  );
};
