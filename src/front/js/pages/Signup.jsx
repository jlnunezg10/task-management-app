import React, {useEffect, useState, useContext} from 'react'
import {Context} from "../store/appContext"
//import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Signup = () => {

    const {store, actions } = useContext(Context);

   const [username,setUsername] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

   const handleRegister = async () => {

    const user_register = await actions.register(username,email,password)

    if (user_register){
        alert("usuario registrado con exito")
    }

    else{
        alert("Ocurrio un problema al crear el usuario")
    }

   }

    useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate('/')
    }
  }, [])


  return (
    <div>

        <div className="mb-3">
            <label htmlFor="username" className="form-label">Ingresar un nombre de usuarip</label>
            <input type="text" className="form-control" id="username" required value={username} onChange={(e) => {setUsername(e.target.value)}}/>
        </div>

        <div className="mb-3">
            <label htmlFor="email" className="form-label">Ingresar una direccion email</label>
            <input type="email" className="form-control" id="email" placeholder="name@example.com" required value={email} onChange={(e) => {setEmail(e.target.value)}}/>
        </div>

        <div className="mb-3">
            <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Ingresar una contraseña</label>
            <div className="col-sm-10">
            <input type="password" className="form-control" id="inputPassword" required value={password} onChange={(e) => {setPassword(e.target.value)}}/>
        </div>

        <button type="button" className="btn btn-primary" onClick={handleRegister}>Crear nueva cuenta</button>
  </div>
      
    </div>
  )
}

export default Signup
