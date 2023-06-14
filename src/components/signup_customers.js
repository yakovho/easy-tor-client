import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { Button, Form, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

function SignupCustomers({ business, setNotVerify }) {
    const [name, setName] = useState();
    const [phone, setPhone] = useState();
    const [sms_token, setSms_token] = useState();
    const [modalSignup, setModalSignup] = useState(false);
    const [modalSms, setModalSms] = useState(false);

    const signupClose = () => setModalSignup(false);
    const smsClose = () => setModalSms(false);
    const smsShow = () => setModalSms(true);

    const signup = () => {
        if (name && phone) {
            if (/^\d{10}$/.test(phone)) {
                axios({
                    method: 'post',
                    url: 'https://easy-tor-server.onrender.com/customerSignup',
                    data: {
                        business_users_id: business,
                        name: name,
                        phone: phone
                    }, withCredentials: true
                })
                    .then((response) => {
                        if (response.status === 200) {
                            smsShow();
                            signupClose();
                        }
                    })
                    .catch((error) => {
                        if (error.response.status === 401) {
                            toast.error("הטלפון כבר קיים במערכת");
                            console.log(error);
                        }
                    })
            }
            else { toast.error("מספר הטלפון לא תקין"); }
        }
        else { toast.error("יש למלא את כל השדות"); }
    };

    const signupCode = () => {
        if (name && phone && sms_token) {
            axios({
                method: 'post',
                url: 'https://easy-tor-server.onrender.com/customerSignupAuth',
                data: {
                    business_users_id: business,
                    name: name,
                    phone: phone,
                    sms_token: sms_token
                }, withCredentials: true
            })
                .then((response) => {
                    if (response.status === 200) {
                        setNotVerify(false);
                        smsClose();
                    }
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        toast.error("קוד האימות שגוי נסו שנית");
                        console.log(error);
                    }
                })
        }
        else { toast.error("יש למלא את כל השדות"); }
    };


    return (
        <div className='SignupCustomers'>
            <div className='d-grid'><Button className='button_outline' onClick={() => setModalSignup(true)}>פעם ראשונה שלי</Button></div>

            <Modal show={modalSignup} onHide={signupClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>הירשם</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control type="text" placeholder='שם מלא' value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control type="text" placeholder='הטלפון שלך (0500000000)' value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <div className='d-grid'>
                                <Button className='button_classic' onClick={signup}>שלח</Button>
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>

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
                                <Button className='button_classic' onClick={() => signupCode()}>שלח</Button>
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

export default SignupCustomers;