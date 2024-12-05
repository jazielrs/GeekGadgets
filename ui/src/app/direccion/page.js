"use client";
import "../../styles/direccion.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from '../../components/Navbar';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const Direccion = () => {

  const validLocations = {//combinaciones correctas 
    "San José": {
      "Escazú": ["Escazú", "San Antonio", "San Rafael"],
      "Desamparados": ["Desamparados", "San Miguel", "San Juan de Dios"],
      "San Pedro": ["San Pedro", "San Pablo", "San Ramón"],
      "Santa Ana": ["Santa Ana", "Piedades", "Uruca"]
    },
    "Alajuela": {
      "Grecia": ["Grecia", "San Isidro", "Bolívar"],
      "San Carlos": ["San Carlos", "Quesada", "Pital"],
      "Upala": ["Upala", "Bijagua", "Yolillal"],
      "Guatuso": ["Guatuso", "Katira", "San Rafael"]
    },
    "Cartago": {
      "Paraíso": ["Paraíso", "Orosi", "Tierra Blanca"],
      "La Unión": ["La Unión", "San Rafael", "Tres Ríos"],
      "Jiménez": ["Jiménez", "Juan Viñas", "Pejibaye"],
      "Turrialba": ["Turrialba", "Santa Teresita", "Santa Cruz"]
    },
    "Heredia": {
      "Barva": ["Barva", "San Pedro", "Sagrada Familia"],
      "Santo Domingo": ["Santo Domingo", "Pará", "Santo Tomás"],
      "Santa Bárbara": ["Santa Bárbara", "San José", "San Juan"],
      "San Rafael": ["San Rafael", "Río Segundo", "San Isidro"]
    },
    "Guanacaste": {
      "Liberia": ["Liberia", "Cañas Dulces", "Sardinal"],
      "Nicoya": ["Nicoya", "Nosara", "Nambi"],
      "Santa Cruz": ["Santa Cruz", "Tamarindo", "Tempate"],
      "Bagaces": ["Bagaces", "La Fortuna", "Mogote"],
      "Carrillo": ["Carrillo", "Filadelfia", "Belén de Nosarita"]
    },
    "Puntarenas": {
      "Puntarenas": ["Puntarenas", "Chacarita"],
      "Esparza": ["Esparza", "San Rafael"],
      "Buenos Aires": ["Buenos Aires", "Volcán"],
      "Osa": ["Osa", "Puerto Cortés"]
    },
    "Limón": {
      "Pococí": ["Pococí", "Guápiles", "Rita"],
      "Siquirres": ["Siquirres", "Carmen", "Reventazón"],
      "Talamanca": ["Talamanca", "Sixaola", "Cahuita"]
    }
  };

  const provinces = [
    { value: 'San José', label: 'San José' },
    { value: 'Alajuela', label: 'Alajuela' },
    { value: 'Cartago', label: 'Cartago' },
    { value: 'Heredia', label: 'Heredia' },
    { value: 'Guanacaste', label: 'Guanacaste' },
    { value: 'Puntarenas', label: 'Puntarenas' },
    { value: 'Limón', label: 'Limón' },
  ];

  const cantons = {
    'San José': [
      { value: 'Escazú', label: 'Escazú' }, { value: 'Desamparados', label: 'Desamparados' }, { value: 'San Pedro', label: 'San Pedro' },
      { value: 'Santa Ana', label: 'Santa Ana' },
    ],
    'Alajuela': [
      { value: 'Grecia', label: 'Grecia' }, { value: 'San Carlos', label: 'San Carlos' }, { value: 'Upala', label: 'Upala' },
      { value: 'Guatuso', label: 'Guatuso' },
    ],
    'Cartago': [
      { value: 'Paraíso', label: 'Paraíso' }, { value: 'La Unión', label: 'La Unión' }, { value: 'Jiménez', label: 'Jiménez' },
      { value: 'Turrialba', label: 'Turrialba' },
    ],
    'Heredia': [
      { value: 'Barva', label: 'Barva' }, { value: 'Santo Domingo', label: 'Santo Domingo' },
      { value: 'Santa Bárbara', label: 'Santa Bárbara' }, { value: 'San Rafael', label: 'San Rafael' },
    ],
    'Guanacaste': [
      { value: 'Liberia', label: 'Liberia' }, { value: 'Nicoya', label: 'Nicoya' }, { value: 'Santa Cruz', label: 'Santa Cruz' },
      { value: 'Bagaces', label: 'Bagaces' }, { value: 'Carrillo', label: 'Carrillo' },
    ],
    'Puntarenas': [
      { value: 'Puntarenas', label: 'Puntarenas' }, { value: 'Esparza', label: 'Esparza' }, { value: 'Buenos Aires', label: 'Buenos Aires' },
      { value: 'Osa', label: 'Osa' }, { value: 'Golfito', label: 'Golfito' },
    ],
    'Limón': [
      { value: 'Pococí', label: 'Pococí' }, { value: 'Siquirres', label: 'Siquirres' },
      { value: 'Talamanca', label: 'Talamanca' }, { value: 'Matina', label: 'Matina' },
    ],
  };

  const districts = {
    //distritos San Jose
    'Escazú': { 'San José': [{ value: 'Escazú', label: 'Escazú' }, { value: 'San Antonio', label: 'San Antonio' }, { value: 'San Rafael', label: 'San Rafael' }], },
    'Desamparados': { 'San José': [{ value: 'Desamparados', label: 'Desamparados' }, { value: 'San Miguel', label: 'San Miguel' }, { value: 'San Juan de Dios', label: 'San Juan de Dios' }], },
    'San Pedro': { 'San José': [{ value: 'San Pedro', label: 'San Pedro' }, { value: 'San Pablo', label: 'San Pablo' }, { value: 'San Ramón', label: 'San Ramón' }], },
    'Santa Ana': { 'San José': [{ value: 'Santa Ana', label: 'Santa Ana' }, { value: 'Piedades', label: 'Piedades' }, { value: 'Uruca', label: 'Uruca' }], },
    //distritos Alajuela
    'Grecia': { 'Alajuela': [{ value: 'Grecia', label: 'Grecia' }, { value: 'San Isidro', label: 'San Isidro' }, { value: 'Bolívar', label: 'Bolívar' }] },
    'San Carlos': { 'Alajuela': [{ value: 'San Carlos', label: 'San Carlos' }, { value: 'Quesada', label: 'Quesada' }, { value: 'Pital', label: 'Pital' }] },
    'Upala': { 'Alajuela': [{ value: 'Upala', label: 'Upala' }, { value: 'Bijagua', label: 'Bijagua' }, { value: 'Yolillal', label: 'Yolillal' }] },
    'Guatuso': { 'Alajuela': [{ value: 'Guatuso', label: 'Guatuso' }, { value: 'Katira', label: 'Katira' }, { value: 'San Rafael', label: 'San Rafael' }] },
    //distritos Heredia
    'Barva': { 'Heredia': [{ value: 'Barva', label: 'Barva' }, { value: 'San Pedro', label: 'San Pedro' }, { value: 'Sagrada Familia', label: 'Sagrada Familia' }] },
    'Santo Domingo': { 'Heredia': [{ value: 'Santo Domingo', label: 'Santo Domingo' }, { value: 'Pará', label: 'Pará' }, { value: 'Santo Tomás', label: 'Santo Tomás' }] },
    'Santa Bárbara': { 'Heredia': [{ value: 'Santa Bárbara', label: 'Santa Bárbara' }, { value: 'San José', label: 'San José' }, { value: 'San Juan', label: 'San Juan' }] },
    'San Rafael': { 'Heredia': [{ value: 'San Rafael', label: 'San Rafael' }, { value: 'Río Segundo', label: 'Río Segundo' }, { value: 'San Isidro', label: 'San Isidro' },] },
    //distritos Cartago
    'Paraíso': { 'Cartago': [{ value: 'Paraíso', label: 'Paraíso' }, { value: 'Orosi', label: 'Orosi' }, { value: 'Tierra Blanca', label: 'Tierra Blanca' }], },
    'La Unión': { 'Cartago': [{ value: 'La Unión', label: 'La Unión' }, { value: 'San Rafael', label: 'San Rafael' }, { value: 'Tres Ríos', label: 'Tres Ríos' }], },
    'Jiménez': { 'Cartago': [{ value: 'Jiménez', label: 'Jiménez' }, { value: 'Juan Viñas', label: 'Juan Viñas' }, { value: 'Pejibaye', label: 'Pejibaye' }], },
    'Turrialba': { 'Cartago': [{ value: 'Turrialba', label: 'Turrialba' }, { value: 'Santa Teresita', label: 'Santa Teresita' }, { value: 'Santa Cruz', label: 'Santa Cruz' }] },
    //distritos Puntarenas
    'Puntarenas': { 'Puntarenas': [{ value: 'Puntarenas', label: 'Puntarenas' }, { value: 'Chacarita', label: 'Chacarita' },], },
    'Esparza': { 'Puntarenas': [{ value: 'Esparza', label: 'Esparza' }, { value: 'San Rafael', label: 'San Rafael' },], },
    'Buenos Aires': { 'Puntarenas': [{ value: 'Buenos Aires', label: 'Buenos Aires' }, { value: 'Volcán', label: 'Volcán' },] },
    'Osa': { 'Puntarenas': [{ value: 'Osa', label: 'Osa' }, { value: 'Puerto Cortés', label: 'Puerto Cortés' },], },
    //distritos Guanacaste
    'Liberia': { 'Guanacaste': [{ value: 'Liberia', label: 'Liberia' }, { value: 'Cañas Dulces', label: 'Cañas Dulces' }, { value: 'Sardinal', label: 'Sardinal' }], },
    'Nicoya': { 'Guanacaste': [{ value: 'Nicoya', label: 'Nicoya' }, { value: 'Nosara', label: 'Nosara' }, { value: 'Nambi', label: 'Nambi' }], },
    'Santa Cruz': { 'Guanacaste': [{ value: 'Santa Cruz', label: 'Santa Cruz' }, { value: 'Tamarindo', label: 'Tamarindo' }, { value: 'Tempate', label: 'Tempate' }], },
    'Bagaces': { 'Guanacaste': [{ value: 'Bagaces', label: 'Bagaces' }, { value: 'La Fortuna', label: 'La Fortuna' }, { value: 'Mogote', label: 'Mogote' }], },
    //distritos Limon
    'Pococí': { 'Limón': [{ value: 'Pococí', label: 'Pococí' }, { value: 'Guápiles', label: 'Guápiles' }, { value: 'Rita', label: 'Rita' }], },
    'Siquirres': { 'Limón': [{ value: 'Siquirres', label: 'Siquirres' }, { value: 'Carmen', label: 'Carmen' }, { value: 'Reventazón', label: 'Reventazón' }], },
    'Talamanca': { 'Limón': [{ value: 'Talamanca', label: 'Talamanca' }, { value: 'Sixaola', label: 'Sixaola' }, { value: 'Cahuita', label: 'Cahuita' }], },
  };

  function isValidAddress(province, canton, district) {
    if (!validLocations[province]) return false;
    if (!validLocations[province][canton]) return false;
    if (!validLocations[province][canton].includes(district)) return false;
    return true;
  }

  const [dataObject, setDataObject] = useState(null);
  const [direccionInsertada, setDireccionInsertada] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCanton, setSelectedCanton] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const [cantidadMensajes, setCantidadMensajes] = useState(() => {
    const storedCantidadMensajes = localStorage.getItem('cantidadMensajes');
    return storedCantidadMensajes ? parseInt(storedCantidadMensajes, 10) : 0;
  });


  useEffect(() => {
    setIsClient(true);
    if (typeof localStorage !== 'undefined') {
      const storedData = localStorage.getItem('tienda');
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

  function agregarDireccion(e) {
    e.preventDefault();
    if (!isValidAddress(selectedProvince, selectedCanton, selectedDistrict)) {
      setErrorMessage('Dirección no válida. Asegúrese de que está en el formato correcto y contiene una provincia, cantón y distrito válidos.');
      return;
    }
    const updatedDirection = `${selectedProvince}, ${selectedCanton}, ${selectedDistrict}`;
    if (dataObject) {
      const updatedCart = {
        ...dataObject.cart,
        direccionEntrega: updatedDirection
      };
      const updatedDataObject = { ...dataObject, cart: updatedCart };
      localStorage.setItem('tienda', JSON.stringify(updatedDataObject));
      setDireccionInsertada(true);
      setErrorMessage('');
    }
  }

  return (
    <article>
      <div>
        <Navbar cantidad_Productos={dataObject?.cart?.productos?.length || 0} cantidad_Mensajes={cantidadMensajes} />
      </div>
      <div className="form_direccion">
        <form onSubmit={agregarDireccion}>
          <label htmlFor="province">Provincia:</label>
          {isClient && (
            <Select
              id="province"
              options={provinces}
              onChange={option => {
                setSelectedProvince(option.value);
                setSelectedCanton(null);
                setSelectedDistrict(null);
              }}
            />
          )}
          {selectedProvince && (
            <>
              <label htmlFor="canton">Cantón:</label>
              {isClient && (
                <Select
                  id="canton"
                  options={cantons[selectedProvince]}
                  onChange={option => {
                    setSelectedCanton(option.value);
                    setSelectedDistrict(null);
                  }}
                />
              )}
            </>
          )}
          {selectedCanton && (
            <>
              <label htmlFor="district">Distrito:</label>
              {isClient && (
                <Select
                  id="district"
                  options={districts[selectedCanton][selectedProvince]}
                  onChange={option => setSelectedDistrict(option.value)}
                />
              )}
            </>
          )}
          <button className="btnAsignar" type="submit" style={{ marginTop: "20px" }}>Asignar</button>
        </form>
        {errorMessage && <p className="error-message" style={{ fontSize: '0.8em', color: 'red' }}>{errorMessage}</p>}
        {direccionInsertada && <p className="texto-direc" style={{ fontSize: '0.8em' }}>Dirección insertada correctamente.</p>}
        <div className="cart_box">
          <a
            href="/pago"
            className="btn btn-info mt-3"
          >
            Continuar con la compra
          </a>
        </div>
      </div>
    </article>
  );
};

export default Direccion;