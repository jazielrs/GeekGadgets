'use client';
import "../../../styles/direccion.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from '../../../components/Navbar';
import React, { useState, useEffect } from 'react';

const ModificaPago = () => {
    const URLConnection = process.env.NEXT_PUBLIC_API;

    const storedData = localStorage.getItem('tienda');
    const dataObject = JSON.parse(storedData);
    const [cantidadMensajes, setCantidadMensajes] = useState(() => {
        const storedCantidadMensajes = localStorage.getItem('cantidadMensajes');
        return storedCantidadMensajes ? parseInt(storedCantidadMensajes, 10) : 0;
    });

    const [metodosPago, setMetodosPago] = useState([]);
    const [selectedMetodoPago, setSelectedMetodoPago] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        obtenerMetodos();
    }, []);

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

    const obtenerMetodos = async () => {
        const token = sessionStorage.getItem("token");
        try {
            const response = await fetch(`${URLConnection}/api/pago`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener los métodos de pago');
            }
            const data = await response.json();
            setMetodosPago(data); 
        } catch (error) {
            throw new Error('Error obteniendo los métodos de pago:', error);
        }
    };

    const handleActivar = async () => {
        if (!selectedMetodoPago) {
            setMessage('Seleccione un método de pago antes de activar.');
            return;
        }
        await modificarEstado(selectedMetodoPago, 1);
    };

    const handleDesactivar = async () => {
        if (!selectedMetodoPago) {
            setMessage('Seleccione un método de pago antes de desactivar.');
            return;
        }
        await modificarEstado(selectedMetodoPago, 0);
    };

    const modificarEstado = async (payment_type, estado) => {
        if(payment_type == null){
            throw new Error("El tipo de pago no se ingreso correctamente");
        }
        if(estado != 0 && estado != 1){
            throw new Error("El estado del metodo de pago no es el correcto");
        }
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${URLConnection}/api/pago?payment_type=${payment_type}&estado=${estado}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                throw new Error('Error al modificar el estado del método de pago');
            }

            const action = estado === 1 ? 'activado' : 'desactivado';
            setMessage(`Método de pago ${payment_type} ${action} correctamente.`);
        } catch (error) {
            throw new Error('Error modificando el estado del método de pago:', error);
        }
    };

    return (
        <article>
            <div>
                <Navbar cantidad_Productos={dataObject.cart.productos.length} cantidad_Mensajes={cantidadMensajes} />
                <div className="container">
                    <h3 className="text-center">Modificar Pago</h3>
                    <form>
                        <div className="form-group" style={{ width: '500px', margin: '0 auto' }}>
                            <select
                                className="form-control custom-select"
                                id="metodoPago"
                                value={selectedMetodoPago}
                                onChange={(e) => setSelectedMetodoPago(e.target.value)}
                            >
                                <option value="">Seleccione un método de pago</option>
                                {metodosPago.map((metodo) => (
                                    <option key={metodo.id} value={metodo.payment_type}>
                                        {metodo.payment_type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group text-center" style={{ marginTop: '20px'}}>
                            <button type="button" className="btn btn-success" onClick={handleActivar} style={{ marginRight: '30px'}}>
                                Activar
                            </button>
                            <button type="button" className="btn btn-danger" onClick={handleDesactivar}>
                                Desactivar
                            </button>
                        </div>
                        {message && <p className="text-center text-success mt-3">{message}</p>}
                    </form>
                </div>
            </div>
        </article>
    );
};

export default ModificaPago;