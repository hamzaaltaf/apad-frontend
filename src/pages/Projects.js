import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { ServerContext } from '../App';


export default function Projects() {
    const navigate = useNavigate();
    // const server_url = 'http://localhost:5000/'
    const server_url = React.useContext(ServerContext)
    const user_id = localStorage.getItem('user_id')
    const api_url = `users/create_project`
    const [projects, set_projects] = React.useState([])
    const [project_created, set_project_created] = React.useState(false)
    const [join_project_form, set_join_project_form] = React.useState({
        'project_id': ""
    })
    const [form_data, set_form_data] = React.useState(
        {
        'name': "",
        'description': "",
        'projectId':"",
        }
    )
    // In order to show error and success messages
    const [alertInfo, setAlertInfo] = React.useState({ show: false, message: "", type: "" });

    

    function handle_change(event) {
        const { name, value } = event.target;
        const form = event.target
        set_form_data((prev_data) => ({
          ...prev_data,
          [name]: value
        }));
    };

    function handle_change_for_join_project(event) {
        const { name, value } = event.target;
        const form = event.target
        set_join_project_form((prev_data) => ({
          ...prev_data,
          [name]: value
        }));
    }



    React.useEffect(() => {
        if (!user_id) {
            navigate('/login')
        } else {
            fetch(`${server_url}/users/list_projects`, {
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
                    setAlertInfo({ show: true, message: "API failed.", type: "danger" });
                    navigate('/login');
                    
                } else {
                    return res.json()
                }
            }).then((res) => {
                if (res && (res.success == true)) {
                    set_projects((prev_projects) => res.projects)
                } else {
                    setAlertInfo({ show: true, message: res.errors, type: "danger" });
                }
            })
        }
        
    }, [project_created])
    

    // Join a project using a project ID.
    function join_project(event) {
        event.preventDefault();
        const form = event.target
        fetch(`${server_url}/projects/join_project`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                project_id: join_project_form['project_id'],
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
                setAlertInfo({ show: true, message: response.errors, type: "danger" });
            } else {
                set_project_created(prev_created => !project_created)
                
            }
        })
    }
    
    function create_project(event) {
        event.preventDefault();
        const form = event.target
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
        
            
            <div className='container'>
            {alertInfo.show && (
                    <div className={`alert alert-${alertInfo.type} alert-dismissible fade show`} role="alert">
                    {alertInfo.message}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}
                <div className='row yellow-bg'>

                    <div className='col-md-6 col-lg-6 col-xs-6'>
                        <h2>Create a new project</h2>
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
                    <div className='col-md-6 col-lg-6 col-xs-6'>
                        <h2>Join Project</h2>
                        <form>
                            <div className='col-md-6 col-lg-6 col-sm-6'>
                                <label><strong>Project ID: </strong></label>
                                <input 
                                    className='form-control' 
                                    name='project_id'
                                    id='project_id'
                                    value={join_project_form.project_id}
                                    onChange = {handle_change_for_join_project}
                                />
                                <br/>
                            <input className='btn btn-warning' type="submit" onClick={join_project} onChange = {handle_change_for_join_project}/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        
        <div className='container'>
            <div className='row'>
                <h1>Projects</h1>
                {projects.length > 0 ? (
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>T.Checked Out</th>
                                <th>T.Checked In</th>
                                <th>Pending</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(project => (
                                <tr key={project.pid}>
                                    <td>{project.pid}</td>
                                    <td>{project.name}</td>
                                    <td>{project.total_checked_out}</td>
                                    <td>{project.total_checked_in}</td>
                                    <td>{project.total_checked_out - project.total_checked_in}</td>
                                    <td>{project.description}</td>
                                    <td>
                                        <Link to={`/project/${project.pid}/members`} className='btn btn-warning'>Members</Link>
                                        <Link to={`/project/${project.pid}/${'check_in'}`} className='btn btn-danger'>Check In</Link>
                                        <Link to={`/project/${project.pid}/${'check_out'}`} className='btn btn-primary'>Check Out</Link>
                                        <Link to={`/project/${project.pid}/transactions`} className='btn btn-success'>Transactions</Link>
                                    </td>
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
