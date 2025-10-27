import React from "react";
import './WelcomePage.css'

const WelcomePage = ({ user, onLogout}) => {
    return (
        <div className="welcome-container">
            <div className="welcome-card">
                <h2>Bem vindo, {user.email}!</h2>
                <p> Você está logado!</p>
                <button onClick={onLogout} className="logout-button">
                    Sair
                </button>
            </div>
        </div>
    );
};

export default WelcomePage