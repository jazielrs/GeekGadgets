'use client';
import React, { useState, useEffect } from 'react';
import "../../../styles/direccion.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from '../../../components/Navbar';

const Product = () => {

    const URLConection = process.env.API;

    const [cantidadMensajes, setCantidadMensajes] = useState(() => {
        const storedCantidadMensajes = localStorage.getItem('cantidadMensajes');
        return storedCantidadMensajes ? parseInt(storedCantidadMensajes, 10) : 0;
    });

    const [product, setProduct] = useState({
        id: '0',
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        pcant: 0,
        categoryID: ''
    });

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

    const modificarCampo = (e) => {
        const { name, value } = e.target;
        if (name === 'price') {
            if (value.includes('-')) {
                return;
            }
            if (!(/^\d*\.?\d*$/.test(value))) {
                return;
            }
            if (parseFloat(value) < 0) {
                return;
            }
        }

        if (name === 'imageUrl') {
            if (value && !value.match(/\.(jpg|jpeg|png)$/)) {
                throw new Error('Formato de imagen no válido. Solo se permiten archivos JPG o PNG.');
                return;
            }
        }

        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value
        }));
    };

    const agregarProducto = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem("token");
        if (!token) {
            window.location.href = "/admin";
        } else {
            try {
                const productToSend = {
                    ...product,
                    categoryID: product.categoryID || '1'
                };

                const response = await fetch(URLConection + '/api/product', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productToSend),
                });

                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                const data = await response.json();
                setProduct({
                    id: '0',
                    name: '',
                    description: '',
                    price: '',
                    imageUrl: '',
                    pcant: 0,
                    categoryID: ''
                });
            } catch (error) {
                throw new Error('Error al agregar el producto:', error);
            }
        }
    };

    useEffect(() => {
        const storedData = localStorage.getItem('tienda');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
            } catch (error) {
                throw new Error('Error al parsear datos de localStorage:', error);
            }
        } else {
            throw new Error('No se encontraron datos en localStorage para "tienda".');
        }
    }, []);

    return (
        <article>
            <div>
                <Navbar cantidad_Productos={product.pcant} cantidad_Mensajes={cantidadMensajes} />
            </div>
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-6">
                        <h2 className="text-center mb-4">Agregar Nuevo Producto</h2>
                        <form onSubmit={agregarProducto}>
                            <div className="form-group">
                                <label htmlFor="name">Nombre:</label>
                                <input type="text" className="form-control" id="name" name="name" value={product.name} onChange={modificarCampo} autoComplete="name" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Descripción:</label>
                                <textarea className="form-control" id="description" name="description" value={product.description} onChange={modificarCampo} style={{ height: '100px' }} autoComplete="description" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="price">Precio:</label>
                                <input type="text" className="form-control" id="price" name="price" value={product.price} onChange={modificarCampo} autoComplete="price" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="category">Categoría:</label>
                                <select className="form-control" id="category" name="categoryID" value={product.categoryID} onChange={modificarCampo} autoComplete="category">
                                    <option value="1">Perifericos</option>
                                    <option value="2">Hardware</option>
                                    <option value="3">Moda</option>
                                    <option value="4">Videojuegos</option>
                                    <option value="5">Entretenimiento</option>
                                    <option value="6">Decoracion</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="imageUrl">Imagen:</label>
                                <input type="text" className="form-control" id="img" name="imageUrl" value={product.imageUrl} onChange={modificarCampo} autoComplete="url" />
                            </div>
                            <button type="submit" className="btn btn-primary btn-block" style={{ width: '200px', margin: '20px auto', display: 'block' }}>Agregar Producto</button>
                        </form>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default Product;