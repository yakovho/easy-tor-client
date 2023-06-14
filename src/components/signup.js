import React, { useState} from 'react';
import '../App.css';
import axios from 'axios';
import { Card, Button, Col, Row, Container, Form, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, Link } from "react-router-dom";
import Swal from 'sweetalert2'


function Signup() {
    const [name, setName] = useState();
    const [businessName, setBusinessName] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [sms_token, setSms_token] = useState();
    const [modalSms, setModalSms] = useState(false);

    const smsClose = () => setModalSms(false);
    const smsShow = () => setModalSms(true);

    const navigate = useNavigate();

    const submit = () => {
        if (name && businessName && email && phone) {
            if (/^\d{10}$/.test(phone)) {
                axios({
                    method: 'post',
                    url: 'https://easy-tor-server.onrender.com/signup',
                    data: {
                        name: name,
                        business_name: businessName,
                        email: email,
                        phone: phone
                    }, withCredentials: true
                })
                    .then((response) => {
                        if (response.status == 200) {
                            smsShow();
                        }
                    })
                    .catch((error) => {
                        if (error.response.status == 401) {
                            toast.error("המייל / הטלפון כבר קיימים במערכת");
                            console.log(error);
                        }
                    })
            }
            else {
                toast.error("מספר הטלפון לא תקין");
            }
        }
        else {
            toast.error("יש למלא את כל השדות");
        }
    };

    const submitCode = () => {
        if (name && businessName && email && phone && sms_token) {
            axios({
                method: 'post',
                url: 'https://easy-tor-server.onrender.com/signup_auth',
                data: {
                    name: name,
                    business_name: businessName,
                    email: email,
                    phone: phone,
                    sms_token: sms_token
                }, withCredentials: true
            })
                .then((response) => {
                    if (response.status == 200) {
                        Swal.fire({
                            title: "איזה כיף! העסק הוקם בהצלחה",
                            text: "כעת הגדירו שעות פעילות, הקימו שירותים ושלחו את הלינק ללקוחות",
                            icon: 'success',
                            confirmButtonText: 'יאלה אש!!',
                            confirmButtonColor: '#10b981'
                        })
                        navigate("/");
                    }
                })
                .catch((error) => {
                    if (error.response.status == 401) {
                        toast.error("קוד האימות שגוי נסו שנית");
                        console.log(error);
                    }
                })
        }
        else {
            toast.error("יש למלא את כל השדות");
        }
    };

    return (
        <div className='Signup'>
            <Container>
                <Row className="justify-content-md-center">
                    <Col sm={4}></Col>
                    <Col sm={4}>
                        <Card>
                            <Card.Body>
                                <Form>
                                    <div className='signup_tytle'>הצטרפו למהפכה</div>
                                    <Form.Group className="mb-3">
                                        <Form.Control type="text" placeholder="שם מלא" onChange={(e) => setName(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Control type="text" placeholder="שם העסק" onChange={(e) => setBusinessName(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Control type="email" placeholder="המייל שלך" onChange={(e) => setEmail(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Control type="phone" placeholder="הטלפון שלך (0500000000)" onChange={(e) => setPhone(e.target.value)} />
                                    </Form.Group>
                                    <div className='d-grid'>
                                        <Button className='button_classic' onClick={submit}>הירשם</Button>
                                    </div>
                                    <div className='div_signup_link'>
                                        <div>כבר יש לך חשבון? </div>
                                        <Link to="/login" className='signup_link'><div className='div_signup_text'>לחץ להתחברות</div></Link>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>

                    </Col>
                    <Col sm={4}></Col>
                </Row>
            </Container>

            <Modal show={modalSms} onHide={smsClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>קוד אימות</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='text_code'>הזינו את קוד האימות ששלחנו לכם בהודעת סמס למספר {phone}, הקוד יגיע בשניות הקרובות</div>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control type="text" placeholder='קוד אימות' value={sms_token} onChange={(e) => setSms_token(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <div className='d-grid'>
                                <Button className='button_classic' onClick={submitCode}>שלח</Button>
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false}
                closeOnClick rtl={true} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </div>
    );
}

export default Signup;