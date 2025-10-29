import React, { useState, useEffect } from 'react';
import './ChatForm.css';

const ChatForm = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    // Função para buscar os dados do usuário e verificar se é admin
    const fetchUserData = async (token) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-API-Key': '1BPUM#GJgf0k@VZpd8Ls!6ry)vuoXlbD',
                },
            });
            if (!response.ok) throw new Error('Falha ao buscar dados do usuário.');
            const userData = await response.json();
            setUser(userData);
        } catch (err) {
            setError(err.message);
        }
    };

    // Função para buscar as mensagens do mural
    const fetchMessages = async (token) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/conversa', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-API-Key': '1BPUM#GJgf0k@VZpd8Ls!6ry)vuoXlbD',
                },
            });
            if (!response.ok) throw new Error('Falha ao carregar mensagens.');
            const data = await response.json();
            setMessages(data.messages || []); // Espera um JSON com uma chave 'messages'
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            setError('Autenticação necessária.');
            return;
        }
        fetchUserData(token);
        fetchMessages(token);
    }, []);

    // Função para o admin enviar uma nova mensagem
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const token = localStorage.getItem('jwt_token');
        try {
            const response = await fetch('http://127.0.0.1:5000/conversa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-API-Key': '1BPUM#GJgf0k@VZpd8Ls!6ry)vuoXlbD',
                },
                body: JSON.stringify({ content: newMessage }),
            });

            if (response.ok) {
                setNewMessage('');
                fetchMessages(token);
            } else {
                const errData = await response.json();
                throw new Error(errData.message || 'Falha ao enviar mensagem.');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-window">
                <div className="chat-header">
                    <h3>Mural de Avisos</h3>
                </div>
                <div className="chat-body">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message-bubble ${msg.user_id === user?.id ? 'sent' : 'received'}`}>
                            <div className="message-info">
                                <span className="username">{msg.nomeUsuario}</span>
                            </div>
                            <div className="message-content">
                                <p>{msg.content}</p>
                            </div>
                            <div className="message-timestamp">
                                <span>{new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    ))}
                    {error && <p className="error-message">{error}</p>}
                </div>
                {user?.is_admin === 1 && (
                    <div className="chat-footer">
                        <form onSubmit={handleSendMessage} className="message-form">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Digite sua mensagem..."
                                className="message-input"
                            />
                            <button type="submit" className="send-button">Enviar</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatForm;
