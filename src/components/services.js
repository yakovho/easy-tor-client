import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../App.css';
import { Button, Col, Row, Container, Form, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './loading';

function Services() {
    const [servicesList, setServicesList] = useState();
    const [name, setName] = useState();
    const [time, setTime] = useState(30);
    const [price, setPrice] = useState();
    const [updateId, setUpdateId] = useState();
    const [updateName, setUpdateName] = useState();
    const [updateTime, setUpdateTime] = useState();
    const [updatePrice, setUpdatePrice] = useState();
    const [modalCreate, setModalCreate] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);
    const [loadServices, setLadServices] = useState(0);

    const createClose = () => setModalCreate(false);
    const updateClose = () => setModalUpdate(false);
    const createShow = () => setModalCreate(true);
    const updateShow = () => setModalUpdate(true);
    const navigate = useNavigate();

    //מביא את הגדרות העסק
    useEffect(() => {
        axios.get('https://easy-tor-server.onrender.com/services', { withCredentials: true })
            .then(function (response) {
                setServicesList(response.data);
            })
            .catch(function (error) {
                if (error.response.status == 401) { navigate("/login") }
                console.log(error);
            })
    }, [loadServices]);

    const update = (service_id) => {
        const serviceUpdate = servicesList.filter(service => service._id == service_id);
        setUpdateId(service_id);
        setUpdateName(serviceUpdate[0].name);
        setUpdateTime(serviceUpdate[0].time);
        setUpdatePrice(serviceUpdate[0].price);
        updateShow();
    }

    const createService = () => {
        if (name && time && price) {
            axios.post('https://easy-tor-server.onrender.com/createServices', {
                name: name,
                time: time,
                price: price,
            }, { withCredentials: true })
                .then(function () {
                    setLadServices(loadServices + 1);
                    createClose();
                    toast.success("השירות נוסף בהצלחה");
                })
                .catch(function (error) {
                    if (error.response.status == 401) { navigate("/login") }
                    console.log(error);
                })
        }
        else {
            toast.error("יש למלא את כל השדות");
        }
    }

    const updateService = () => {
        if (updateName && updateTime && updatePrice) {
            axios.post('https://easy-tor-server.onrender.com/updateServices', {
                id: updateId,
                name: updateName,
                time: updateTime,
                price: updatePrice,
            }, { withCredentials: true })
                .then(function () {
                    setLadServices(loadServices + 1);
                    updateClose();
                    toast.success("השירות עודכן בהצלחה");
                })
                .catch(function (error) {
                    if (error.response.status == 401) { navigate("/login") }
                    console.log(error);
                })
        }
        else {
            toast.error("יש למלא את כל השדות");
        }
    }

    const deleteService = () => {
        axios.post('https://easy-tor-server.onrender.com/deleteServices', {
            id: updateId
        }, { withCredentials: true })
            .then(function () {
                setLadServices(loadServices + 1);
                updateClose();
                toast.success("השירות נמחק בהצלחה");
            })
            .catch(function (error) {
                if (error.response.status == 401) { navigate("/login") }
                console.log(error);
            })
    }

    const optionsFormat = [];
    for (let i = 5; i < 300; i += 5) {
        optionsFormat.push({ date: i });
    }

    const options = optionsFormat.map((option, index) => (
        <option key={index} value={option.date}>
            {option.date} דקות
        </option>
    ))

    return (
        <div className="Services">
            <Container>
                <Row className="justify-content-md-center">
                    <Col lg={2}></Col>
                    <Col lg={8}>
                        <div className='tytle'>שירותים</div>
                        <Row className="justify-content-md-center">
                            <Col lg={1}></Col>
                            <Col lg={10}>
                                <div className='div_button_createServices'>
                                    <Button className='button_classic' onClick={createShow}>צור שירות</Button></div>
                                {servicesList ? <div>
                                    {servicesList.length != 0 ?
                                        <div className='dashboard_event'>
                                            {servicesList.map((service, index) => (
                                                <div key={index} className='dashboard_div_services'>
                                                    <Row>
                                                        <Col xs={9}>
                                                            <div className='services_name'>{service.name}</div>
                                                            <div>{service.time} דק' , ₪{service.price}</div>
                                                        </Col>
                                                        <Col xs={3}>
                                                            <div className='div_button_services'>
                                                                <Button className='button_outline' onClick={() => update(service._id)}>עדכן</Button>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            ))}
                                        </div>
                                        : <div className='list_empty'>אין עדיין שירותים, לחץ על צור שירות</div>}
                                </div>
                                    : <div className='margin_loading'><Loading /></div>}
                            </Col>
                            <Col lg={1}></Col>
                        </Row>
                    </Col>
                    <Col lg={2}></Col>
                </Row>
            </Container>

            <Modal show={modalCreate} onHide={createClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>הוספת שירות</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control type="text" placeholder="שם השירות" onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Select size="sm" defaultValue={time} onChange={(e) => { setTime(e.target.value); }}>{options}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control type="email" placeholder="מחיר השירות הינו" onChange={(e) => setPrice(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='button_outline' onClick={createClose}>ביטול</Button>
                    <Button className='button_classic' onClick={createService}>שמירה</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={modalUpdate} onHide={updateClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>עריכת שירות</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>שם השירות</Form.Label>
                            <Form.Control type="text" value={updateName} onChange={(e) => setUpdateName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>משך השירות</Form.Label>
                            <Form.Control type="text" value={updateTime} onChange={(e) => setUpdateTime(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>מחיר השירות הינו</Form.Label>
                            <Form.Control type="email" value={updatePrice} onChange={(e) => setUpdatePrice(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <div className='d-grid'>
                                <Button className='button_delete' onClick={deleteService}>מחק שירות</Button>
                                <div className='text_delete'>מוחק גם את התורים שנקבעו לשירות זה!</div>
                            </div>

                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='button_outline' onClick={updateClose}>ביטול</Button>
                    <Button className='button_classic' onClick={updateService}>שמירה</Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false}
                closeOnClick rtl={true} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </div>);
}

export default Services;