"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import "../../styles/direccion.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Detalle = () => {
  const URLConection = process.env.NEXT_PUBLIC_API;
  const [confirmed, setConfirmed] = useState(false);
  const [orderDetails, setOrderDetails] = useState(undefined);
  const [dataObject, setDataObject] = useState(null);
  const [telefonoGenerado, setTelefonoGenerado] = useState(null);
  const [cantidadMensajes, setCantidadMensajes] = useState(() => {
    const storedCantidadMensajes = localStorage.getItem('cantidadMensajes');
    return storedCantidadMensajes ? parseInt(storedCantidadMensajes, 10) : 0;
  });

  useEffect(() => {
    const storedData = localStorage.getItem("tienda");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setDataObject(parsedData);
      } catch (error) {
        throw new Error("Error al parsear datos de localStorage:", error);
      }
    }

    // Generar número de teléfono una sola vez
    setTelefonoGenerado(Math.floor(Math.random() * 100000000));
  }, []);

  const mostrarTextArea = dataObject && dataObject.cart && dataObject.cart.metodosPago === 1;

  function procesarPago(e) {
    e.preventDefault();
    const updatedCart = {
      ...dataObject.cart,
      necesitaVerificacion: true,
    };
    const updatedDataObject = { ...dataObject, cart: updatedCart };
    localStorage.setItem("tienda", JSON.stringify(updatedDataObject));
  }

  function actualizarOrden(ordenCompraRespuesta) {
    const updatedCart = {
      ...dataObject.cart,
      ordenCompra: ordenCompraRespuesta,
    };
    const updatedDataObject = { ...dataObject, cart: updatedCart };
    localStorage.setItem("tienda", JSON.stringify(updatedDataObject));
  }

  const enviarDatosPago = async () => {
    if (!dataObject) {  
      return <p></p>;
    }

    const idsProductos = dataObject.cart.productos.map((producto) => String(producto.id));

    const dataToSend = {
      productIds: idsProductos,
      address: dataObject.cart.direccionEntrega,
      paymentMethod: dataObject.cart.metodosPago,
    };

    try {
      const response = await fetch(URLConection + "/api/Cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const order = await response.json();
        actualizarOrden(order.numeroCompra);
        setConfirmed(true);
        setOrderDetails(order);

        const initialCartState = {
          productos: [],
          subtotal: 0,
          total: 0,
          direccionEntrega: "",
          metodosPago: 0,
          ordenCompra: 0,
        };
        const updatedDataObject = { ...dataObject, cart: initialCartState };
        localStorage.setItem("tienda", JSON.stringify(updatedDataObject));
      } else {
        const errorResponseData = await response.json();
        throw new Error(errorResponseData.message || "Error al procesar el pago");
      }
    } catch (error) {
      throw new Error("Error al procesar el pago:", error);
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
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="detalleCompra text-center">
              {orderDetails && (
                <div className="mb-3">
                  <p>Número de compra: {orderDetails.numeroCompra}</p>
                </div>
              )}
              <p>Número de teléfono: {telefonoGenerado}</p>
              {mostrarTextArea && (
                <textarea
                  className="form-control mt-3"
                  rows="5"
                  placeholder="Comprobante de pago"
                />
              )}
              <button onClick={enviarDatosPago} className="btn btn-info mt-3">
                Confirmar compra
              </button>
              {confirmed && <p className="mt-3">Compra confirmada!</p>}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Detalle;
