import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {

    
    const navigate = useNavigate();
    const server_url = 'http://localhost:5000'
    const api_url = '/auth/v1/users/sign_in'
    const [form_data, set_form_data] = React.useState({
        'email': "",
        'password':"",
    })

    function handle_change(event) {
        const {name, id, value} = event.target
        set_form_data((prev_data) => {
            return {
                ...prev_data,
                [name]: value
            }
        })
    }

    function login_user(event) {
        event.preventDefault();
        fetch(`${server_url}/${api_url}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: form_data['email'],
                password: form_data['password'],
            })
        }).then(res => {
            if (!res.ok) {
                throw new Error("API has thrown an error")
            }
            return res.json()
        }).then(response => {
            if (response.success == false) {
                alert("Logged in failed")
            } else {
                alert("Logged in Successfully")
                localStorage.setItem('user_id', response.id);
                // Redirect to the login page
                navigate('/projects');
            }
        })
    }

    return(
        <center>
            <h2>Login Form</h2>
            <div className='container'>
                <div className='row yellow-bg'>
                
                    <form>
                        <div className='col-md-6 col-lg-6 col-sm-6'>
                            <label><strong>Email: </strong></label>
                            <input className='form-control' name='email' id='email' value={form_data.email} onChange={handle_change} />
                        </div>
                        <div className='col-md-6 col-lg-6 col-sm-6'>
                            <label><strong>Password: </strong></label>
                            <input type='password' className='form-control' name='password' id='password' value={form_data.password} onChange={handle_change}/>
                        </div>
                        <br/>
                        <input className='btn btn-primary' type="submit" onClick={login_user} />
                    </form>
                </div>
            </div>
        </center>
    )
}