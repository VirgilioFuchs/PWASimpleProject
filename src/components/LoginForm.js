import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': '1BPUM#GJgf0k@VZpd8Ls!6ry)vuoXlbD'
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('jwt_token', data.token);
                navigate('/welcome');
            } else {
                setError(data.message || 'Credenciais inválidas. Por favor, tente novamente.');
            }
        } catch (err) {
            setError('Erro ao conectar com o servidor. Tente novamente mais tarde.');
            console.error('Error during login:', err);
        }
    };

    const goToCadastro = () => {
        navigate('/cadastro');
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login - App Anglo</h2>
                
                {error && <p className="login-error">{error}</p>}

                <div className="form-group">
                    <label htmlFor="username">Nome de Usuário:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setError('');
                        }}
                        placeholder="Seu nome de usuário"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Senha:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        placeholder="Sua Senha"
                        required
                    />
                </div>

                <button type="submit" className="login-button">
                    Entrar
                </button>

                <p className="register-link">
                    Não tem uma conta? <button type="button" onClick={goToCadastro} className="link-button">Cadastre-se</button>
                </p>
            </form>
        </div>
    );
};

export default LoginForm;
