import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../App.css';
import { Button, Col, Row, Container, Form, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsWhatsapp } from 'react-icons/bs';
import { FiPhone } from 'react-icons/fi';
import Loading from './loading';

function Customers() {
    const [customersList, setCustomersList] = useState();
    const [name, setName] = useState();
    const [phone, setPhone] = useState();
    const [updateId, setUpdateId] = useState();
    const [updateName, setUpdateName] = useState();
    const [updatePhone, setUpdatePhone] = useState();
    const [modalCreate, setModalCreate] = useState(false);
    const [modalUpdate, setModalUpdate] = useState(false);
    const [loadCustomers, setLadCustomers] = useState(0);

    const createClose = () => setModalCreate(false);
    const updateClose = () => setModalUpdate(false);
    const createShow = () => setModalCreate(true);
    const updateShow = () => setModalUpdate(true);
    const navigate = useNavigate();

    //מביא את הגדרות העסק
    useEffect(() => {
        axios.get('https://easy-tor-server.onrender.com/customers', { withCredentials: true })
            .then(function (response) {
                setCustomersList(response.data)
            })
            .catch(function (error) {
                if (error.response.status == 401) { navigate("/login") }
                console.log(error);
            })
    }, [loadCustomers]);

    const update = (customer_id) => {
        const customerUpdate = customersList.filter(customer => customer._id == customer_id);
        setUpdateId(customer_id);
        setUpdateName(customerUpdate[0].name);
        setUpdatePhone(customerUpdate[0].phone);
        updateShow();
    }

    const createCustomer = () => {
        if (name && phone) {
            if (/^\d{10}$/.test(phone)) {
                axios.post('https://easy-tor-server.onrender.com/createCustomer', {
                    name: name,
                    phone: phone,
                }, { withCredentials: true })
                    .then(function () {
                        setLadCustomers(loadCustomers + 1);
                        createClose();
                        toast.success("הלקוח נוסף בהצלחה");
                    })
                    .catch(function (error) {
                        if (error.response.status == 401) { navigate("/login") }
                        console.log(error);
                    })
            }
            else {
                toast.error("מספר הטלפון לא תקין");
            }
        }
        else {
            toast.error("יש למלא את כל השדות");
        }
    }

    const updateCustomer = () => {
        if (updateName && updatePhone) {
            if (/^\d{10}$/.test(updatePhone)) {
                axios.post('https://easy-tor-server.onrender.com/updateCustomer', {
                    id: updateId,
                    name: updateName,
                    phone: updatePhone,
                }, { withCredentials: true })
                    .then(function () {
                        setLadCustomers(loadCustomers + 1);
                        updateClose();
                        toast.success("הלקוח עודכן בהצלחה");
                    })
                    .catch(function (error) {
                        if (error.response.status == 401) { navigate("/login") }
                        console.log(error);
                    })
            }
            else {
                toast.error("מספר הטלפון לא תקין");
            }
        }
        else {
            toast.error("יש למלא את כל השדות");
        }
    }

    const deleteCustomer = () => {
        axios.post('https://easy-tor-server.onrender.com/deleteCustomer', {
            id: updateId
        }, { withCredentials: true })
            .then(function () {
                setLadCustomers(loadCustomers + 1);
                updateClose();
                toast.success("הלקוח נמחק בהצלחה");
            })
            .catch(function (error) {
                if (error.response.status == 401) { navigate("/login") }
                console.log(error);
            })
    }

    //פורמט של קישור לטלפון
    const phonelink = (customer_phone) => { return ('tel:' + customer_phone) };
    //פורמט של קישור לוואטצאפ
    const whatsapp = (customer_whatsapp) => {
        let whatsapp_slice = customer_whatsapp.slice(1);
        return ('https://wa.me/972' + whatsapp_slice)
    };


    return (
        <div className="Customers">
            <Container>
                <Row className="justify-content-md-center">
                    <Col lg={2}></Col>
                    <Col lg={8}>
                        <div className='tytle'>לקוחות</div>
                        <Row className="justify-content-md-center">
                            <Col lg={1}></Col>
                            <Col lg={10}>
                                <div className='div_button_createServices'>
                                    <Button className='button_classic' onClick={createShow}>צור לקוח</Button></div>
                                {customersList ? <div>
                                    {customersList.length != 0 ?
                                        <div className='dashboard_event'>
                                            {customersList.map((customer, index) => (
                                                <div key={index} className='dashboard_div_services'>
                                                    <Row>
                                                        <Col lg={8} xs={5}>
                                                            <div className='services_name'>{customer.name}</div>
                                                            <div>{customer.phone}</div>
                                                        </Col>

                                                        <Col lg={1} xs={2}>
                                                            <div className='div_events_link'>
                                                                <a href={phonelink(customer.phone)} className='events_link'>
                                                                    <FiPhone className='schedule_link_text' /></a>
                                                            </div>
                                                        </Col>
                                                        <Col lg={1} xs={2}>
                                                            <div className='div_events_link'>
                                                                <a href={whatsapp(customer.phone)} className='events_link'>
                                                                    <BsWhatsapp className='schedule_link_text' /></a>
                                                            </div>
                                                        </Col>
                                                        <Col lg={2} xs={2}>
                                                            <div className='div_button_services'>
                                                                <Button className='button_outline' onClick={() => update(customer._id)}>עדכן</Button>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            ))}
                                        </div>
                                        : <div className='list_empty'>אין עדיין לקוחות, לחץ על צור לקוח</div>}
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
                    <Modal.Title>הוספת לקוח</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control type="text" placeholder="שם הלקוח" onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control type="text" placeholder="טלפון (0500000000)" onChange={(e) => setPhone(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='button_outline' onClick={createClose}>ביטול</Button>
                    <Button className='button_classic' onClick={createCustomer}>שמירה</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={modalUpdate} onHide={updateClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>עריכת לקוח</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>שם הלקוח</Form.Label>
                            <Form.Control type="text" value={updateName} onChange={(e) => setUpdateName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>טלפון</Form.Label>
                            <Form.Control type="tel" value={updatePhone} onChange={(e) => setUpdatePhone(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <div className='d-grid'>
                                <Button className='button_delete' onClick={deleteCustomer}>מחק לקוח</Button>
                                <div className='text_delete'>מוחק גם את התורים שנקבעו ללקוח זה!</div>
                            </div>

                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='button_outline' onClick={updateClose}>ביטול</Button>
                    <Button className='button_classic' onClick={updateCustomer}>שמירה</Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false}
                closeOnClick rtl={true} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </div>);
}

export default Customers;