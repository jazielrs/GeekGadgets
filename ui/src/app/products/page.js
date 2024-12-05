
"use client";
import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from '../../components/Navbar';
import Producs from '../../components/Producs';

export default function Home() {

  const URLConection = process.env.NEXT_PUBLIC_API;

  const initialState = {
    productosCarrusel: [],
    impVentas: 13,
    cart: { productos: [], subtotal: 0, total: 0, direccionEntrega: '', metodosPago: 0, ordenCompra: 0 },
    necesitaVerificacion: false,
  };

  const [cantidadMensajes, setCantidadMensajes] = useState(() => {
    const storedCantidadMensajes = localStorage.getItem('cantidadMensajes');
    return storedCantidadMensajes ? parseInt(storedCantidadMensajes, 10) : 0;
  });


  function agregarProducto(item) {
    if (item === "") {
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

  const [newCategoryId, newSelectedCategoryId] = useState(() => {
    const storedTienda = localStorage.getItem('searchData');
    return storedTienda ? JSON.parse(storedTienda) : initialState;
  });

  const [productList, setProductList] = useState([]);
  const [tienda, setTienda] = useState(() => {
    const storedTienda = localStorage.getItem('tienda');
    return storedTienda ? JSON.parse(storedTienda) : initialState;
  });

  useEffect(() => { loadData(); }, [newCategoryId]);

  useEffect(() => {
    localStorage.setItem('tienda', JSON.stringify(tienda));
  }, [tienda]);

  useEffect(() => {
  }, [productList]);

  const loadData = async () => {
    try {
      const selectedIdsString = newCategoryId.selectedCheckboxIds.join(',');
      let response = null;
      if (!newCategoryId.searchText.trim() && selectedIdsString.trim()) {
        response = await fetch(`${URLConection}/api/store/products/categories?idSearch=noText&idSearchCat=${selectedIdsString}`);
      } else if (newCategoryId.searchText.trim() && !selectedIdsString.trim()) {
        response = await fetch(`${URLConection}/api/store/products/categories?idSearch=${newCategoryId.searchText}&idSearchCat=0`);
      } else {
        response = await fetch(`${URLConection}/api/store/products/categories?idSearch=${newCategoryId.searchText}&idSearchCat=${selectedIdsString}`);
      }
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const json = await response.json();
      setProductList(json);
      window.history.pushState({}, '', `?idSearch=${newCategoryId.searchText}&idSearchCat=${selectedIdsString}`);
    } catch (error) {
      throw new Error('Error al intentar realizar el fetch:');
    }
  };

  return (
    <div>
      <div>
        <Navbar cantidad_Productos={tienda.cart.productos.length} cantidad_Mensajes={cantidadMensajes} />
      </div>
      <div className="d-flex justify-content-center align-items-center"></div>
      <main>
        <div className="container">
          <div>
            <section className="container-fluid">
              <div className="row product-container">
                {productList && productList.products && productList.products.length > 0 ? (
                  productList.products.map((item) => (
                    <div key={item.id} className="col-3 col-md-3 col-lg-3 mt-2 product-item">
                      <Producs item={item} agregarProducto={agregarProducto} />
                    </div>
                  ))
                ) : (
                  <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                    <p>No se encontraron productos en esta categoría.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );

}  
