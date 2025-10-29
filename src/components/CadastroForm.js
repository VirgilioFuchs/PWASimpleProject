import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './CadastroForm.css';

function CadastroForm() {
    const [username, setUsername] = useState(''); // Alterado de 'name' para 'username'
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://127.0.0.1:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': '1BPUM#GJgf0k@VZpd8Ls!6ry)vuoXlbD'
                },
                body: JSON.stringify({username, password}),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Cadastro realizado com sucesso! Redirecionando para o login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(data.message || 'Falha no cadastro. Verifique os dados e tente novamente.');
            }
        } catch (error) {
            setError('Erro ao conectar com o servidor. Tente novamente mais tarde.');
            console.error('Error during registration:', error);
        }
    };

    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="cadastro-container">
            <form className="cadastro-form" onSubmit={handleSubmit}>
                <h2>Cadastro</h2>
                {error && <p className="form-error">{error}</p>}
                {message && <p className="form-success">{message}</p>}
                <div className="form-group">
                    <label htmlFor="username">Nome de Usuário</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Senha</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Cadastrar</button>

                <p className="login-link">
                    Já tem uma conta? <button type="button" onClick={goToLogin} className="link-button">Faça
                    login</button>
                </p>
            </form>
        </div>
    );
}

export default CadastroForm;
