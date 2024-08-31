// Navbar.jsx
import React from 'react';
import './Navbar.css';
import { IoAddOutline } from 'react-icons/io5';
import { AddCourse } from '../AddCourse/AddCourse';

export const Navbar = () => {
  const [showModal, setShowModal] = React.useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    localStorage.setItem('searchTerm', searchTerm);
    
    window.dispatchEvent(new Event('searchTermChanged'));
  };

  return (
    <>
      <header className="navbar">
        <div className="header__info--container">
          <span className="header__info--input-container">
            <input
              className="header__info--input"
              type="text"
              placeholder="Buscar curso..."
              onChange={handleSearchChange}
            />
          </span>
        </div>
        <div className="header__actions">
          <button onClick={handleOpenModal} className="header__actions--add-course">
            <IoAddOutline /> Añadir Curso
          </button>
        </div>
      </header>
      <AddCourse showModal={showModal} handleCloseModal={handleCloseModal} />
    </>
  );
};
