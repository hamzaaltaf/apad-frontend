import React, {useEffect, useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ServerContext } from '../App';

export default function Login() {

    const { isAuthenticated, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const server_url = React.useContext(ServerContext)
    //const server_url = 'http://localhost:8000'
    const api_url = '/auth/v1/users/sign_in'
    const user_id = localStorage.getItem('user_id')
    const [alertInfo, setAlertInfo] = React.useState({ show: false, message: "", type: "" });
    const [form_data, set_form_data] = React.useState({
        'email': "",
        'password':"",
    })

    const [errors, set_errors] = useState({
        'email': "",
        'password': ""
    });

    function handle_change(event) {
        const {name, id, value} = event.target
        set_form_data((prev_data) => {
            return {
                ...prev_data,
                [name]: value
            }
        })

        // Validate inputs
        let error = "";
        if (value.trim() === "") {
            error = `${name.replace("_", " ")} is required.`;
        }
        // since we are maintaining the errors hash too so need to updated errors too.
        // this will not be needed if we decide to show just one string of errors 
        // instead of highlighting each form field with error
        set_errors((prev_errors) => ({
            ...prev_errors,
            [name]: error,
            form: ""
        }));
    }

    function validate_form() {
        let valid = true;
        let new_errors = {};
    
        Object.keys(form_data).forEach((key) => {
          if (form_data[key].trim() === "") {
            new_errors[key] = `${key.replace("_", " ")} is required.`;
            valid = false;
          }
        });
    
        set_errors((prev_errors) => ({
          ...prev_errors,
          ...new_errors
        }));
    
        return valid;
    }

    function login_user(event) {
        event.preventDefault();
        if (validate_form()) {
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
                    setAlertInfo({ show: true, message: response.errors, type: "danger" });
                } else {
                    setAlertInfo({ show: true, message: "Logged in Successfully", type: "success" });
                    login(response.id);
                    if (response.role == "admin"){
                        navigate('/HardwareManage')
                    } else {
                        navigate('/projects')
                    }
                }
            })
        } else {
            set_errors((prev_errors) => ({
                ...prev_errors,
                form: "Please fix the errors."
            }));
        }
    }

    React.useEffect(() => {
        if (user_id) {
            navigate('/projects')
        } else {
            
        }
    })

    return(
        <center>
            <h2>Login Form</h2>
            <div className='container'>
                <div className='row yellow-bg'>
                
                    <form>
                        <div className='col-md-6 col-lg-6 col-sm-6'>
                            <label><strong>Email: </strong></label>
                            <input className='form-control' name='email' id='email' value={form_data.email} onChange={handle_change} />
                            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                        </div>
                        <div className='col-md-6 col-lg-6 col-sm-6'>
                            <label><strong>Password: </strong></label>
                            <input type='password' className='form-control' name='password' id='password' value={form_data.password} onChange={handle_change}/>
                            {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                        </div>
                        <br/>
                        <input className='btn btn-primary' type="submit" onClick={login_user} />
                    </form>
                </div>
            </div>
        </center>
    )
}