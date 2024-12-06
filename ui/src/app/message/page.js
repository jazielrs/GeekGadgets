'use client';
import React, { useEffect, useState, useCallback } from 'react';
import * as signalR from "@microsoft/signalr";
import Navbar from '../../components/Navbar';
import "../../styles/pago.css";
import "../../styles/message.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Message = () => {
    const URLConnection = process.env.NEXT_PUBLIC_API;
    const dataObject = JSON.parse(localStorage.getItem('tienda') || '{"cart":{"productos":[]}}');

    const [connection, setConnection] = useState(null);
    const [storedMessages, setStoredMessages] = useState([]);
    const [cantidadMensajes, setCantidadMensajes] = useState(() => 
        parseInt(localStorage.getItem('cantidadMensajes')) || 0
    );

    const fetchMessages = useCallback(async () => {
        try {
            const response = await fetch(`${URLConnection}/api/campannas`);
            if (!response.ok) {
                throw new Error('Error al obtener los mensajes');
            }
            const data = await response.json();
            const activeMessages = data.filter(message => message.status === 1);
            const lastThreeMessages = activeMessages.slice(-3);
            setStoredMessages(lastThreeMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }, [URLConnection]);

    const initializeSignalR = useCallback(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${URLConnection}/chatHub`)
            .withAutomaticReconnect()
            .build();

        const startConnection = async () => {
            try {
                await newConnection.start();
                setConnection(newConnection);
            } catch (err) {
                console.error('SignalR Connection Error:', err);
                setTimeout(startConnection, 5000);
            }
        };

        startConnection();

        return newConnection;
    }, [URLConnection]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    useEffect(() => {
        const signalRConnection = initializeSignalR();

        return () => {
            if (signalRConnection) {
                signalRConnection.stop();
            }
        };
    }, [initializeSignalR]);

    useEffect(() => {
        if (!connection) return;

        const handleReceiveMessage = (user, message) => {
            setStoredMessages(prevMessages => {
                const newMessages = [...prevMessages, { user, message }];
                const newCantidadMensajes = newMessages.length;
                setCantidadMensajes(newCantidadMensajes);
                localStorage.setItem('cantidadMensajes', newCantidadMensajes.toString());
                return newMessages;
            });
        };

        const handleMessageDeleted = () => {
            fetchMessages(); 
        };

        connection.on("ReceiveMessage", handleReceiveMessage);
        connection.on("MessageDeleted", handleMessageDeleted);

        return () => {
            connection.off("ReceiveMessage", handleReceiveMessage);
            connection.off("MessageDeleted", handleMessageDeleted);
        };
    }, [connection, fetchMessages]);

    const ChatIcon = () => (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            fill="currentColor" 
            className="bi bi-chat-left-text" 
            viewBox="0 0 16 16" 
            style={{ marginLeft: "620px" }}
        >
            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
            <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
        </svg>
    );

    return (
        <div className="App">
            <div>
                <Navbar 
                    cantidad_Productos={dataObject.cart.productos.length} 
                    cantidad_Mensajes={cantidadMensajes} 
                />
            </div>
            <div>
                <ul>
                    {storedMessages.map((messageObj, index) => (
                        <div key={index} className="message-container">
                            <div dangerouslySetInnerHTML={{ __html: messageObj.message }} />
                            <div>{messageObj.messageContent}</div>
                            <ChatIcon />
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Message;