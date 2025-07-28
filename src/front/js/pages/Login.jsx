import React, {useEffect, useState, useContext} from 'react'
import {Context} from "../store/appContext"
//import { toast } from "react-toastify";
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

        }
        else {
            alert("Error al iniciar sesión. Verifica los datos ingresados.");
            setEmail("");
            setPassword("");
        }




     }


  return (
    <div>

        
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Direccion email</label>
            <input type="email" className="form-control" id="email" placeholder="name@example.com" required value={email} onChange={(e) => {setEmail(e.target.value)}}/>
        </div>

        <div className="mb-3">
            <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Contraseña</label>
            <div className="col-sm-10">
                <input type="password" className="form-control" id="inputPassword" required value={password} onChange={(e) => {setPassword(e.target.value)}}/>
             </div>

            <button type="button" className="btn btn-primary" onClick={handleLogin}>Login</button>
        </div>
    </div>
  )
}

export default Login
