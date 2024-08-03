
import logo from './logo.svg';
import './App.css';
import React, { useRef, useContext, createContext } from 'react';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import About from './pages/About';
import Home from './pages/Home';
import Navbar from './pages/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Projects from './pages/Projects';
import ProjectMembers from './pages/ProjectMembers';
import HardwareSets from './pages/HardwareSets';
import Transactions from './pages/Transactions';
import { AuthProvider } from './contexts/AuthContext';


const ServerContext = React.createContext()
function App() {
  const user_id = localStorage.getItem('user_id')
  const server_url = 'http://localhost:5000'
  return (
    
    <BrowserRouter>
      <AuthProvider>
        <Navbar/>
        <ServerContext.Provider value={server_url}>
          <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/about" element={<About/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/signup" element={<Signup/>}></Route>
            <Route path="/projects" element={<Projects/>}></Route>
            <Route path="/project/:id/members" element={<ProjectMembers/>}></Route>
            <Route path="/project/:id/:action_type" element={<HardwareSets/>}></Route>
            <Route path="/project/:id/:action_type" element={<HardwareSets/>}></Route>
            <Route path="/project/:id/transactions" element={<Transactions/>}></Route>
          </Routes>
        </ServerContext.Provider>
      </AuthProvider>
    </BrowserRouter>
    
  );
}

export default App;
export { ServerContext };
