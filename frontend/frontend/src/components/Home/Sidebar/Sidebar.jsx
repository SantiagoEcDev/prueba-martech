import "./Sidebar.css";
import { VscNotebook } from "react-icons/vsc";
import { GoHome } from "react-icons/go";
import { GoListUnordered } from "react-icons/go";
import { CiUser } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import axios from "axios";
  
export const Sidebar = () => {
  const handleDelete = () => {
    axios.get("http://localhost:8081/logout")
    .then(res => {
      location.reload(true)
    }).catch(err => {
      console.log(err);
    })
  }
  return (
    <aside className="sidebar">
      <ul className="sidebar__list">
        <li className="icon"><VscNotebook/></li>
        <li className="sidebar__list--item">
          <NavLink end  to="/home" className={({ isActive }) => (isActive ? 'active' : '')}>
            <GoHome />
          </NavLink>
        </li>
        <li className="sidebar__list--item">
          <NavLink to="courses" className={({ isActive }) => (isActive ? 'active' : '')}>
            <GoListUnordered/>
          </NavLink>
        </li>
        <li className="sidebar__list--item">
          <NavLink to="profile" className={({ isActive }) => (isActive ? 'active' : '')}>
            <CiUser/>
          </NavLink>
        </li>
        <li className="sidebar__list--item">
          <NavLink to="/login" onClick={handleDelete} >
            <CiLogout/>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};
