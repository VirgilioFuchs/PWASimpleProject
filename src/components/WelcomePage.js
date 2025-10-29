import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('jwt_token');
            if (!token) {
                setError('Nenhum token de autenticação encontrado. Faça o login novamente.');
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:5000/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-API-Key': '1BPUM#GJgf0k@VZpd8Ls!6ry)vuoXlbD'
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    setError('Falha ao buscar dados do usuário. Sua sessão pode ter expirado.');
                    localStorage.removeItem('jwt_token');
                }
            } catch (err) {
                setError('Erro ao conectar com o servidor. Tente novamente mais tarde.');
                console.error('Error fetching user data:', err);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        window.location.href = '/login';
    };

    const goToConversa = () => {
        navigate('/conversa');
    };

    if (error) {
        return (
            <div className="welcome-container">
                <div className="welcome-card error-card">
                    <h2>Erro</h2>
                    <p>{error}</p>
                    <button onClick={() => window.location.href = '/login'} className="logout-button">
                        Ir para Login
                    </button>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="welcome-container">
                <div className="welcome-card">
                    <p>Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="welcome-container">
            <div className="welcome-card">
                <h2>Bem-vindo, {user.nomeUsuario}!</h2>
                <p>Você está logado!</p>

                <button onClick={goToConversa} className="conversation-button">
                    Ir para conversa
                </button>

                <button onClick={handleLogout} className="logout-button">
                    Sair
                </button>
            </div>
        </div>
    );
};

export default WelcomePage;
