import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../App.css';
import { Card, Button, Col, Row, Container, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Events() {
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [start, setStart] = useState(-1);
  const [end, setEnd] = useState(-1);

  const navigate = useNavigate();

  const optionsFormat = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 5) {
      optionsFormat.push({ hours: i, minutes: j });
    }
  }

  const options = optionsFormat.map((option, index) => (
    <option key={index} value={(option.hours * 60) + option.minutes}>
      {option.hours.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}:
      {option.minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}
    </option>
  ))

  const submit = () => {
    //בודק אם טווחי השעות תקין
    if (start < end && start != -1 && end != -1) {
      axios.post('https://easy-tor-server.onrender.com/createPause', {
        date: date,
        start: start,
        end: end
      }, { withCredentials: true })
        .then(function () {
          toast.success("עודכן בהצלחה");
        })
        .catch(function (error) {
          if (error.response.status == 401) { navigate("/login") }
          console.log(error);
        })
    }
    else {
      toast.error("טווח השעות לא תקין");
    }
  }

  return (
    <div className="Events">
      <Container>
        <Row className="justify-content-md-center">
          <Col lg={2}></Col>
          <Col lg={8}>
            <div className='tytle'>חופשים והפסקות</div>
            <Row className="justify-content-md-center">
              <Col lg={2}></Col>
              <Col lg={8}>
                <Card>
                  <Card.Body>
                    <Form>
                        <div className='event_text'>עדכון הפסקות צהריים, חופשות, שעות וימים בהם לא תוכלו לקבל לקוחות</div>
                      <Form.Group className="mb-3">
                        <Form.Control size="sm" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                      </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Select size="sm" onChange={(e) => setStart(e.target.value)}>
                            <option value={-1}>משעה</option>
                            {options}
                          </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Select size="sm" onChange={(e) => setEnd(e.target.value)}>
                            <option value={-1}>עד שעה</option>
                            {options}
                          </Form.Select>
                        </Form.Group>
                      <div className='d-grid'>
                        <Button className='button_classic' onClick={submit}>שמור</Button>
                      </div>
                      <br />
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={2}></Col>
            </Row>
          </Col>
          <Col sm={2}></Col>
        </Row>
      </Container>
      <ToastContainer position="bottom-right" autoClose={4000} hideProgressBar={false} newestOnTop={false}
        closeOnClick rtl={true} pauseOnFocusLoss draggable pauseOnHover theme="light" />
    </div>

  );
}

export default Events;