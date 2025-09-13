import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './instruccionesBoton.css';

//Imagenes
import eleccion from '../../images/instrucciones/eleccion.png';
import veloci from '../../images/instrucciones/veloci.png';
import person from '../../images/instrucciones/person.png';
import guar from '../../images/instrucciones/guar.png';
import bien from '../../images/instrucciones/bien.png';
import repe from '../../images/instrucciones/repe.png';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    height: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '20px',
    boxShadow: 24,
    p: 4,
};

const instruccionesBoton = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <div>
                <Button onClick={handleOpen}
                    className='botonInstrucciones'
                    variant="contained"
                >Instrucciones</Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Instrucciones de juego
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <div className='contenedorInstrucciones'>
                                <div>
                                    <b>1.</b>Arrastra los personajes con el mouse y suéltalo en la pista verde.
                                    <br />
                                    <div className='conte2'>
                                        <img className='imagen1' src={eleccion} alt="elegir" />
                                    </div>
                                    <br />
                                    <b>2.</b> Presiona el personaje para darle velocidad.
                                    <br />
                                    <div className='conte2'>
                                        <img className='imagen2' src={veloci} alt="velocidad" />
                                    </div>
                                    <br />
                                    <b>3.</b> Selecciona el personaje al cual quieres chocar.
                                    <div className='conte2'>
                                        <img className='imagen2' src={person} alt="velocidad" />
                                    </div>
                                </div>
                                <div>
                                    <b>4.</b> Guarda los datos presionando el boton "Guardar"
                                    <div className='conte2'>
                                        <img className='imagen3' src={guar} alt="velocidad" />
                                    </div>
                                    <br />
                                    <b>5.</b> Presiona el boton de "Iniciar" para ver los choques.
                                    <div className='conte2'>
                                        <img className='imagen2' src={bien} alt="velocidad" />
                                    </div>
                                    <br />
                                    <b>6.</b> Repite los pasos para más choques.
                                    <div className='conte2'>
                                        <img className='imagen4' src={repe} alt="velocidad" />
                                    </div>
                                </div>
                            </div>
                        </Typography>
                    </Box>
                </Modal>
            </div>
        </>
    );
}

export default instruccionesBoton;
