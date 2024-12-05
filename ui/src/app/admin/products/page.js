'use client';
import React, { useEffect, useState } from "react";
import "../../../styles/direccion.css";
import "../../../styles/products.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../../components/Navbar";
import Sidebar from "../../../components/Sidebar";
import { Table, Button } from "react-bootstrap";

const Products = () => {
  const URLConection = process.env.NEXT_PUBLIC_API;

  const [productList, setProductList] = useState([]);
  const [dataObject, setDataObject] = useState(null);
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
        throw new Error("Error al parsear la variable", error);
      }
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        window.location.href = "/admin";
      } else {
        try {
          const response = await fetch(URLConection + "/api/product", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const pList = await response.json();
          pList.products.sort((a, b) => a.id - b.id);
          setProductList(pList);
        } catch (error) {
          throw new Error("Error al realizar el fetch:", error);
        }
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const verificarFechaExpiracion = () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        window.location.href = "/admin";
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

  const agregarProducto = () => {
    window.location.href = "/admin/product";
  };

  return (
    <article>
      <Navbar cantidad_Productos={dataObject?.cart.productos.length || 0} cantidad_Mensajes={cantidadMensajes} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 fixed-sidebar">
            <Sidebar />
          </div>
          <div className="col-md-9" style={{ marginTop: "30px" }}>
            <div
              className="table-container"
              style={{ maxHeight: "450px", overflowY: "auto" }}
            >
              <Table striped bordered hover style={{ fontSize: "0.7rem" }}>
                <thead>
                  <tr>
                    <th style={{ width: "1%", textAlign: "center" }}>ID</th>
                    <th style={{ width: "10%", textAlign: "center" }}>Name</th>
                    <th style={{ width: "30%", textAlign: "center" }}>
                      Description
                    </th>
                    <th style={{ width: "10%", textAlign: "center" }}>Price</th>
                    <th style={{ width: "10%", textAlign: "center" }}>Image</th>
                  </tr>
                </thead>
                <tbody>
                  {productList?.products?.map((product) => (
                    <tr key={product.id}>
                      <td className="text-center">{product.id}</td>
                      <td className="text-center">{product.name}</td>
                      <td className="text-center">{product.description}</td>
                      <td className="text-center">{product.price}</td>
                      <td className="text-center">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          style={{ width: "50px", height: "auto" }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: "20px",
                justifyContent: "center",
              }}
            >
              <div style={{ marginRight: "40px" }}>
                <Button
                  className="btnAgregar"
                  variant="dark"
                  size="sm"
                  style={{ backgroundColor: "black", color: "white" }}
                  onClick={agregarProducto}
                >
                  Agregar Producto
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Products;