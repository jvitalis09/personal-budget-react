import React from "react";
import { NavLink } from "react-router-dom";

export default function Menu() {
  return (
    <nav aria-label="Main navigation">
      <ul>
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/login">Login</NavLink></li>
      </ul>
    </nav>
  );
}
