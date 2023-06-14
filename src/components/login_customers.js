import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { Button, Form, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';


function LoginCustomers({ business, setNotVerify, setApiLoad}) {
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [sms_token, setSms_token] = useState();
  const [modalLogin, setModalLogin] = useState(false);
  const [modalSms, setModalSms] = useState(false);

  const loginClose = () => setModalLogin(false);
  const smsClose = () => setModalSms(false);
  const smsShow = () => setModalSms(true);

  const login = () => {
    if (phone) {
      if (/^\d{10}$/.test(phone)) {
        axios.post('https://easy-tor-server.onrender.com/customerLogin', {
          business_users_id: business,
          phone: phone
        },
          { withCredentials: true })
          .then((response) => {
            if (response.status == 200) {
              smsShow();
              loginClose();
            }
          })
          .catch((error) => {
            if (error.response.status == 401) {
              toast.error("מספר הטלפון לא קיים במערכת");
              console.log(error);
            }
          })
      }
      else { toast.error("מספר הטלפון לא תקין"); }
    }
    else { toast.error("יש למלא את כל השדות"); }
  };

  const loginCode = () => {
    if (phone && sms_token) {
      axios.post('https://easy-tor-server.onrender.com/customerLoginAuth', {
        business_users_id: business,
        phone: phone,
        sms_token: sms_token
      },
        { withCredentials: true })
        .then((response) => {
          if (response.status == 200) {
            setNotVerify(false);
            setApiLoad(99);
            smsClose();
          }
        })
        .catch((error) => {
          if (error.response.status == 401) {
            toast.error("קוד האימות שגוי נסו שנית");
            console.log(error);
          }
        })
    }
    else { toast.error("יש למלא את כל השדות"); }
  };


  return (
    <div className='LoginCustomers'>
        <div className='d-grid'><Button className='button_classic' onClick={() => setModalLogin(true)}>התחברות</Button></div>

      <Modal show={modalLogin} onHide={loginClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>התחבר</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder='הטלפון שלך (0500000000)' value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <div className='d-grid'>
                <Button className='button_classic' onClick={login}>שלח</Button>
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
                <Button className='button_classic' onClick={() => loginCode()}>שלח</Button>
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

export default LoginCustomers;