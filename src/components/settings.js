import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../App.css';
import { Card, Button, Col, Row, Container, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './loading';

function Settings() {
  const [weekly, setWeekly] = useState();

  const navigate = useNavigate();

  //מביא את הגדרות העסק
  useEffect(() => {
    axios.get('https://easy-tor-server.onrender.com/settings', { withCredentials: true })
      .then(function (response) {
        setWeekly(response.data[0].weekly)
      })
      .catch(function (error) {
        if (error.response.status == 401) { navigate("/login") }
        console.log(error);
      })
  }, []);

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
  //בודק אם טווחי השעות תקין
  const timeProper = (weekly) => {
    for (let i = 0; i < weekly.length; i++) {
      if (weekly[i].start > weekly[i].end) {
        return 0;
      }
    }
    return 1;
  }

  const submit = () => {
    //בודק אם טווחי השעות תקין
    if (timeProper(weekly)) {
      axios.post('https://easy-tor-server.onrender.com/updateSettings', {
        weekly: weekly
      }, { withCredentials: true })
        .then(function () {
          toast.success("הנתונים התעדכנו בהצלחה");
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

  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"]

  return (
    <div className="Settings">
      <Container>
        <Row className="justify-content-md-center">
          <Col lg={2}></Col>
          <Col lg={8}>
            <div className='tytle'>שעות פעילות</div>
            {weekly ?
              <div>
                <Row>
                  <Col lg={1}></Col>
                  <Col lg={10}>
                    <Card className='settings_form'>
                      <Card.Body>
                        <Form>
                          <Row className='settings_form_tytle'>
                            <Col xs={4}><div>יום</div></Col>
                            <Col xs={4}><div>פתיחה</div></Col>
                            <Col xs={4}><div>סגירה</div></Col>
                          </Row>
                          {weekly.map((day, index) => (
                            <Form.Group key={index} className="mb-3" controlId="formBasicEmail">
                              <Row>
                                <Col xs={4}>{days[index]}</Col>

                                <Col xs={4}><Form.Select size="sm" defaultValue={weekly[index].start}
                                  onChange={(e) => {
                                    let updateWeekly = weekly;
                                    updateWeekly[index].start = parseInt(e.target.value);
                                    //מעדכן סטטוס סגור גם בשעת הסיום
                                    if (parseInt(e.target.value) == -1) {
                                      updateWeekly[index].end = parseInt(e.target.value);
                                    }
                                    setWeekly(updateWeekly);
                                  }}>
                                  <option value={-1}>סגור</option>
                                  {options}
                                </Form.Select>
                                </Col>
                                <Col xs={4}><Form.Select size="sm" defaultValue={weekly[index].end}
                                  onChange={(e) => {
                                    let updateWeekly = weekly;
                                    updateWeekly[index].end = parseInt(e.target.value);
                                    //מעדכן סטטוס סגור גם בשעת ההתחלה
                                    if (parseInt(e.target.value) == -1) {
                                      updateWeekly[index].start = parseInt(e.target.value);
                                    }
                                    setWeekly(updateWeekly);
                                    console.log(weekly);
                                  }}>
                                  <option value={-1}>סגור</option>
                                  {options}
                                </Form.Select>
                                </Col>
                              </Row>
                            </Form.Group>
                          ))}
                          <Row className="justify-content-md-center">
                            <Col lg={6}></Col>
                            <Col lg={6}><div className='d-grid'><Button className='button_classic' onClick={submit}>שמירת שינויים</Button></div></Col>
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
    </div>);
}

export default Settings;