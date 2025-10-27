import React, { useState } from 'react';
import './LoginForm.css';
// import logo from '../images/logo-anglo.png'

const LoginForm = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const handleSubmit = (event) => {
        event.preventDefault();

        const success = onLogin(email, password);

        if (success) {
            alert('Login bem-sucedido!');
        } else {
            setError('Credenciais inválidas. Por favor, tente novamente.');
        }
    };
    return (

        <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>

        <h2>Login - App Anglo</h2>
        
        {/* EXIBIÇÃO DO ERRO */}
        {error && <p className="login-error">{error}</p>}

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            // Limpa o erro quando o usuário começa a digitar de novo
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="seuEmail@exemplo.com"
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
              setError(''); // Limpa o erro
            }}
            placeholder="Sua Senha"
            required
          />
        </div>

        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>
    </div>
  );
}


export default LoginForm;