import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../App.css';
import { Card, Button, Col, Row, Container, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './loading';

function BusinessDetails() {
  const [name, setName] = useState([]);
  const [business_name, setBusiness_name] = useState([]);
  const [email, setEmail] = useState([]);
  const [phone, setPhone] = useState([]);
  const [apiEnd, setApiEnd] = useState(false);

  const navigate = useNavigate();

  //מביא את פרטי העסק
  useEffect(() => {
    axios.get('https://easy-tor-server.onrender.com/user', { withCredentials: true })
      .then(function (response) {
        setName(response.data[0].name);
        setBusiness_name(response.data[0].business_name);
        setEmail(response.data[0].email);
        setPhone(response.data[0].phone);
        setApiEnd(true)
      })
      .catch(function (error) {
        if (error.response.status == 401) { navigate("/login") }
        console.log(error);
      })
  }, []);

  const submit = () => {
    //בודק אם טווחי השעות תקין
    if (name && business_name && email && phone) {
      axios.post('https://easy-tor-server.onrender.com/updateUser', {
        name: name,
        business_name: business_name,
        email: email,
        phone: phone,
      }, { withCredentials: true })
        .then(function (response) {
          toast.success("הנתונים התעדכנו בהצלחה");
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

  return (
    <div>

      <div className="Settings">
        <Container>
          <Row className="justify-content-md-center">
            <Col lg={2}></Col>
            <Col lg={8}>
              <div className='tytle'>פרטי העסק</div>
              {apiEnd ?
                <div>
                  <Row>
                    <Col lg={1}></Col>
                    <Col lg={10}>
                      <Card className='business_details_form'>
                        <Card.Body>
                          <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                              <Form.Label>שם מלא</Form.Label>
                              <Form.Control size="sm" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                              <Form.Label>שם העסק</Form.Label>
                              <Form.Control size="sm" type="text" value={business_name} onChange={(e) => setBusiness_name(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                              <Form.Label>כתובת מייל</Form.Label>
                              <Form.Control size="sm" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                              <Form.Label>הטלפון שלך</Form.Label>
                              <Form.Control size="sm" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </Form.Group>
                            <Row className="justify-content-md-center">
                              <Col lg={6}></Col>
                              <Col lg={6}><div className='d-grid'><Button onClick={submit} className='button_classic'>שמירת שינויים</Button></div></Col>
                            </Row>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={1}></Col>
                  </Row>
                </div>
                : <div className='margin_loading'><Loading /></div>}
            </Col>
            <Col lg={2}></Col>
          </Row>
        </Container>
        <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false}
          closeOnClick rtl={true} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      </div>

    </div>);
}

export default BusinessDetails;