import React, {useEffect, useState, useContext} from 'react'
import {Context} from "../store/appContext"
//import { toast } from "react-toastify";
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

    const handleCheckboxChange = async (id,checkbox) => {
        const checkIt = await actions.check_task(id,checkbox)
        if(!checkIt){
        alert("No se pudo actualizar el estado de la tarea");
        return;
        }
        await actions.get_tasks();


  };

    useEffect(()=>{
        const actualizar = async () => {
            await actions.get_tasks()
        }
        actualizar()
	}, []);

        useEffect(() => {
                if (!localStorage.getItem("token")) {
                    navigate('/login')
            }
        }, [])


    return(

        <div>  
            <h1 className='text-secondary text-center titulo'>Tareas por hacer</h1>
            <div className='container card bg-white d-flex flex-column justify-content-center w-50 tarjeta'>               
                <div className='card-header bg-white'>
                    <input type="text" onChange={(e)=> setText(e.target.value)} onKeyDown={handleEnter} value={text} placeholder='Que hay por hacer?'/>
                </div>

            </div>


            <ul className='list-group list-group-flush'>

                {
                    store.tasks.length > 0 ?(
                        store.tasks.map((task,indx)=> {
                        return(
                            <li className='list-group-item bg-white d-flex flex-row justify-content-between' key={`${task.id}-${indx}`}>
                                <p className='my-1 m-1 text-secondary' >{task.label}</p> 
                                <button type='button' onClick={()=>handleEdit(task.id,task.label)}><i className="fa-solid fa-pencil"></i> </button>
                                <button type='button' onClick={()=>handleDelete(task.id)}><i className="fa-solid fa-trash"></i></button>
                                <input 
                                        type="checkbox" 
                                        checked={task.completed} 
                                        onChange={()=> handleCheckboxChange(task.id, !task.completed)} 
                                        />
                            </li>
                        )
                    })

                    ) : (
                        <li className='list-group-item bg-white'>No hay tareas</li>
                    )
                    
                }

            </ul>



        </div>

    )
}

export default InputTask