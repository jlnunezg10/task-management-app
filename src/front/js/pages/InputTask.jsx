import React, {useEffect, useState, useContext} from 'react'
import {Context} from "../store/appContext"
import { Link, useNavigate } from "react-router-dom";

const InputTask = ()=>{

    const {store,actions} = useContext(Context)
    const [text, setText] = useState("")
    const [IdEdit, setIdEdit] = useState(null)
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate()


    //Funcion handle para añadir la tarea en la lista y enviarla al API
    const handleEnter = async (e) =>{

       if(e.key === 'Enter' && text != ""){
        if (IdEdit){
            const taskEdit = await actions.edit_task(IdEdit,text)

            if(!taskEdit) {
                alert("Ocurrió un problema al editar la tarea")
                return;
            }
            setIdEdit(null)

        }
        else{
            const addTask = await actions.add_task(text)
                if(addTask == "403"){
                    alert("No se pueden tener dos tareas iguales")
                }

                if (!addTask){
                    alert("Ocurrio un problema al agregar la tarea")
                    return;
        }
        }
        setText("");
        await actions.get_tasks()
       }
    }

    // Funcion handle para borrar un task con el boton de eliminar ubicado en lista de tareas
    const handleDelete = async (index) => {

        const borrarTask = await actions.delete_task(index)

        if (!borrarTask){
            alert("Ha ocurrido un error al borrar la tarea")
            return;
        }

        await actions.get_tasks()
    }

    const handleEdit = async (id,label) => {
        setText(label)
        setIdEdit(id)
    }
    //Funcion para editar el checkbox y actualizarlo en DB
    const handleCheckboxChange = async (id,checkbox) => {
        const checkIt = await actions.check_task(id,checkbox)
        if(!checkIt){
        alert("No se pudo actualizar el estado de la tarea");
        return;
        }
        await actions.get_tasks();


  };

    //Actualiza cada renderizado las tareas nuevas
    useEffect(()=>{
        const actualizar = async () => {
            await actions.get_tasks()
        }
        actualizar()
	}, []);
        //verificacion de usuario logueado
        useEffect(() => {
                if (!localStorage.getItem("token")) {
                    navigate('/login')
            }
        }, [])


    return(

        <div className='d-flex justify-content-center'>  

            <div className="card shadow rounded w-75 bg-white">

                <div className="card-header bg-light">
                    <h2 className="text-secondary text-center mb-0">Tareas por hacer</h2>
                </div>

            <div className="card-body">             
                <div className='card-header bg-white'>
                    <input type="text" onChange={(e)=> setText(e.target.value)} onKeyDown={handleEnter} value={text} style={{ border: "none", outline: "none" }}  placeholder='Que hay por hacer?'/>
                </div>

            


            <ul className='list-group list-group-flush'>

                {
                    store.tasks.length > 0 ?(
                        store.tasks.map((task,indx)=> {
                        return(
                            <li className='list-group-item bg-white d-flex flex-row justify-content-between' key={`${task.id}-${indx}`}>
                                <p className='my-1 m-1 text-secondary' >{task.label}</p> 
                                <div>
                                    <button type='button' className="btn btn-sm btn-outline-secondary mx-1" onClick={()=>handleEdit(task.id,task.label)}><i className="fa-solid fa-pencil"></i></button>
                                    <button type='button' className="btn btn-sm btn-outline-danger" onClick={()=>handleDelete(task.id)}><i className="fa-solid fa-trash"></i></button>
                                    <input 
                                        type="checkbox" 
                                        className='ms-1'
                                        checked={task.completed} 
                                        onChange={()=> handleCheckboxChange(task.id, !task.completed)} 
                                        />

                                </div>
                                </li>
                                
                                
                        )
                    })

                    ) : (
                        <li className='list-group-item bg-white'>No hay tareas</li>
                    )
                    
                }

            </ul>


                </div>
        </div>
        </div>

    )
}

export default InputTask