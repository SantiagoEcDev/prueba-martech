import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProfilePage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ProfilePage = () => {
  const [profile, setProfile] = useState({ name: '', email: '', description: '' });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8081/profile', { withCredentials: true })
      .then(response => setProfile(response.data))
      .catch(() => toast.error("Error al obtener la información personal"));
  }, []);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    axios.put('http://localhost:8081/profile', profile, { withCredentials: true })
      .then(response => toast.success(response.data.Status))
      .catch(error => {
        console.error("Error al actualizar la información personal:", error);
        toast.error("Error al actualizar la información personal: " + (error.response ? error.response.data.Error : error.message));
      });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    axios.put('http://localhost:8081/change-password', { oldPassword, newPassword }, { withCredentials: true })
      .then(response => {
        toast.success(response.data.Status);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      })
      .catch(error => {
        console.error("Error al cambiar la contraseña:", error);
        toast.error("Error al cambiar la contraseña: " + (error.response ? error.response.data.Error : error.message));
      });
  };

  return (
    <div className="profile__container">
      <div className="personal__info">
        <h1>Información Personal</h1>
        <form onSubmit={handleProfileUpdate}>
          <label htmlFor="name">Nombre</label>
          <input id="name" type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />

          <label htmlFor="email">Correo Electrónico</label>
          <input id="email" type="text" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />

          <label htmlFor="description">Información Personal</label>
          <textarea id="description" value={profile.description} onChange={(e) => setProfile({ ...profile, description: e.target.value })}></textarea>
          <button type="submit">Guardar cambios</button>
        </form>
      </div>
      <div className="update__password">
        <h1>Configuración de Cuenta</h1>
        <form onSubmit={handlePasswordChange}>
          <label htmlFor="old-password">Contraseña Actual</label>
          <input id="old-password" type="password" placeholder="Ingrese la contraseña actual" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />

          <label htmlFor="new-password">Nueva Contraseña</label>
          <input id="new-password" type="password" placeholder="Ingrese una nueva contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

          <label htmlFor="confirm-password">Confirmar Contraseña</label>
          <input id="confirm-password" type="password" placeholder="Confirma tu nueva contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

          <button type="submit">Actualizar Contraseña</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};
