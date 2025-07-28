import React, {useEffect, useState, useContext} from 'react'
import {Context} from "../store/appContext"
//import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const InputTask = ()=>{

    const {store,actions} = useContext(Context)
    const [text, setText] = useState("")
    //const [list, setList] = useState(store.tasks)
    


    const handleEnter = async (e) =>{

       if(e.key === 'Enter' && text != ""){
        const addTask = await actions.add_task(text)

        if (!addTask){
            alert("Ocurrio un problema al agregar la tarea")
            return;
        }

        setText("");
        await actions.get_tasks()
       }
    }


    const handleDelete = async (index) => {

        const borrarTask = await actions.delete_task(index)

        if (!borrarTask){
            alert("Ha ocurrido un error al borrar la tarea")
            return;
        }

        await actions.get_tasks()
    }

    	useEffect(()=>{
		actions.get_tasks()
			
	}, []);


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
                    store.tasks.map((task,indx)=> {
                        return(
                            <li className='list-group-item bg-white d-flex flex-row justify-content-between' key={task.id}>

                                <p className='my-1 m-1 text-secondary' >{task.label}</p> 

                                <button type='button' onClick={()=>handleDelete(task.id)}><i className="fa-solid fa-trash"></i></button>

                            </li>
                        )
                    })
                }

            </ul>



        </div>

    )
}

export default InputTask