import React, { useEffect, useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ServerContext } from '../App';

export default function Transactions() {

    const params = useParams()
    const navigate = useNavigate();
    const [alert, setAlert] = React.useState({ show: false, message: "", type: "" });
    const user_id = localStorage.getItem('user_id')
    const [transactions, set_transactions] = React.useState([])
    const server_url = React.useContext(ServerContext)

    React.useEffect(() => {
        // add the if user_id not found redirect to the login page
        fetch(`${server_url}/sets/list_transactions`, {
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
                set_transactions((prev_transactions) => res.transactions)
            } else {
                setAlert({ show: true, message: res.errors, type: "danger" });
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
                    
                    {transactions.length > 0 ? (
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Requested Qty</th>
                                    <th>Approved Qty</th>
                                    <th>Peformed By</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(member => (
                                    <tr className={member.event_type == 'checkin' ? 'bg-success' : 'bg-warning'} key={member.id}>
                                        {member.event_type == 'checkin' ? <td className='check_in'>Check In</td> : <td className='check_out'>Check Out</td>}
                                        <td>{member.requested_qty}</td>
                                        <td>{member.approved_qty}</td>
                                        <td>{member.user_email}</td>
                                        <td>{member.created_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No transactions available</p>
                    )}
                </div>
            </div>
        )
}