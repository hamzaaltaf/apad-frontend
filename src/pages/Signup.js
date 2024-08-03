import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {

    const navigate = useNavigate();
    const server_url = 'http://localhost:5000'
    const api_url = '/auth/v1/users/sign_up'
    
    const [form_data, set_form_data] = React.useState(
        {
        'name': "",
        'email': "",
        'password':"",
        'confirm_password': ""
        }
    )

    

    function handle_change(event) {
        const { name, value } = event.target;
        set_form_data((prev_data) => ({
          ...prev_data,
          [name]: value
        }));
    }

    

    function create_user(event) {
        event.preventDefault();
        fetch(`${server_url}/${api_url}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: form_data['email'],
                name: form_data['name'],
                password: form_data['password'],
                confirm_password: form_data['confirm_password']
            })
        }).then(res => {
            if (!res.ok) {
                throw new Error("API has thrown an error")
            }
            alert("Sign up Successfully")
            return res.json()
        }).then(() => {
            // Redirect to the login page
            navigate('/login');
          })
    }

    return(
        <center>
            
            <div className='container'>
                <div className='row yellow-bg'>
                    <h2>Sign Up Form</h2>
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
                            <label><strong>Email: </strong></label>
                            <input className='form-control'
                                name='email'
                                id='email'
                                value={form_data.email}
                                onChange={handle_change}
                            />
                        </div>
                        <div className='col-md-6 col-lg-6 col-sm-6'>
                            <label><strong>Password: </strong></label>
                            <input className='form-control'
                                type='password'
                                name='password'
                                id='password'
                                value={form_data.password} 
                                onChange = {handle_change}
                            />
                        </div>

                        <div className='col-md-6 col-lg-6 col-sm-6'>
                            <label><strong>Confirm Password: </strong></label>
                            <input className='form-control'
                                type='password'
                                name='confirm_password'
                                id='confirm_password'
                                value={form_data.confirm_password}
                                onChange = {handle_change}
                            />
                        </div>
                        <br/>
                        <br/>
                        <input className='btn btn-primary' type="submit" onClick={create_user} onChange = {handle_change}/>
                    </form>
                </div>
            </div>
        </center>
    )
}