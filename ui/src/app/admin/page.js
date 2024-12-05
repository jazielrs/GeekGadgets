"use client";
import React, { useState, useEffect } from "react";
import "../../styles/login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";

const Login = () => {

  const URLConection = process.env.NEXT_PUBLIC_API;

  const initialState = {
    productosCarrusel: [],
    impVentas: 13,
    cart: { productos: [], subtotal: 0, total: 0, direccionEntrega: '', metodosPago: 0, ordenCompra: 0 },
    necesitaVerificacion: false,
  };

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


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const procesarForm = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Complete la información por favor.');
    } else {
      try {
        const response = await fetch(URLConection+"/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: username,
            password: password
          })
        });

        if (response.ok) {
          const data = await response.json();
          const token = data.token;
          sessionStorage.setItem("token", token);
          window.location.href = "/admin/products";
        } else {
          setError('Credenciales incorrectas ingresadas.');
        }
      } catch (error) {
        setError('Ocurrió un error al procesar la solicitud.');
      }
    }
  };

  return (
    <article>
      <div>
      <Navbar cantidad_Productos={cartData ? cartData.cart.productos.length : 0} cantidad_Mensajes={cantidadMensajes}/>
      </div>
      <div className="form_login">
        <form onSubmit={procesarForm}>
          <label htmlFor="username-input">Nombre Usuario:</label>
          <input
            type="text"
            id="username-input"
            name="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <label htmlFor="password-input">Contraseña:</label>
          <input
            type="password"
            id="password-input"
            name="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error && <p className="error">{error}</p>}
          <div>
            <button className="btnAsignar" type="submit">
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </article>
  );
};

export default Login;