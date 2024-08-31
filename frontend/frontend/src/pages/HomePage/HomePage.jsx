import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import axios from "axios";
import "./HomePage.css";

export const HomePage = () => {
  const [coursesData, setCoursesData] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8081/courses", { withCredentials: true });
        const courses = response.data;

        // Transformar los datos para obtener la cantidad de cursos por facultad
        const facultiesCount = courses.reduce((acc, course) => {
          acc[course.faculty] = (acc[course.faculty] || 0) + 1;
          return acc;
        }, {});

        // Convertir el objeto a un array para recharts
        const chartData = Object.keys(facultiesCount).map(faculty => ({
          name: faculty,
          courses: facultiesCount[faculty]
        }));

        setCoursesData(chartData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="home-page">
      <h1>Estadística de Tus Cursos</h1>

      <div className="chart-container">
        <BarChart
          width={600}
          height={300}
          data={coursesData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="courses" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
};
