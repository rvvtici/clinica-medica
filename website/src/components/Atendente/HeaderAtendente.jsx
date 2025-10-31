import React from "react";
import "./HeaderAtendente.css";
import { Link } from "react-router-dom";

import { useAuth } from '../Auth/AuthContext';
import { AuthProvider } from '../Auth/AuthContext';
import ProtectedRoute from '../Auth/ProtectedRoute';

import { useNavigate } from 'react-router-dom';
import Home from '../Home/Home';
import Profile from '../Perfil/Profile';

const HeaderAtendente = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <header id="header_atendente">
            <div>
                <p>
                Clínica Médica
                </p>
            </div>

            <div>
            <nav className="nav_links">
                <p onClick={() => navigate('/teste')} className="perfil">Teste</p>
                <p onClick={() => navigate('/profile')} className="nav_link">Perfil</p>
            </nav>
            </div>
    
        </header>
    );
    };

export default HeaderAtendente;
