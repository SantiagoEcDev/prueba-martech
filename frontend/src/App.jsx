import "./App.css";
import { Routes, Route } from "react-router-dom";
import { SignupPage } from "./pages/SignupPage/SignupPage";
import { SigninPage } from "./pages/SigninPage/SigninPage";
import { MainLayout } from "./layout/MainLayout";
import { CoursesPage } from "./pages/CoursesPage/CoursesPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import { HomePage } from "./pages/HomePage/HomePage";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SigninPage />} />
        <Route path="login" element={<SigninPage />} />
        <Route path="register" element={<SignupPage />} />
        <Route path="/home" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        </Route> 
        
        {/* Ruta para cursos */}
      </Routes>
    </>
  );
}

export default App;
