//import { jwtDecode } from "jwt-decode";

const getState = ({ getStore, getActions, setStore }) => {


	const apiURL = process.env.BACKEND_URL;
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			users:[],
			tasks:[],

		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},

			//action para registrar un nuevo usuario
			register: async (username,email,password) => {

				try {

					const urlApi = `${apiURL}/api/register`

					if (!username){
						console.log("Datos incompletos, por favor especificar username")
						return false;
					}
					if (!email){
						console.log("Datos incompletos, por favor especificar email")
						return false;
					}
					if (!password){
						console.log("Datos incompletos, por favor especificar contraseña")
						return false;
					}

					const result = await fetch(urlApi, {
						method:"POST",
						body:JSON.stringify({
							username:username,
							email: email,
							password: password
						}),
						headers: {
							"Content-type": "application/json; charset=UTF-8"
						}
					});

					if (!result.ok){
						console.error("Error en registro de usuario")
						throw new Error(result.status)
					}

					const data = await result.json()
					console.log("Registro Exitoso")
					console.log(data)
					return true;	

				} catch (error) {
					console.error("Se presenta el siguiente error:", error)
					return false;
					
				}
			},

			// action para loguear un nuevo usuario
			login: async(email,password) => {

				const urlApi = `${apiURL}/api/login`

				try {

					if (!email){
						console.log("Datos incompletos, por favor especificar email")
						return false
					}
					if (!password){
						console.log("Datos incompletos, por favor especificar contraseña")
						return false
					}

					const result = await fetch(urlApi, {
						method:"POST",
						body:JSON.stringify({
							email: email,
							password: password
						}),
						headers: {
							"Content-type": "application/json; charset=UTF-8"
						}
					});

					if (!result.ok){
						console.error("Error en login del usuario")
						throw new Error(result.status)
					}

					const data = await result.json();

					if (!data.access_token) {
						console.error(data, "No se recibio un token valido")
						throw new Error("No token received");
					}

					localStorage.setItem("token", data.access_token)
					console.log("Logueo Exitoso")
					return true;

					
				} catch (error) {
					console.error("Se presenta el siguiente error:", error)
					return false;
					
				}

				},
				// action para agregar una nueva tarea
			add_task: async(label) =>{
				const urlApi = `${apiURL}/api/tasks`
				try {

					if(!label){
						console.error("Falta descripcion de la tarea")
						return false;
					}

					const result = await fetch(urlApi, {
						method:"POST",
						body:JSON.stringify({
							label:label
						}),
						headers: {
							"Authorization": `Bearer ${localStorage.getItem('token')}`,
							"Content-type": "application/json; charset=UTF-8"
						}
					});

					if (!result.ok){
						console.error("Error en agregar task")
						throw new Error(result.status)

					}

					const data = await result.json()
					console.log("Tarea agregada exitosamente")
					if (getStore().tasks.length > 0){
						setStore({...getStore(),tasks:[...getStore().tasks, data]})

					}
					else{
						setStore({...getStore(),tasks:[ data]})

					}
					

					return true;	

					
				} catch (error) {
					console.error("Se presenta el siguiente error:", error)
					return false;
					
				}
			},

			edit_task: async(task_id,label) =>{
				try {
					const urlApi = `${apiURL}/api/tasks/${task_id}`

					if(!label){
						console.error("No hay dato que editar")
						return false;
					}


					const result = await fetch(urlApi, {
						method:"PUT",
						body:JSON.stringify({
							label:label
						}),
						headers: {
							"Authorization": `Bearer ${localStorage.getItem('token')}`,
							"Content-type": "application/json; charset=UTF-8"
						}
					});

					
					if (!result.ok){
						console.error("Error en editar task")
						throw new Error(result.status)

					}

					const data = await result.json()
					setStore({...getStore(),tasks:[...getStore().tasks, data]})
					console.log("Tarea editada")
					return true;
					
				} catch (error) {
					console.error("Se presenta el siguiente error:", error)
					return false;
				}


			},

			get_tasks: async() => {
				try {
					const urlApi = `${apiURL}/api/tasks/`

					const result = await fetch(urlApi, {
						method:"GET",
						headers: {
							"Authorization": `Bearer ${localStorage.getItem('token')}`,
							"Content-type": "application/json; charset=UTF-8"
						}
					});

						if (!result.ok){
						console.error("Error en obtener task")
						throw new Error(result.status)
					}

					const data = await result.json()

					setStore({...getStore(),tasks:data})
					console.log("Se obtuvo las tasks")
					console.log(data)
					return true;

					
				} catch (error) {
					console.error("Se presenta el siguiente error:", error)
					return false;					
				}
			},

			delete_task: async(task_id) =>{
				try {
					if(!task_id){
						console.error("No se tiene un task id")
						return false;
					}

					const urlApi = `${apiURL}/api/tasks/${task_id}`
					const result = await fetch(urlApi, {
						method:"DELETE",
						headers: {
							"Authorization": `Bearer ${localStorage.getItem('token')}`,
							"Content-type": "application/json; charset=UTF-8"
						}
					});

					if (!result.ok){
						console.error("Error en obtener task")
						throw new Error(result.status)
					}

					setStore({...getStore(),tasks: getStore().tasks.filter(task => task.id !== task_id)})
					console.log("Task eliminado exitosamente")
					return true;
					

					
				} catch (error) {
					console.error("Se presenta el siguiente error:", error)
					return false;
					
				}
			}



		}
	};
};

export default getState;
