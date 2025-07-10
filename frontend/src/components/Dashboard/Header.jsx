import React from "react";



const Header = ({ user, onLogout }) => (
  <div className="header">
    <h1>Kanban Task Dashboard</h1>
    <div className="user-profile">
      <div className="user-avatar">{user?.name?.charAt(0) || "U"}</div>
      <span>{user?.name || "User"}</span>
      <button onClick={onLogout} className="btn btn-logout">Logout</button>
    </div>
  </div>
);

export default Header;

