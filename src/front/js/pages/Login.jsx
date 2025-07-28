import React, {useEffect, useState, useContext} from 'react'
import {Context} from "../store/appContext"
import { useNavigate } from "react-router-dom";

const Login = () => {

      const [email,setEmail] = useState("")
        const [password,setPassword] = useState("")

        const {store, actions} = useContext(Context);
        const navigate = useNavigate();


        const handleLogin = async () => {
            if (email === "" || password === "") {
             alert("Por favor, completa todos los campos.");
                return; 

        }   

        const user_login = await actions.login(email, password);    
        if (user_login) {
            alert("Login exitoso");
            navigate('/tasks')

        }
        else {
            alert("Error al iniciar sesión. Verifica los datos ingresados.");
            setEmail("");
            setPassword("");
        }




     }


  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>

        <div className="card shadow p-4" style={{ width: '100%', maxWidth: '600px' }}>
        <h5 className="card-title text-center mb-4">Iniciar Sesión</h5>
    
        <div className="mb-3 row">
            <label htmlFor="email" className="form-label">Direccion email</label>
            <input type="email" className="form-control" id="email" placeholder="name@example.com" required value={email} onChange={(e) => {setEmail(e.target.value)}}/>
        </div>

        <div className="mb-3 row">
            <label htmlFor="inputPassword" className="form-label">Contraseña</label>
            <input type="password" className="form-control" id="inputPassword" required value={password} onChange={(e) => {setPassword(e.target.value)}}/>
        </div>

        <div className="mb-3 ">
            <button type="button" className="btn btn-primary" onClick={handleLogin}>Login</button>
        </div>
    </div>
    </div>
  )
}

export default Login
