import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { ServerContext } from '../App';


const HardwareManager = () => {
    const navigate = useNavigate();
//    const server_url = 'http://localhost:5000';
    const server_url = React.useContext(ServerContext)
    const current_user = localStorage.getItem('user_id'); 
    const [hardwareList, setHardwareList] = useState([]);
    const [hardwareForm, setHardwareForm] = useState({
        name: '',
        capacity: '',
        user: current_user, 
    });
    const [updateForm, setUpdateForm] = useState({
        name: '',
        capacity: '',
        user: current_user,
    });
    const [editingHardware, setEditingHardware] = useState({
        name: '',
        capacity: '',
        user: current_user,
    });
    const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        fetchHardwareList();
    }, []);

    const fetchHardwareList = () => {
        console.log("Fetching hardware list...");
        fetch(`${server_url}/list_sets?user=${current_user}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then((res) => {
                if (!res.ok) {
                    setAlertInfo({ show: true, message: "API failed.", type: "danger" });
                    navigate('/login');
                    
                } else {
                    return res.json()
                }
            })
            .then((data) => {
                if (data.success) {
                    if (data.type_access == "admin"){
                        setHardwareList(data.sets);    
                    }
                    else {
                        navigate('/login');
                    }
                } else {
                    setAlertInfo({ show: true, message: data.errors, type: 'danger' });
                    navigate('/login');
                }
            })
            .catch((error) => {
                console.error('Error fetching hardware:', error);
                setAlertInfo({ show: true, message: `Failed to fetch hardware list: ${error.message}`, type: 'danger' });
            });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setHardwareForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleUpdateInputChange = (event) => {
        const { name, value } = event.target;
        setUpdateForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleCreateHardware = (event) => {
        event.preventDefault();
        fetch(`${server_url}/create_hardware`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(hardwareForm),
        })
            .then((res) => res.json())
            .then((response) => {
                if (response.success) {
                    fetchHardwareList();
                    setHardwareForm({ name: '', capacity: '', user: current_user });
                    setAlertInfo({ show: true, message: 'Hardware created successfully!', type: 'success' });
                } else {
                    setAlertInfo({ show: true, message: response.errors, type: 'danger' });
                }
            });
    };

    const handleEditHardware = (hardware) => {
        setEditingHardware(hardware);
        setUpdateForm({
            name: hardware.name,
            capacity: hardware.capacity,
            user: hardware.user,
        });
    };

    const handleUpdateHardware = (event) => {
        event.preventDefault();
        fetch(`${server_url}/update_hardware`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...updateForm, user: current_user, id: editingHardware._id }),
        })
            .then((res) => res.json())
            .then((response) => {
                if (response.success) {
                    fetchHardwareList();
                    setEditingHardware(null);
                    setUpdateForm({ name: '', capacity: '', user: current_user});
                    setAlertInfo({ show: true, message: 'Hardware updated successfully!', type: 'success' });
                } else {
                    setAlertInfo({ show: true, message: response.errors, type: 'danger' });
                }
            });
    };

    return (
        <div className="container">
            <h1>Hardware Management</h1>
            {alertInfo.show && (
                <div className={`alert alert-${alertInfo.type} alert-dismissible fade show`} role="alert">
                    {alertInfo.message}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}
            <div className="row mb-4">
                <div className="col-md-6">
                    <h2>Create Hardware</h2>
                    <Form onSubmit={handleCreateHardware}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={hardwareForm.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Capacity</Form.Label>
                            <Form.Control
                                type="number"
                                name="capacity"
                                value={hardwareForm.capacity}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Create
                        </Button>
                    </Form>
                </div>

                <div className="col-md-6">
                    <h2>Update Hardware</h2>
                    <Form onSubmit={handleUpdateHardware}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={updateForm.name}
                                onChange={handleUpdateInputChange}
                                required
                                disabled // Disable to prevent changing the key field
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Capacity</Form.Label>
                            <Form.Control
                                type="number"
                                name="capacity"
                                value={updateForm.capacity}
                                onChange={handleUpdateInputChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="warning" type="submit" disabled={!editingHardware}>
                            Update
                        </Button>
                        {editingHardware && (
                            <Button variant="secondary" onClick={() => setEditingHardware(null)} className="ms-2">
                                Cancel
                            </Button>
                        )}
                    </Form>
                </div>
            </div>

            <div className="row">
                <h2>Existing Hardware</h2>
                {hardwareList.length > 0 ? (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Capacity</th>
                                <th>Availability</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hardwareList.map((hardware) => (
                                <tr key={hardware.name}>
                                    <td>{hardware.name}</td>
                                    <td>{hardware.capacity}</td>
                                    <td>{hardware.availability}</td>
                                    <td>
                                        <Button variant="warning" onClick={() => handleEditHardware(hardware)}>
                                            Edit
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hardware available</p>
                )}
            </div>
        </div>
    );
};

export default HardwareManager;
