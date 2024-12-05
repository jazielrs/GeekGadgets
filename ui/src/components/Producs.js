import React from "react";
import '../styles/products.css'

const Products = ({item, agregarProducto}) => { 
    const { name, description, price, imageUrl, pcant } = item; 
    return (
        <div className="productContent">
        <div className="border p-3 text-center">
        <h3>{name}</h3>
        <h5>{description}</h5>
        <img src={imageUrl} style={{ height: '220px', width: '100%' }} className="imgProduct" alt="Product Image" />
        <h5 style={{paddingTop: '20px' }}>${price}</h5>
        <button type="button" className="btn btn-success mt-3" onClick={()=>agregarProducto(item)}> Agregar al carrito</button> 
      </div>
      </div>
    );  
  };

  export default Products;