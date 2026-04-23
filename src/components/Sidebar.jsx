import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ items, title }) {
  const { user, logout } = useAuth();
  return (
    <aside className="sidebar">
      <div className="brand">
        <h2>Job Tracker</h2>
        <p>{title}</p>
      </div>

      <div className="user-box">
        <strong>{user.name}</strong>
        <span>{user.email}</span>
      </div>

      <nav className="nav-list">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button className="ghost logout-btn" onClick={logout}>Logout</button>
    </aside>
  );
}
