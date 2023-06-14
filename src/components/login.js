import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { Card, Button, Col, Row, Container, Form, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, Link } from "react-router-dom";
import Swal from 'sweetalert2'


function Login() {
  const [phone, setPhone] = useState();
  const [sms_token, setSms_token] = useState();
  const [modalSms, setModalSms] = useState(false);

  const smsClose = () => setModalSms(false);
  const smsShow = () => setModalSms(true);

  const navigate = useNavigate();

  const submit = () => {
    if (phone) {
      if (/^\d{10}$/.test(phone)) {
        axios.post('https://easy-tor-server.onrender.com/login', {
          phone: phone
        },
          { withCredentials: true })
          .then((response) => {
            if (response.status == 200) {
              smsShow();
            }
          })
          .catch((error) => {
            if (error.response.status == 401) {
              toast.error("מספר הטלפון לא קיים במערכת");
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
    if (phone && sms_token) {
      axios.post('https://easy-tor-server.onrender.com/login_auth', {
        phone: phone,
        sms_token: sms_token
      },
        { withCredentials: true })
        .then((response) => {
          if (response.status == 200) {
            Swal.fire({
              title: "איזה כיף שחזרת",
              icon: 'success',
              confirmButtonText: 'סגור',
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

  const loginTest = () => {
    axios.post('https://easy-tor-server.onrender.com/login_test', {
      phone: phone,
      sms_token: sms_token
    },
      { withCredentials: true })
      .then((response) => {
        if (response.status == 200) {
          Swal.fire({
            title: "איזה כיף שחזרת",
            icon: 'success',
            confirmButtonText: 'סגור',
            confirmButtonColor: '#10b981'
          })
          navigate("/");
        }
      })
      .catch((error) => {
        if (error.response.status == 401) {
          toast.error("תקלה בכניסה לסביבת טסטים");
          console.log(error);
        }
      })
  };

  return (
    <div className='Login'>
      <Container>
        <Row className="justify-content-md-center">
          <Col lg={4}></Col>
          <Col lg={4}>
            <Card>
              <Card.Body>
                <Form>
                  <div className='login_tytle'>התחבר</div>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control type="tel" placeholder="הטלפון שלך (0500000000)" onChange={(e) => setPhone(e.target.value)} />
                  </Form.Group>
                  <div className='d-grid'>
                    <Button className='button_classic' onClick={submit}>התחבר</Button>
                  </div>
                  <div className='div_signup_link'>
                    <div>אין לך חשבון?</div>
                    <Link to="/signup" className='signup_link'><div className='div_signup_text'>לחץ להרשמה</div></Link>
                  </div>
                  <div className='d-grid'>
                    <Button className='login_test' onClick={loginTest}>סביבת טסטים ללא צורך באימות</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}></Col>
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

export default Login;
