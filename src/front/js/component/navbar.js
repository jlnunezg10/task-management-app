import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
	const navigate = useNavigate()
 	const [loggedIn, setLoggedIn] = useState(false);

	const isLogged = ()=>{
	if (localStorage.getItem("token")){
		setLoggedIn(true)
	}
	else{
		setLoggedIn(false)
	}

	}

	const handleLogout = () =>{
		localStorage.removeItem("token");
		setLoggedIn(false)
		alert("Cerrada la sesión con exito")
		navigate('/login')
	}

	// const handleTask = () => {

	// 	if (!localStorage.getItem("token")) {
	// 		alert("El usuario ya no esta logueado")
	// 		navigate('/login')
	// 	}
	// 	navigate('/tasks')

	// }
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Task App</span>
				</Link>
				
				<div className="d-flex">

				<div className="ml-auto mx-1">
					<Link to="/signup">

					{
					!localStorage.getItem("token") && <button className="btn btn-primary">Signup</button>
					}
						
					</Link>
				</div>
				<div className="ml-auto mx-1">
					<Link to="/login">
				{
					!localStorage.getItem("token") && <button className="btn btn-success">Login</button>
				}			
					</Link>
				</div>
			
				<div className="ml-auto mx-1">
					{
					 localStorage.getItem("token") && <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
					}

				</div>


				</div>

			</div>
		</nav>
	);
};