import React from 'react';
import './App.css';
import LoginForm from "./components/LoginForm";
import WelcomePage from "./components/WelcomePage";

function App() {
  const [user, setUser] = React.useState(null);
  const handleLogin = (email, password) => {
    if (email === 'virgilio@teste.com' && password === 'anglo') {
      setUser({ email: email });
      return true;
    } else {
      return false;
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="App">
      {/* Renderização Condicional */}
      {!user ? (
        // Se NÃO há usuário, mostra a tela de Login
        <LoginForm onLogin={handleLogin} />
      ) : (
        // Se HÁ usuário, mostra a tela de Boas-vindas
        <WelcomePage user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
