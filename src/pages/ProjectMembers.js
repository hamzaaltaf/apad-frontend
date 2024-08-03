import React, { useEffect, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ServerContext } from '../App';

export default function ProjectMembers() {
    const params = useParams()
    const user_id = localStorage.getItem('user_id')
    const [members, set_members] = React.useState([])
    const [project, set_project] = React.useState({})
    const server_url = React.useContext(ServerContext)

    React.useEffect(() => {
        fetch(`${server_url}/projects/members`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                project_id: params.id,
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
                set_members((prev_members) => res.members)
                set_project((prev_project) => res.project)
                // console.log("here are projects", projects)
            } else {
                alert("Request failed")
            }
        })
        }, [])


    return(
        <div className='container'>
            <br/><br/>
            <div className='row'>
                <br/>
                <div className='pull-left'>
                    <Link to='/projects' className='btn btn-danger'>Back to Projects</Link>
                </div>
            </div>
            <div className='row'>
                <br/>
                <h1>{project.name} Members</h1>
                <br/>
                {members.length > 0 ? (
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map(member => (
                                <tr key={member.user_id}>
                                    <td>{member.user_id}</td>
                                    <td>{member.user_email}</td>
                                    <td>{member.created_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No members available</p>
                )}
            </div>
        </div>
    )
}