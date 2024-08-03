import React, { useEffect, useContext, useState } from 'react'
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';


export default function Navbar() {
    const user_id = localStorage.getItem('user_id')
    const { isAuthenticated, logout } = useContext(AuthContext);
    return(
    <header className="header_section">
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg custom_nav-container ">
          <a className="navbar-brand" href="index.html">
            <span>
              HardR
            </span>
          </a>

          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className=""> </span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav  ">
              <li className="nav-item active">
                <a className="nav-link" href="/">Home <span className="sr-only"></span></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="team.html">Team</a>
              </li>
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/projects">Projects</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="#" onClick={logout}>Logout</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/signup">Sign up</Link>
                  </li>
                </>
              )}
              
            </ul>
          </div>
        </nav>
      </div>
    </header>
    // </div>
    )
}