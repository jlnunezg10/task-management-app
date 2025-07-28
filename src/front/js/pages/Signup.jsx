import React, {useEffect, useState, useContext} from 'react'
import {Context} from "../store/appContext"
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {

  const {store, actions } = useContext(Context);

  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const navigate = useNavigate()

  const handleRegister = async () => {

    const user_register = await actions.register(username,email,password)

    if (user_register){
        alert("usuario registrado con exito")
        navigate('/login')
    }

    else{
        alert("Ocurrio un problema al crear el usuario")
    }

   }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '600px' }}>
      <h5 className="card-title text-center mb-4">Crea un nuevo Usuario</h5>

        <div className="mb-3 row">
            <label htmlFor="email" className="form-label">Ingresar una direccion email</label>
            <input type="email" className="form-control" id="email" placeholder="name@example.com" required value={email} onChange={(e) => {setEmail(e.target.value)}}/>
        </div>

        <div className="mb-3 row">
            <label htmlFor="inputPassword" className="form-label">Ingresar una contraseña</label>
            <input type="password" className="form-control" id="inputPassword" required value={password} onChange={(e) => {setPassword(e.target.value)}}/>
       
          </div>
    <div className='row'>
      <button type="button" className="btn btn-primary" onClick={handleRegister}>Crear nueva cuenta</button>
    </div>
      
    </div>
    </div>
  )
}

export default Signup
