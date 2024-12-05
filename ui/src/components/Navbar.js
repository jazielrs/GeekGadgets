"use client";
import Link from 'next/link';
import '../styles/navbar.css'
import React, { useState, useEffect } from "react";

const Navbar = ({ cantidad_Productos, cantidad_Mensajes }) => {

  const [searchText, setSearchText] = useState("");
  const [checkboxValues, setCheckboxValues] = useState({
    option1: false,
    option2: false,
    option3: false,
    option4: false,
    option5: false,
    option6: false,
    nc: false
  });
  const [searchData, setSearchData] = useState({
    searchText: "",
    selectedCheckboxIds: []
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
  }, [searchData]);

  const handleSearchInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    if (!e.target) {
      throw new Error('No se han ingresado categorias');
    }
    const { id, checked } = e.target;
    setCheckboxValues({ ...checkboxValues, [id]: checked });
  };

  const handleSearch = () => {
    const selectedCheckboxIds = Object.keys(checkboxValues).filter(id => checkboxValues[id]);
    const dataToStore = {
      searchText,
      selectedCheckboxIds
    };
    setSearchData(dataToStore);
    localStorage.setItem("searchData", JSON.stringify(dataToStore));
    if (window.location.pathname === '/products') {
      window.location.href = '/products';
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const limpiarNotificaciones = () => {
    localStorage.setItem('cantidadMensajes', '0');
  };


  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <a href="/" className="my_shop">
          <button className="my_shop_button">
            <img src="https://img.icons8.com/clouds/100/technology.png" alt="GeekGadgets" className="button_image" /> GeekGadgets
          </button>
        </a>
        <div className='d-flex' style={{ marginLeft: '130px' }}>
          <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" style={{ color: 'black' }} value={searchText} onChange={handleSearchInputChange} />
          <Link href="/products">
            <button
              className="btn btn-outline-success"
              type="submit"
              style={{ color: "white", marginRight: "10px" }}
              onClick={handleSearch}
            >
              Buscar
            </button>
          </Link>
        </div>
        <div className='dflex' style={{ width: '250px' }}>
          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" onClick={toggleDropdown} style={{ width: '225px' }}>
              Busqueda avanzada
            </button>
            <div className={`dropdown-menu${dropdownOpen ? ' show' : ''}`} aria-labelledby="dropdownMenuButton" style={{ minWidth: '225px' }}>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="1" value="option1" onChange={handleCheckboxChange} style={{ marginLeft: '1px', marginRight: '5px' }}></input>
                <label className="form-check-label" htmlFor="inlineCheckbox1" style={{ marginLeft: '1px' }}>Perifericos</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="2" value="option2" onChange={handleCheckboxChange} style={{ marginLeft: '1px', marginRight: '5px' }}></input>
                <label className="form-check-label" htmlFor="inlineCheckbox2" style={{ marginLeft: '1px' }}>Hardware</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="3" value="option3" onChange={handleCheckboxChange} style={{ marginLeft: '1px', marginRight: '5px' }}></input>
                <label className="form-check-label" htmlFor="inlineCheckbox3">Moda</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="4" value="option4" onChange={handleCheckboxChange} style={{ marginLeft: '1px', marginRight: '5px' }}></input>
                <label className="form-check-label" htmlFor="inlineCheckbox4">Videojuegos</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="5" value="option5" onChange={handleCheckboxChange} style={{ marginLeft: '1px', marginRight: '5px' }}></input>
                <label className="form-check-label" htmlFor="inlineCheckbox5">Entretenimiento</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="6" value="option6" onChange={handleCheckboxChange} style={{ marginLeft: '1px', marginRight: '5px' }}></input>
                <label className="form-check-label" htmlFor="inlineCheckbox6">Decoracion</label>
              </div>
            </div>
          </div>
        </div>
        <Link className='login' href="/admin">
          <div className='d-flex' style={{ alignItems: 'flex-end' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="green"
              className="bi bi-person-fill-lock"
              viewBox="0 0 16 16"
            >
              <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5v-1a2 2 0 0 1 .01-.2 4.49 4.49 0 0 1 1.534-3.693Q8.844 9.002 8 9c-5 0-6 3-6 4m7 0a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1" />
            </svg>
          </div>
        </Link>
        <Link className='numero_carrito' href="/cart">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="#bfbfbf"
              className="bi bi-cart-plus"
              viewBox="0 0 16 16"
            >
              <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z" />
              <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
            </svg>
            <span className='number'>{cantidad_Productos}</span>
          </div>
        </Link>
        <Link className='campain' href="/message" onClick={limpiarNotificaciones}>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="white"
              className="bi bi-bell-fill"
              viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
            </svg>
            <span className='number'>{cantidad_Mensajes}</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;