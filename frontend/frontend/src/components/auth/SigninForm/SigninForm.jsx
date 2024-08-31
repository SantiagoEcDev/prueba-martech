import "./SigninForm.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export const SigninForm = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post("http://localhost:8081/login", values)
      .then((res) => {
        console.log(res.data); // Para depuración
        if (res.data.Status === "Success") {
          navigate("/home"); // Redirige a /home si el login es exitoso
        } else {
          alert(res.data.Error || "Error");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error en el servidor o en la solicitud");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="signin__form">
      <h1 className="signin__form--title">Sign In</h1>
      <p className="signin__form--subtitle">Access your account</p>

      <label htmlFor="email">Email</label>
      <input
        onChange={(e) => setValues({ ...values, email: e.target.value })}
        type="email"
        name="email"
        placeholder="john@example.com"
        required
      />

      <label htmlFor="password">Password</label>
      <input
        onChange={(e) => setValues({ ...values, password: e.target.value })}
        type="password"
        name="password"
        placeholder="*********"
        required
      />

      <button type="submit">Sign In</button>

      <p className="signin__form--text">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </form>
  );
};
