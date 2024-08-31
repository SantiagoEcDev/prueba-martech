import "./MainLayout.css";
import { Sidebar } from "../components/Home/Sidebar/Sidebar";
import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export const MainLayout = () => {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8081/")
      .then((res) => {
        if (res.data.Status === "Success") {
          setAuth(true);
        } else {
          setAuth(false);
        }
        setLoading(false);
      })
      .catch(() => {
        setAuth(false);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Opcional: Mostrar un indicador de carga
  }

  if (!auth) {
    return <Navigate to="/login" />;
  }

  return (
    <main className="main--layout">
      <Sidebar />
      <div className="main--content">
        <Outlet />
      </div>
    </main>
  );
};
