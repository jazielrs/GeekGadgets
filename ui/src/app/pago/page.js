'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import "../../styles/pago.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Pago = () => {
  const URLConnection = process.env.NEXT_PUBLIC_API;

  const [dataObject, setDataObject] = useState(null);
  const [pagoIngresado, setPagoIngresado] = useState(false);
  const [cantidadMensajes, setCantidadMensajes] = useState(() => {
    const storedCantidadMensajes = localStorage.getItem('cantidadMensajes');
    return storedCantidadMensajes ? parseInt(storedCantidadMensajes, 10) : 0;
  });

  const [metodosPago, setMetodosPago] = useState([]); 

  useEffect(() => {
    obtenerMetodos();
  }, []);

  const obtenerMetodos = async () => {
    try {
      const response = await fetch(`${URLConnection}/api/pago`);
      if (!response.ok) {
        throw new Error('Error al obtener los métodos de pago');
      }
      const data = await response.json();
      const metodosFiltrados = data.filter(metodo => metodo.estado === 1);
      setMetodosPago(metodosFiltrados);
    } catch (error) {
      throw new Error('Error obteniendo los métodos de pago:', error);
    }
  };

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const storedData = localStorage.getItem("tienda");
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setDataObject(parsedData);
        } catch (error) {
          throw new Error('Error al parsear datos de localStorage:', error);
        }
      }
    }
  }, []);

  const agregarPago = (e) => {
    e.preventDefault();

    if (!dataObject) {
      return;
    }

    let metodoPago = e.target.pago.value;
    let pago = 0;

    if (metodoPago === "Sinpe Movil") {
      pago = 1;
    }

    const updatedCart = {
      ...dataObject.cart,
      metodosPago: pago,
    };

    const updatedDataObject = { ...dataObject, cart: updatedCart };

    try {
      localStorage.setItem("tienda", JSON.stringify(updatedDataObject));
      setPagoIngresado(true);
    } catch (error) {
      throw new Error('No se pudo guardar el método de pago:', error);
    }
  };

  if (!dataObject) {
    return <p></p>;
  }

  return (
    <article>
      <div>
        <Navbar cantidad_Productos={dataObject.cart.productos.length} cantidad_Mensajes={cantidadMensajes} />
      </div>
      <div className="form_pago">
        <form onSubmit={agregarPago}>
          {metodosPago.map((metodo) => (
            <div key={metodo.id} className="form-check">
              <input
                type="radio"
                id={`pago${metodo.id}`}
                name="pago"
                value={metodo.payment_type}
                className="form-check-input"
              />
              <label htmlFor={`pago${metodo.id}`} className="form-check-label">
                {metodo.payment_type}
              </label>
            </div>
          ))}
          <button type="submit" className="btn btn-primary mt-3">
            Seleccionar tipo de pago
          </button>
        </form>
        {pagoIngresado && (
          <p className="infoPago" style={{ fontSize: '0.8em' }}>Método de pago ingresado exitosamente.</p>
        )}
        <div className="cart_box">
          <a
            href="/detalle"
            className="btn btn-info mt-3"
          >
            Continuar con la compra
          </a>
        </div>
      </div>
    </article>
  );
};

export default Pago;