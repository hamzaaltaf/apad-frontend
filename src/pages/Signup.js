import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { ServerContext } from '../App';

export default function Signup() {

    const user_id = localStorage.getItem('user_id')
    const navigate = useNavigate();
    const server_url = React.useContext(ServerContext)
    const api_url = '/auth/v1/users/sign_up'
    const [alertInfo, setAlertInfo] = React.useState({ show: false, message: "", type: "" });
    const [form_data, set_form_data] = React.useState(
        {
            'name': "",
            'email': "",
            'password':"",
            'confirm_password': ""
        }
    )

    const [errors, set_errors] = useState({
            'name': "",
            'email': "",
            'password': "",
            'confirm_password': "",
            'form': ""
        }
    );

    // adding this hook to check if user is already logged in then take user to projects page
    React.useEffect(() => {
        if (user_id) {
            navigate('/projects')
        } else {
            
        }
    });

    function handle_change(event) {
        // update the form object with data entered by the user
        const { name, value } = event.target;
        set_form_data((prev_data) => ({
          ...prev_data,
          [name]: value
        }));

        // Validate inputs
        let error = "";
        if (value.trim() === "") {
            error = `${name.replace("_", " ")} is required.`;
        } else if (name === "confirm_password" && value !== form_data.password) {
            error = "Passwords do not match.";
        } else if (name === "password" && form_data.confirm_password && value !== form_data.confirm_password) {
            error = "Passwords do not match.";
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
    
        if (form_data.password !== form_data.confirm_password) {
          new_errors.password = "Passwords do not match.";
          new_errors.confirm_password = "Passwords do not match.";
          valid = false;
        }
    
        set_errors((prev_errors) => ({
          ...prev_errors,
          ...new_errors
        }));
    
        return valid;
    }

    

    function create_user(event) {
        event.preventDefault();
        if (validate_form()) {
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
                }else {
                    return res.json()
                }
            }).then((res) => {
                if (res && (res.success == true)) {
                    setAlertInfo({ show: true, message: "Signed up successfully", type: "success" });
                    localStorage.setItem('user_id', res.id)
                    navigate('/projects')
                } else {
                    setAlertInfo({ show: true, message: res.errors, type: "danger" });
                }
            })
        } else {
            set_errors((prev_errors) => ({
                ...prev_errors,
                form: "Please fix the errors."
            }));
        }
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
                            {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                        </div>

                        <div className='col-md-6 col-lg-6 col-sm-6'>
                            <label><strong>Email: </strong></label>
                            <input className='form-control'
                                name='email'
                                id='email'
                                value={form_data.email}
                                onChange={handle_change}
                            />
                            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
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
                            {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
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
                            {errors.confirm_password && <p style={{ color: 'red' }}>{errors.confirm_password}</p>}
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