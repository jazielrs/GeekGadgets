'use client';
import React, { useEffect, useState } from 'react';
import * as signalR from "@microsoft/signalr";
import Navbar from '../../components/Navbar';
import "../../styles/pago.css";
import "../../styles/message.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Message = () => {
    
    const URLConnection = process.env.NEXT_PUBLIC_API;

    const storedData = localStorage.getItem('tienda');
    const dataObject = JSON.parse(storedData);
    const [connection, setConnection] = useState(null);
    const [storedMessages, setStoredMessages] = useState([]);
    const [cantidadMensajes, setCantidadMensajes] = useState(() => {
        const storedCantidadMensajes = localStorage.getItem('cantidadMensajes');
        return storedCantidadMensajes ? parseInt(storedCantidadMensajes) : 0;
    });
    
    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
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
            throw new Error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(URLConnection + "/chatHub")
            .build();

        const startConnection = () => {
            newConnection.start()
                .then(() => {
                    setConnection(newConnection);
                })
                .catch(err => {
                    setTimeout(startConnection, 5000);
                    throw new Error('SignalR Connection Error: ', err);
                });
        };

        newConnection.onclose(() => {
            setTimeout(startConnection, 5000);
        });

        startConnection();

        return () => {
            if (connection) {
                connection.stop();
            }
        };
    }, []);

    useEffect(() => {
        if (connection) {
            connection.on("ReceiveMessage", (user, message) => {
                const newMessages = [...storedMessages, { user, message }];
                setStoredMessages(newMessages);
                const newCantidadMensajes = newMessages.length;
                setCantidadMensajes(newCantidadMensajes);
                localStorage.setItem('cantidadMensajes', newCantidadMensajes.toString());
            });
        }
    }, [connection, storedMessages]);

    return (
        <div className="App">
            <div>
                <Navbar cantidad_Productos={dataObject.cart.productos.length} cantidad_Mensajes={cantidadMensajes} />
            </div>
            <div>
                <ul>
                    {storedMessages.map((messageObj, index) => (
                        <div key={index} className="message-container">
                            <div dangerouslySetInnerHTML={{ __html: messageObj.message }} />
                            <div>{messageObj.messageContent}</div> 
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-chat-left-text" viewBox="0 0 16 16" style={{ marginLeft: "620px" }}>
                                <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                            </svg>
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Message;