"use client";
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../../components/Navbar";
import "../../../styles/pago.css";
import "../../../styles/campain.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as signalR from "@microsoft/signalr";

const Campaign = () => {
  const URLConnection = process.env.NEXT_PUBLIC_API;

  const [connection, setConnection] = useState(null);
  const [message, setMessage] = useState("");
  const [messageId, setMessageId] = useState("");
  const [mensajesDisponibles, setMensajesDisponibles] = useState([]);
  const [cantidadMensajes, setCantidadMensajes] = useState(() => {
    return parseInt(localStorage.getItem("cantidadMensajes")) || 0;
  });

  const dataObject = JSON.parse(
    localStorage.getItem("tienda") || '{"cart":{"productos":[]}}'
  );

  const verifyTokenExpiration = useCallback(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/admin";
      return false;
    }

    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const expirationDate = new Date(decodedToken.exp * 1000);

    if (new Date() > expirationDate) {
      sessionStorage.removeItem("token");
      window.location.href = "/admin";
      return false;
    }
    return token;
  }, []);

  // SignalR connection
  const establishConnection = useCallback(async () => {
    try {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${URLConnection}/chatHub`)
        .withAutomaticReconnect()
        .build();

      await newConnection.start();
      setConnection(newConnection);
    } catch (err) {
      console.error("Error establishing connection:", err);
      setTimeout(establishConnection, 1000);
    }
  }, [URLConnection]);

  const fetchMensajesDisponibles = useCallback(async () => {
    const token = verifyTokenExpiration();
    if (!token) return;

    try {
      const response = await fetch(`${URLConnection}/api/campannas`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error al obtener los mensajes");
      const data = await response.json();
      setMensajesDisponibles(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [URLConnection, verifyTokenExpiration]);

  // Send message handler
  const handleSendMessage = async () => {
    if (!message.trim() || !connection) return;

    const token = verifyTokenExpiration();
    if (!token) return;

    const tokenData = JSON.parse(atob(token.split(".")[1]));
    const username =
      tokenData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

    try {
      await connection.invoke("SendMessage", username, message);
      await fetch(`${URLConnection}/api/campannas`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Sender: username,
          MessageContent: message,
          Status: 1,
        }),
      });

      setCantidadMensajes((prev) => prev + 1);
      setMessage("");
      await fetchMensajesDisponibles();
    } catch (error) {
      throw new error("Error al enviar mensaje:", error);
    }
  };

  const handleDeleteMessage = async () => {
    if (!messageId || !connection) return;

    const token = verifyTokenExpiration();
    if (!token) return;

    try {
      const response = await fetch(
        `${URLConnection}/api/campannas?message=${messageId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Error al eliminar el mensaje");
      await connection.invoke("NotifyMessageDeleted");
      await fetchMensajesDisponibles();
      setMessageId("");
      
    } catch (error) {
      throw new error("Error al eliminar el mensaje:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(verifyTokenExpiration, 10 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [verifyTokenExpiration]);

  useEffect(() => {
    establishConnection();
    fetchMensajesDisponibles();
  }, [establishConnection, fetchMensajesDisponibles]);

  useEffect(() => {
    localStorage.setItem("cantidadMensajes", cantidadMensajes.toString());
  }, [cantidadMensajes]);

  return (
    <div className="App">
      <header className="App-header">
        <Navbar
          cantidad_Productos={dataObject.cart.productos.length}
          cantidad_Mensajes={cantidadMensajes}
        />
        <div className="message-container">
          <div className="message-create">
            <h1>Crear mensaje</h1>
            <textarea
              className="custom-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ingrese su mensaje para enviar"
            />
            <button
              className="custom-button"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              Enviar mensaje
            </button>
          </div>
          <div className="message-delete">
            <h1>Eliminar mensaje</h1>
            <select
              className="custom-select"
              value={messageId}
              onChange={(e) => setMessageId(e.target.value)}
            >
              <option value="">Seleccione un mensaje</option>
              {mensajesDisponibles.map((mensaje) => (
                <option key={mensaje.id} value={mensaje.id}>
                  {mensaje.messageContent}
                </option>
              ))}
            </select>
            <button
              className="custom-button"
              onClick={handleDeleteMessage}
              disabled={!messageId}
            >
              Eliminar mensaje
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Campaign;
