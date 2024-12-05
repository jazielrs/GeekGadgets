'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import "../../../styles/pago.css";
import "../../../styles/campain.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as signalR from "@microsoft/signalr";

const Campain = () => {
    const URLConection = process.env.NEXT_PUBLIC_API;

    const [connection, setConnection] = useState(null);
    const [message, setMessage] = useState('');
    const [messageId, setMessageId] = useState('');
    const [cantidadMensajes, setCantidadMensajes] = useState(() => {
        const storedCantidadMensajes = localStorage.getItem('cantidadMensajes');
        return storedCantidadMensajes ? parseInt(storedCantidadMensajes) : 0;
    });
    const [mensajesDisponibles, setMensajesDisponibles] = useState([]);
    const storedData = localStorage.getItem('tienda');
    const dataObject = JSON.parse(storedData);

    useEffect(() => {
        const verificarFechaExpiracion = () => {
            const token = sessionStorage.getItem("token");
            if (!token) {
                window.location.href = "/admin";
                return;
            }
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            const expirationDate = new Date(decodedToken.exp * 1000);

            if (new Date() > expirationDate) {
                sessionStorage.removeItem("token");
                window.location.href = "/admin";
            }
        };

        verificarFechaExpiracion();
        const intervalId = setInterval(verificarFechaExpiracion, 10 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        establishConnection();
        fetchMensajesDisponibles();
    }, []);

    useEffect(() => {
        localStorage.setItem('cantidadMensajes', cantidadMensajes.toString());
    }, [cantidadMensajes]);

    const establishConnection = () => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(URLConection + "/chatHub")
            .build();

        newConnection.onclose(() => {
            setTimeout(() => establishConnection(), 1000);
        });

        newConnection.start()
            .then(() => {
                setConnection(newConnection);
            })
            .catch(err => {
                throw new Error("Error establishing connection: ", err);
            });
    };

    const fetchMensajesDisponibles = async () => {
        const token = sessionStorage.getItem("token");
        try {
            const response = await fetch(`${URLConection}/api/campannas`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                throw new Error('Error al obtener los mensajes');
            }
            const data = await response.json();
            setMensajesDisponibles(data);
        } catch (error) {
            throw new Error('Error fetching messages:', error);
        }
    };

    const enviarMensaje = async () => {
        const token = sessionStorage.getItem("token");
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const username = tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

        if (connection) {
            try {
                setMessage('');
                await connection.invoke("SendMessage", username, message);
                setCantidadMensajes(prevCantidad => prevCantidad + 1);
                const response = await fetch(URLConection + '/api/campannas', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Sender: username,
                        MessageContent: message,
                        Status: 1
                    }),
                });
                setMessage('');
                fetchMensajesDisponibles();
            } catch (error) {
                throw new Error("Error al enviar mensaje:", error);
            }
        }
    };

    const eliminarMensaje = async () => {
        try {
            const token = sessionStorage.getItem("token");
            if (!messageId) {
                return; 
            }

            const response = await fetch(URLConection + `/api/campannas?message=${messageId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
    
            if (!response.ok) {
                throw new Error('Error al eliminar el mensaje');
            }
            fetchMensajesDisponibles();
            setMessageId('');
        } catch (error) {
            throw new Error('Error al eliminar el mensaje:', error);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <div>
                    <Navbar cantidad_Productos={dataObject.cart.productos.length} cantidad_Mensajes={cantidadMensajes} />
                </div>
                <div className="message-container">
                    <div className="message-create">
                        <h1>Crear mensaje</h1>
                        <textarea
                            className="custom-textarea"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Ingrese su mensaje para enviar"
                        />
                        <button className="custom-button" onClick={enviarMensaje}>Enviar mensaje</button>
                    </div>
                    <div className="message-delete">
                        <h1>Eliminar mensaje</h1>
                        <select
                            className="custom-select"
                            value={messageId}
                            onChange={(e) => setMessageId(e.target.value)}
                        >
                            <option value="">Seleccione un mensaje</option>
                            {mensajesDisponibles.map(mensaje => (
                                <option key={mensaje.id} value={mensaje.id}>
                                    {mensaje.messageContent}
                                </option>
                            ))}
                        </select>
                        <button className="custom-button" onClick={eliminarMensaje} disabled={!messageId}>Eliminar mensaje</button>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default Campain;