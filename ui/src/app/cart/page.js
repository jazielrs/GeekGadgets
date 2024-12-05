'use client';
import React, { useState, useEffect } from "react";
import "../../styles/cart.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from '../../components/Navbar';

const Cart = () => {
  const [cartData, setCartData] = useState(undefined);
  const [cantidadMensajes, setCantidadMensajes] = useState(() => {
    const storedCantidadMensajes = localStorage.getItem('cantidadMensajes');
    return storedCantidadMensajes ? parseInt(storedCantidadMensajes, 10) : 0;
  });

  useEffect(() => {
    const storedData = localStorage.getItem('tienda');
    const dataObject = JSON.parse(storedData);
    setCartData(dataObject);
  }, []);

  useEffect(() => {
    if (cartData) {
      localStorage.setItem('tienda', JSON.stringify(cartData));
    }
  }, [cartData]);

  function borrarProducto(item) {
    const updatedProducts = cartData.cart.productos.filter(product => product.id !== item.id);
    const subtotalCalc = updatedProducts.reduce((subtotal, product) => subtotal + product.price * product.pcant, 0);
    const nuevoTotalCalc = subtotalCalc * (1 + cartData.impVentas / 100);

    const updatedCart = {
      ...cartData.cart,
      productos: updatedProducts,
      subtotal: subtotalCalc,
      total: nuevoTotalCalc,
    };

    const updatedDataObject = { ...cartData, cart: updatedCart };
    setCartData(updatedDataObject);
  }

  const isCartEmpty = cartData ? cartData.cart.productos.length === 0 : true;

  const handleChangeCantidad = (e, item) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value <= 0) {
      return; 
    }

    const updatedProducts = cartData.cart.productos.map(product =>
      product.id === item.id ? { ...product, pcant: value } : product
    );

    const subtotalCalc = updatedProducts.reduce((subtotal, product) => subtotal + product.price * product.pcant, 0);
    const nuevoTotalCalc = subtotalCalc * (1 + cartData.impVentas / 100);

    const updatedCart = {
      ...cartData.cart,
      productos: updatedProducts,
      subtotal: subtotalCalc,
      total: nuevoTotalCalc,
    };

    const updatedDataObject = { ...cartData, cart: updatedCart };
    setCartData(updatedDataObject);
  };

  return (
    <article>
      <div>
        <Navbar cantidad_Productos={cartData ? cartData.cart.productos.length : 0} cantidad_Mensajes={cantidadMensajes} />
      </div>

      {cartData && cartData.cart.productos.map((item) => (
        <div className="cart_box" key={item.id}>
          <div className="cart_id">
            <span>{item.name}</span>
          </div>
          <div className="cart_description">
            <span>{item.description}</span>
          </div>
          <div className="cart_precio">
            <span>${item.price}</span>
          </div>
          <div className="cart_image">
            <img
              src={item.imageUrl}
              alt="Product Image"
              style={{ height: '70px', width: '80%' }}
              className="imgProduct"
            />
          </div>
          <div className="cart_cantidad">
            <label>Cantidad</label> :&nbsp;
            <input
              type="number"
              value={item.pcant}
              onChange={(e) => handleChangeCantidad(e, item)}
              style={{ width: '50px' }}
            />
          </div>
          <button
            className="btn btn-danger mt-3"
            onClick={() => borrarProducto(item)}
          >
            Eliminar producto
          </button>
        </div>
      ))}

      {cartData && (
        <div>
          <div className="cart_box" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div>
              <span>Subtotal de la compra: {cartData.cart.subtotal}</span>
            </div>
          </div>
        </div>
      )}

      {cartData && (
        <div>
          <div className="cart_box" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div>
              <span>Total de la compra: {(cartData.cart.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="cart_box" style={{ flex: 1, justifyContent: 'flex-end' }}>
        <a
          href="/direccion"
          className="btn btn-info mt-3"
          disabled={isCartEmpty}
        >
          Continuar con la compra
        </a>
      </div>

    </article>
  );
}

export default Cart;