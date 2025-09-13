import { useState, useRef } from "react";
import "./App.css";

//Imagenes
import marco from "./images/carros/marco.png";
import fanis from "./images/carros/2.png";
import mersis from "./images/carros/3.png";
import pupi from "./images/carros/4.png";
import candelabra from "./images/carros/5.png";
import varsos from "./images/carros/6.png";

//Componentes
import InstruccionesBoton from "./Components/instruccionesBoton/instruccionesBoton";

const escenarioCarros = () => {

  // personajes fuera del tablero
  const [personajes, setPersonajes] = useState([
    //usado para saber si ya esta en el tablero
    { id: 1, img: marco, usado: false, masa: 80, nombre: "Marco" },
    { id: 2, img: fanis, usado: false, masa: 90, nombre: "Fanis" },
    { id: 3, img: mersis, usado: false, masa: 100, nombre: "Mersis" },
    { id: 4, img: pupi, usado: false, masa: 110, nombre: "Pupi" },
    { id: 5, img: candelabra, usado: false, masa: 120, nombre: "Candelabra" },
    { id: 6, img: varsos, usado: false, masa: 130, nombre: "Varsos" },
  ]);

  // personaje dentro del tablero
  const [personajesTablero, setPersonajesTablero] = useState([]);

  //ayuda a obtener las coordenadas del area del tablero
  const posicionTablero = useRef(null);


  const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);
  const [velocidad, setVelocidad] = useState("");
  const [personajeChoque, setPersonajeChoque] = useState(null);

  // historial de choques
  const [historialChoques, setHistorialChoques] = useState([]);


  const [choquesPendientes, setChoquesPendientes] = useState([]);

  //informacion del personaje que se esta arrastrando
  const handleDragStart = (e, personaje, isFromTablero = false) => {
    e.dataTransfer.setData(
      "miPersonaje",
      JSON.stringify({ personaje, isFromTablero })
    );
  };

  const handleDragOver = (e) => {
    // Permitir soltar el elemento 
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const rect = posicionTablero.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 40;
    const y = e.clientY - rect.top - 40;

    const data = JSON.parse(e.dataTransfer.getData("miPersonaje"));
    const { personaje, isFromTablero } = data;

    //dimensiones del personaje
    const width = 80;
    const height = 80;

    //mirar si hay colision con otros personajes
    //jugar con las dimensiones y la posicion
    const hayColision = personajesTablero.some((p) => {
      return (
        x < p.x + width && x + width > p.x && y < p.y + height && y + height > p.y
      );
    });

    if (hayColision) {
      console.log("No puede");
      return;
    }

    if (isFromTablero) {
      // mover dentro del tablero
      setPersonajesTablero((prev) =>
        prev.map((p) => (p.id === personaje.id ? { ...p, x, y } : p))
      );
    } else {
      // agregar al tablero
      setPersonajesTablero((prev) => [
        ...prev,
        { id: personaje.id, img: personaje.img, masa: personaje.masa, nombre: personaje.nombre, x, y },
      ]);

      // deshabilitar en la paleta
      setPersonajes((prev) =>
        prev.map((p) =>
          p.id === personaje.id ? { ...p, usado: true } : p
        )
      );
    }
    console.log(x, y);
  };

  const handleGuardarChoque = () => {
    if (!velocidad || !personajeChoque) {
      alert("Falta ingresar velocidad o seleccionar otro personaje.");
      return;
    }

    const p1 = personajeSeleccionado;
    const p2 = personajeChoque;

    // Guardar en pendientes (sin moverlos aún)
    setChoquesPendientes((prev) => [
      ...prev,
      {
        //permite generar id unico para cada personaje
        id: Date.now(),
        personajeA: { ...p1, velocidad: Number(velocidad) },
        personajeB: { ...p2 },
      },
    ]);

    // Historial de choques
    setHistorialChoques((prev) => [
      ...prev,
      {
        id: Date.now(),
        personajeA: { id: p1.id, masa: p1.masa, velocidad: Number(velocidad) },
        personajeB: { id: p2.id, masa: p2.masa },
      },
    ]);

    // Convierte todo el tablero en blanco
    // pero la información del personaje se guarda
    // en el historial
    setPersonajeSeleccionado(null);
    setVelocidad("");
    setPersonajeChoque(null);
  };

  // funcion que ejecuta los choques pendientes
  const ejecutarChoques = () => {
    //el forEach ejecuta cada choque que se encuentre
    choquesPendientes.forEach((choque) => {
      const { personajeA, personajeB } = choque;

      const distanciaMinima = 90;
      let nuevaX = personajeB.x;
      let nuevaY = personajeB.y;

      // Restas para saber cual esta mas cerca de pegar arriba o abajo
      const dx = Math.abs(personajeA.x - personajeB.x);
      const dy = Math.abs(personajeA.y - personajeB.y);

      if (dx > dy) {
        // a pegar al lado
        if (personajeA.x < personajeB.x) {
          nuevaX = personajeB.x - distanciaMinima;
          // a la izquierda
        } else {
          nuevaX = personajeB.x + distanciaMinima;
          // a la derecha
        }
        nuevaY = personajeB.y;
      } else {
        // pega arriba o abajo
        if (personajeA.y < personajeB.y) {

          nuevaY = personajeB.y - distanciaMinima;
          // arriba
        } else {
          nuevaY = personajeB.y + distanciaMinima;
          // abajo
        }
        nuevaX = personajeB.x;
      }

      // Para mover el personaje
      setPersonajesTablero((prev) =>
        prev.map((p) =>
          p.id === personajeA.id ? { ...p, x: nuevaX, y: nuevaY } : p
        )
      );
    });

    setChoquesPendientes([]);
  };

  return (
    <>
      <div className="body">
        <div className="body-principal">
          <div className="paleta">
            {/*Tabla de personajes*/}
            {personajes.map((p) => (

              <>
                <div className="personaje">
                  <img
                    key={p.id}
                    src={p.img}
                    alt={`personaje-${p.id}`}
                    draggable={!p.usado}
                    onDragStart={(e) => handleDragStart(e, p, false)}
                    className={`afuera ${p.usado ? "usado" : ""}`} />
                  <div className="nombrePersonaje">
                    <b>{p.nombre}</b> <br />
                  </div>
                </div>
              </>
            ))

            }
          </div>

          {/* Tablero */}

          <div
            ref={posicionTablero}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="area"
          >
            {personajesTablero.map((p) => (
              <img
                key={p.id}
                src={p.img}
                alt={`personaje-${p.id}`}
                draggable
                onDragStart={(e) => handleDragStart(e, p, true)}
                className="dentro"
                onClick={() => setPersonajeSeleccionado(p)}
                style={{ left: p.x, top: p.y }}
              />
            ))}
          </div>

          {/* Pantalla de información */}
          {personajeSeleccionado && (
            <div className="panelInformacion">
              <div className="panelInformacion-contenido">
                <h2>Choque de personajes</h2>
                <p>
                  <b>Seleccionado:</b> {personajeSeleccionado.nombre}
                </p>
                <p>
                  <b>Masa:</b> {personajeSeleccionado.masa} kg
                </p>

                <label>
                  <b>Velocidad:</b>{" "}
                  <input
                    type="number"
                    value={velocidad}
                    onChange={(e) => setVelocidad(e.target.value)}
                    placeholder="Ingrese la velocidad"
                  />
                </label>

                <label className="panelInformacion-contenido-choque">
                  Personaje de Choque:
                  <select
                    value={personajeChoque ? personajeChoque.id : ""}
                    onChange={(e) => {
                      const elegido = personajesTablero.find(
                        (p) => p.id === Number(e.target.value)
                      );
                      setPersonajeChoque(elegido);
                    }}
                  >
                    <option value="" >Seleccionar</option>
                    {personajesTablero
                      .filter((p) => p.id !== personajeSeleccionado.id)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} (Masa {p.masa} kg)
                        </option>
                      ))}
                  </select>
                </label>

                <div className="panel-boton">
                  <button onClick={() => setPersonajeSeleccionado(null)}>Cerrar</button>
                  <button onClick={handleGuardarChoque}>Guardar</button>
                </div>
              </div>
            </div>
          )}
          <button className="botonReproducir" onClick={ejecutarChoques}>Iniciar choque</button>
          {/* Historial de choques 
      <div className="historial">
        <h3>Historial de choques</h3>
        {historialChoques.length === 0 ? (
          <p>No hay choques registrados.</p>
        ) : (
          <ul>
            {historialChoques.map((c) => (
              <li key={c.id}>
                A (id {c.personajeA.id}, Masa {c.personajeA.masa}kg, Vel {c.personajeA.velocidad} m/s)
                ↔
                B (id {c.personajeB.id}, Masa {c.personajeB.masa}kg)
              </li>
            ))}
          </ul>
        )}
      </div>
      */}

        </div>
        <div className="body-secundario">
          <h1>
            Carros Chocones
          </h1>
          <p>
            Modulo de aprendizaje sobre el momento lineal y su conservación.
          </p>
          <div>
            <InstruccionesBoton />
          </div>
        </div>
      </div>
    </>
  );
}


export default escenarioCarros;