import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CoursesList.css';
import { IoMdEye } from 'react-icons/io';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editCourse, setEditCourse] = useState({ name: '', faculty: '', description: '' });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8081/courses', { withCredentials: true });
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Error fetching courses');
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const searchTerm = localStorage.getItem('searchTerm') || '';

    const filtered = courses.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [courses]);

  useEffect(() => {
    const handleSearchTermChange = () => {
      const searchTerm = localStorage.getItem('searchTerm') || '';
      const filtered = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    };

    const handleCoursesUpdated = () => {
      // Volver a cargar los cursos después de que se agregue un curso
      fetchCourses();
    };

    window.addEventListener('searchTermChanged', handleSearchTermChange);
    window.addEventListener('coursesUpdated', handleCoursesUpdated);

    return () => {
      window.removeEventListener('searchTermChanged', handleSearchTermChange);
      window.removeEventListener('coursesUpdated', handleCoursesUpdated);
    };
  }, [courses]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8081/courses', { withCredentials: true });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Error fetching courses');
    }
  };

  const handleOpenModal = (course) => {
    setSelectedCourse(course);
    setEditCourse({ name: course.name, faculty: course.faculty, description: course.description });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  const handleEditChange = (e) => {
    setEditCourse({ ...editCourse, [e.target.name]: e.target.value });
  };

  const handleUpdateCourse = async () => {
    try {
      await axios.put(`http://localhost:8081/courses/${selectedCourse.id}`, editCourse, { withCredentials: true });
      toast.success('Curso actualizado correctamente');
      setCourses(courses.map(course => (course.id === selectedCourse.id ? { ...course, ...editCourse } : course)));
      handleCloseModal();
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Error al actualizar el curso');
    }
  };

  const handleDeleteCourse = async () => {
    try {
      await axios.delete(`http://localhost:8081/courses/${selectedCourse.id}`, { withCredentials: true });
      toast.success('Curso eliminado correctamente');
      setCourses(courses.filter(course => course.id !== selectedCourse.id));
      handleCloseModal();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Error al eliminar el curso');
    }
  };

  return (
    <div className="courses__list">
      <h1 className="courses__list--title">Mis cursos</h1>
      <p className="courses__list--subtitle">Administra tus cursos de manera eficiente</p>
      <table className="courses__list--table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Departamento</th>
            <th>Descripción</th>
            <th className="actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <tr key={course.id}>
                <td>{course.name}</td>
                <td>{course.faculty}</td>
                <td>{course.description}</td>
                <td className="details" onClick={() => handleOpenModal(course)}>
                  <IoMdEye className="details-icon" />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay cursos disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
      {showModal && selectedCourse && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>Editar Curso</h2>
            <form>
              <label htmlFor="name">Nombre del Curso</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editCourse.name}
                onChange={handleEditChange}
              />
              <label htmlFor="faculty">Facultad</label>
              <input
                type="text"
                id="faculty"
                name="faculty"
                value={editCourse.faculty}
                onChange={handleEditChange}
              />
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                name="description"
                value={editCourse.description}
                onChange={handleEditChange}
              />
              <div className="buttons">
              <button type="button" onClick={handleUpdateCourse}>Actualizar</button>
              <button type="button" onClick={handleDeleteCourse}>Eliminar</button>
              </div>
              
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};
