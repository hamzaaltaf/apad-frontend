import React from 'react';

export default function Login() {

    const [form_data, set_form_data] = React.useState({
        'name': "",
        'email': "",
        'password':"",
        'confirm_password': ""
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

    function create_user() {
        
    }

    return(
        <center>
            <h2>Sign Up Form</h2>
            <div className='container'>
                <div className='row yellow-bg'>
                
                    <form>
                        <div className='col-md-6 col-lg-6 col-sm-6'>
                            <label><strong>Name: </strong></label>
                            <input className='form-control' name='name' id='email' value={handle_change}></input>
                        </div>
                        <div className='col-md-6 col-lg-6 col-sm-6'>
                            <label><strong>Email: </strong></label>
                            <input className='form-control' name='email' id='email' value={handle_change}></input>
                        </div>
                        <div className='col-md-6 col-lg-6 col-sm-6'>
                            <label><strong>Email: </strong></label>
                            <input className='form-control' name='email' id='email' value={handle_change}></input>
                        </div>

                        <input type="submit" onClick={create_user}>Sign Up</input>
                    </form>
                </div>
            </div>
        </center>
    )
}