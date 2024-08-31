import React from "react";
import { Navbar } from "../../components/Courses/Navbar/Navbar";
import { CoursesList } from "../../components/Courses/CoursesList/CoursesList";
export const CoursesPage = () => {
  return (
    <>
      <Navbar />
      <CoursesList />
    </>
  );
};
