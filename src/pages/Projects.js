import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from '../components/Card'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function Projects() {
    const navigate = useNavigate();
    const server_url = 'http://localhost:5000/'
    const user_id = localStorage.getItem('user_id')
    const api_url = `users/create_project`
    const [projects, set_projects] = React.useState([])
    const [project_created, set_project_created] = React.useState(false)
    
    const [form_data, set_form_data] = React.useState(
        {
        'name': "",
        'description': "",
        'projectId':"",
        }
    )

    

    function handle_change(event) {
        const { name, value } = event.target;
        const form = event.target
        set_form_data((prev_data) => ({
          ...prev_data,
          [name]: value
        }));
    };

    React.useEffect(() => {
        fetch('http://localhost:5000/users/list_projects', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id
            })
        })
        .then(res => {
            if (!res.ok) {
                alert("Request failed")
            } else {
                return res.json()
            }
        }).then((res) => {
            if (res && (res.success == true)) {
                set_projects((prev_projects) => res.projects)
                // console.log("here are projects", projects)
            } else {
                alert("Request failed")
            }
        })
    }, [project_created])
    

    function create_project(event) {
        event.preventDefault();
        const form = event.target
        alert('Username', form.name.value)
        fetch(`${server_url}/${api_url}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: form_data['name'],
                description: form_data['description'],
                project_id: form_data['projectId'],
                user_id: user_id
            })
        }).then(res => {
            if (!res.ok) {
                throw new Error("API has thrown an error")
            }
            return res.json()
        }).then((response) => {
            console.log(response)
            if (response.success == false) {
                alert("Project creation failed")    
            } else {
                set_project_created(prev_created => !project_created)
                // navigate('/login');
            }
          })
    }

    return(
        <div>
        <center>
            <h2>Create a new project</h2>
            <div className='container'>
                <div className='row yellow-bg'>
                
                    <form>
                        <div className='col-md-6 col-lg-6 col-sm-6'>
                            <label><strong>Name: </strong></label>
                            <input 
                                className='form-control' 
                                name='name'
                                id='name'
                                value={form_data.name}
                                onChange = {handle_change} 
                            />
                        </div>

                        <div className='col-md-6 col-lg-6 col-sm-6'>
                            <label><strong>Description: </strong></label>
                            <input className='form-control'
                                name='description'
                                id='description'
                                value={form_data.description}
                                onChange={handle_change}
                            />
                        </div>
                        <div className='col-md-6 col-lg-6 col-sm-6'>
                            <label><strong>Project ID: </strong></label>
                            <input className='form-control'
                                type='text'
                                name='projectId'
                                id='projectId'
                                value={form_data.projectId} 
                                onChange = {handle_change}
                            />
                        </div>
                        <br/>
                        <input className='btn btn-primary' type="submit" onClick={create_project} onChange = {handle_change}/>
                    </form>
                </div>
            </div>
        </center>
        <div className='container'>
            <div className='row'>
                <h1>Projects</h1>
                {projects.length > 1 ? (
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(project => (
                                <tr key={project.pid}>
                                    <td>{project.pid}</td>
                                    <td>{project.name}</td>
                                    <td>{project.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No projects available</p>
                )}

            </div>
        </div>
        </div>
    )
}
