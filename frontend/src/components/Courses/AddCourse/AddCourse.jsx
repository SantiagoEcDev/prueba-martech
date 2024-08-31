import React, { useState } from 'react';
import axios from 'axios';
import './AddCourse.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AddCourse = ({ showModal, handleCloseModal }) => {
  const [courseName, setCourseName] = useState('');
  const [faculty, setFaculty] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:8081/upload-courses', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        });

        if (response.data.message === 'Cursos cargados exitosamente') {
          toast.success("Cursos cargados exitosamente");
          handleCloseModal();
          setFile(null);
          // Emitir el evento personalizado
          window.dispatchEvent(new CustomEvent('coursesUpdated'));
        } else {
          toast.error(response.data.error || 'Error al cargar cursos');
        }
      } catch (error) {
        console.error("Error al cargar cursos:", error);
        toast.error(`Error al cargar cursos: ${error.response ? error.response.data.error : 'Error desconocido'}`);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:8081/add-course', {
          name: courseName,
          faculty: faculty,
          description: description
        }, { withCredentials: true });

        if (response.data.message === 'Curso creado exitosamente') {
          toast.success("Curso agregado exitosamente");
          handleCloseModal();
          setCourseName('');
          setFaculty('');
          setDescription('');
          // Emitir el evento personalizado
          window.dispatchEvent(new CustomEvent('coursesUpdated'));
        } else {
          toast.error(response.data.error || 'Error al agregar curso');
        }
      } catch (error) {
        console.error("Error al agregar curso:", error);
        toast.error(`Error al agregar curso: ${error.response ? error.response.data.error : 'Error desconocido'}`);
      }
    }
  };

  return (
    <>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>Agregar Nuevo Curso</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="coursename">Nombre del Curso</label>
              <input
                type="text"
                id="coursename"
                placeholder="Ingeniería de Software I"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
              <label htmlFor="faculty">Facultad</label>
              <input
                type="text"
                id="faculty"
                placeholder="Ingeniería"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
              />
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                placeholder="Descripción del curso"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <label htmlFor="file">Archivo Excel (opcional)</label>
              <input
                type="file"
                id="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
              />
              <button className='addButton' type="submit">Agregar curso</button>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};
