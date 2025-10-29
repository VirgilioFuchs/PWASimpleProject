import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginForm from './components/LoginForm';
import CadastroForm from './components/CadastroForm';
import WelcomePage from './components/WelcomePage';
import ChatForm from "./components/ChatForm";


const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('jwt_token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginForm />} />

          <Route path="/cadastro" element={<CadastroForm />} />

            <Route path="/conversa" element={<ChatForm />} />

          <Route
            path="/welcome"
            element={
              <PrivateRoute>
                <WelcomePage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
