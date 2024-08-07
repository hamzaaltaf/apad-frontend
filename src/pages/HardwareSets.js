import React, { useEffect, useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ServerContext } from '../App';

export default function HardwareSets() {
    const params = useParams()
    const navigate = useNavigate();
    const [alert, setAlert] = React.useState({ show: false, message: "", type: "" });
    const user_id = localStorage.getItem('user_id')
    const [hardware_sets, set_hardware_sets] = React.useState([])
    const server_url = React.useContext(ServerContext)

    React.useEffect(() => {
        // add the if user_id not found redirect to the login page
        fetch(`${server_url}/list_sets`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (!res.ok) {
                alert("Request failed")
            } else {
                return res.json()
            }
        }).then((res) => {
            if (res && (res.success == true)) {
                set_hardware_sets((prev_sets) => res.sets)
                if (hardware_sets.length > 0) {
                    form_data['hardware_id'] = hardware_sets[0].id
                }
                console.log(form_data)
            } else {
                setAlert({ show: true, message: res.errors, type: "danger" });
            }
        })
        }, [])

        /** Code related to check out form */
        const [form_data, set_form_data] = React.useState({
            'quantity': "",
            'hardware_id': ""
        })
    
        function handle_change(event) {
            const {name, id, value} = event.target
            console.log(form_data)
            set_form_data((prev_data) => {
                return {
                    ...prev_data,
                    [name]: value
                }
            })
        }
    
        function check_in(event) {
            event.preventDefault();
            fetch(`${server_url}/sets/checkin`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    hardware_id: form_data['hardware_id'],
                    user_id: user_id,
                    quantity: form_data['quantity'],
                    project_id: params.id
                })
            }).then(res => {
                if (!res.ok) {
                    throw new Error("API has thrown an error")
                }
                return res.json()
            }).then(response => {
                if (response.success == false) {
                    setAlert({ show: true, message: response.errors, type: "danger" });
                } else {
                    setAlert({ show: true, message: 'Item checked in successfully', type: "success" });
                }
            })
        }

        function check_out(event) {
            event.preventDefault();
            fetch(`${server_url}/sets/checkout`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    hardware_id: form_data['hardware_id'],
                    user_id: user_id,
                    quantity: form_data['quantity'],
                    project_id: params.id
                })
            }).then(res => {
                if (!res.ok) {
                    throw new Error("API has thrown an error")
                }
                return res.json()
            }).then(response => {
                if (response.success == false) {
                    setAlert({ show: true, message: response.errors, type: "danger" });
                } else {
                    setAlert({ show: true, message: 'Item checked out successfully', type: "success" });
                }
            })
        }

        return(
            <div className='container'>
                {alert.show && (
                    <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                    {alert.message}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}
                <br/><br/>
                <div className='row'>
                    <br/>
                    <div className='pull-left'>
                        <Link to='/projects' className='btn btn-danger'>Back to Projects</Link>
                    </div>
                </div>
                

                <div className='row'>
                    <br/>
                    <h1>Rent Hardware Sets</h1>
                    <br/>
                    {hardware_sets.length > 0 ? (
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Capacity</th>
                                    <th>Availability</th>
                                    <th>Checked Out</th>
                                    <th>Checked In</th>
                                    <th>Remaining</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {hardware_sets.map(set => (
                                    <tr key={set.id}>
                                        <td>{set.name}</td>
                                        <td>{set.capacity}</td>
                                        <td>{set.availability}</td>
                                        <td>{set.checked_out}</td>
                                        <td>{set.checked_in}</td>
                                        <td>{set.capacity - set.checked_out}</td>
                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No members available</p>
                    )}
                </div>
                <br/>
                <br/>
                <form>
                <center>
                    <h2>{params.action_type == 'check_in' ? 'Check In Form' : 'Check Out Form'}</h2>
                </center>
                <div className='col-md-6 col-lg-6 col-sm-6'>
                        <label><strong>Hardware ID: </strong></label>
                        <select
                        className='form-control'
                        name='hardware_id'
                        id='hardware_id'
                        value={form_data.hardware_id}
                        onChange={handle_change}
                        >
                        <option value="">
                                Select Set
                        </option>
                        {hardware_sets.map((set) => (
                            <option key={set.id} value={set.id}>
                                {set.name}
                            </option>
                        ))}
                        </select>
                    </div>
                    
                    <div className='col-md-6 col-lg-6 col-sm-6'>
                        <label><strong>Quantity: </strong></label>
                        <input className='form-control' type='number' min="1" name='quantity' id='quantity' value={form_data.quantity} onChange={handle_change} />
                    </div>
                    
                    <br/>
                    {params.action_type == 'check_in' ? <input className='btn btn-primary' type="submit" onClick={check_in} /> : <input className='btn btn-primary' type="submit" onClick={check_out} />}
                    
                </form>
            </div>
        )
}