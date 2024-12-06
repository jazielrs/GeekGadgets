"use client";
import React, { useState, useEffect } from 'react';
import * as signalR from "@microsoft/signalr";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from '../components/Navbar';
import Producs from '../components/Producs';
import Carousel from 'react-bootstrap/Carousel';
import { Dropdown } from 'react-bootstrap';

export default function Home() {

  const URLConection = process.env.NEXT_PUBLIC_API;

  const initialState = {
    productosCarrusel: [],
    impVentas: 13,
    cart: { productos: [], subtotal: 0, total: 0, direccionEntrega: '', metodosPago: 0, ordenCompra: 0 },
    necesitaVerificacion: false,
  };

  function agregarProducto(item) {

    if (item == undefined) {
      throw new Error("El objeto a agregar se encuentra vacio")
    }
    try {

      const isPresent = tienda.cart.productos.some(producto => producto.id == item.id);

      if (!isPresent) {
        const nuevosProductos = tienda.cart.productos.concat(item);

        let subtotalCalc = 0;

        nuevosProductos.forEach((item) => {
          subtotalCalc += item.price;
          item.pcant += 1;
        });

        const nuevoSubtotal = subtotalCalc;
        const nuevoTotal = nuevoSubtotal * (1 + tienda.impVentas / 100);

        setTienda({
          ...tienda,
          cart: {
            ...tienda.cart,
            productos: nuevosProductos,
            subtotal: nuevoSubtotal,
            total: nuevoTotal,
          }
        });
      }
    } catch (error) {
      throw new Error('Error al agregar producto: ' + error.message);
    }
  };

  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const [previousCategoryId, setPreviousCategoryId] = useState();
  const [productList, setProductList] = useState([]);
  const [tienda, setTienda] = useState(initialState);
  const [index, setIndex] = useState(0);
  const [cantidadMensajes, setCantidadMensajes] = useState(() => {
    const storedCantidadMensajes = localStorage.getItem('cantidadMensajes');
    return storedCantidadMensajes ? parseInt(storedCantidadMensajes, 10) : 0;
  });
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const storedCantidadMensajes = localStorage.getItem('cantidadMensajes');
    if (storedCantidadMensajes) {
      setCantidadMensajes(parseInt(storedCantidadMensajes, 10));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cantidadMensajes', cantidadMensajes.toString());
  }, [cantidadMensajes]);

  useEffect(() => { loadData(); }, [selectedCategoryId]);

  useEffect(() => {
    setSelectedCategoryId(undefined);
  }, [selectedCategoryId]);

  useEffect(() => {
    localStorage.setItem('tienda', JSON.stringify(tienda));
  }, [tienda]);

  useEffect(() => {
    setPreviousCategoryId(selectedCategoryId);
  }, [selectedCategoryId]);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const storedData = localStorage.getItem('tienda');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setTienda(parsedData);
        } catch (error) {
          throw new error('Error al parsear datos de localStorage:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(URLConection + "/chatHub")
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
    return () => newConnection.stop();
  }, [URLConection]);

  useEffect(() => {
    if (!connection) return;

    connection.on("ReceiveMessage", () => {
      setCantidadMensajes(prev => {
        const newCount = prev + 1;
        localStorage.setItem('cantidadMensajes', newCount.toString());
        return newCount;
      });
    });

    return () => connection.off("ReceiveMessage");
  }, [connection]);

  const getCategoryName = (categoryId) => {
    switch (categoryId) {
      case 1:
        return "Periféricos";
      case 2:
        return "Hardware";
      case 3:
        return "Moda";
      case 4:
        return "Videojuegos";
      case 5:
        return "Entretenimiento";
      case 6:
        return "Decoración";
      case 7:
        return "Todas las categorías";
      default:
        return "Categorías";
    }
  };

  const handleDropdownSelect = async (categoryId) => {
    if (categoryId < 1) {
      throw new Error("La categoria asignada es incorrecta");
    }
    setSelectedCategoryId(categoryId);
    try {
      const response = await fetch(`${URLConection}/api/store/products?idCat=${categoryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const products = await response.json();
      if (!products) {
        throw new Error('No products found');
      }
      setProductList(products);
    } catch (error) {
      throw new Error("El fetch de la categoria seleccionada ha fallado");
    }
  };

  const loadData = async () => {
    try {
      const response = await fetch(URLConection + '/api/store');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const json = await response.json();
      if (selectedCategoryId === undefined) {
        setProductList(json);
      }
    } catch (error) {
      throw new Error('Error while fetching data:', error);
    }
  };
  const ControlledCarousel = ({ productListApi, agregarProducto }) => {

    if (productListApi == undefined) {
      throw new Error("La lista se encuentra vacia");
    }

    if (typeof agregarProducto !== 'function') {
      throw new Error('La función para agregar productos es inválida');
    }

    const handleSelect = (selectedIndex) => {
      if (typeof selectedIndex !== 'number' || selectedIndex < 0 || selectedIndex >= productListApi.length) {
        throw new Error('El índice seleccionado es inválido');
      }
      setIndex(selectedIndex);
    };

    const handleClick = (item) => {
      try {
        if (!item) {
          throw new Error('El producto es nulo');
        }
        agregarProducto(item);
      } catch (error) {
        throw new Error("Error al agregar producto");
      }
    };

    return (
      <Carousel activeIndex={index} onSelect={handleSelect}>
        {productListApi && productListApi.products && productListApi.products.map((item) => (
          <Carousel.Item key={item.id}>
            <img
              className="d-block w-100"
              src={item.imageUrl}
              alt={item.name}
              style={{ height: '300px', objectFit: 'cover' }}
            />
            <Carousel.Caption>
              <button className="btn btn-outline-info" onClick={() => handleClick(item)}>Agregar al carrito</button>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    );
  };

  const Footer = () => (
    <footer className="bg-body-tertiary text-center text-lg-start">
      <div className="text-center p-3" style={{ backgroundColor: 'black' }}>
        <a className="text-white">© 2024: Condiciones de uso</a>
      </div>
    </footer>
  );

  return (
    <div>
      <div>
        <Navbar cantidad_Productos={tienda.cart.productos.length} cantidad_Mensajes={cantidadMensajes}/>
      </div>
      <ControlledCarousel productListApi={productList} agregarProducto={agregarProducto} />
      <div className="d-flex justify-content-center align-items-center">
        <Dropdown onSelect={handleDropdownSelect} show={selectedCategoryId}>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {previousCategoryId !== undefined ? getCategoryName(selectedCategoryId) : "Categorías"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onSelect={handleDropdownSelect} eventKey={1}>Perifericos</Dropdown.Item>
            <Dropdown.Item onSelect={handleDropdownSelect} eventKey={2}>Hardware</Dropdown.Item>
            <Dropdown.Item onSelect={handleDropdownSelect} eventKey={3}>Moda</Dropdown.Item>
            <Dropdown.Item onSelect={handleDropdownSelect} eventKey={4}>Videojuegos</Dropdown.Item>
            <Dropdown.Item onSelect={handleDropdownSelect} eventKey={5}>Entretenimiento</Dropdown.Item>
            <Dropdown.Item onSelect={handleDropdownSelect} eventKey={6}>Decoracion</Dropdown.Item>
            <Dropdown.Item onSelect={handleDropdownSelect} eventKey={7}>Todas las categorias</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <main>
        <div className="container" >
          <div>
            <section className="container-fluid">
              <div className="row product-container">
                {productList && productList.products && productList.products.map((item) => (
                  <div key={item.id} className="col-3 col-md-3 col-lg-3 mt-2 product-item">
                    <Producs item={item} agregarProducto={agregarProducto} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <div>
        <Footer></Footer>
      </div>
    </div>
  );
}  
