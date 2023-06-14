import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../App.css';
import { Col, Row, Container, Button, Accordion, Form, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { BsWhatsapp } from 'react-icons/bs';
import { FiPhone } from 'react-icons/fi';
import Loading from './loading';

function Schedule() {
  const [settings, setSettings] = useState();
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [dateTor, setDateTor] = useState(new Date().toLocaleDateString('en-CA'));
  const [apiEnd, setApiEnd] = useState(false);
  const [apiLoad, setApiLoad] = useState(0);
  const [modalCreatEvent, setModalCreatEvent] = useState(false);
  const [customer_id, setCustomer_id] = useState(0);
  const [service_id, setService_id] = useState(0);
  const [start, setStart] = useState(-1);
  const [end, setEnd] = useState(-1);
  const [customersList, setCustomersList] = useState([]);
  const [servicesList, setServicesList] = useState([]);

  const createClose = () => setModalCreatEvent(false);

  const navigate = useNavigate();

  //מביא את הגדרות העסק
  useEffect(() => {
    axios.get('https://easy-tor-server.onrender.com/settings', { withCredentials: true })
      .then(function (response) {
        setSettings(response.data[0].weekly);
      })
      .catch(function (error) {
        if (error.response.status == 401) { navigate("/login") }
        console.log(error);
      })
  }, []);

  //מביא את האירועים של היום
  useEffect(() => {
    axios.post('https://easy-tor-server.onrender.com/events', {
      date: date.toLocaleDateString('en-CA')
    },
      { withCredentials: true })
      .then(function (response) {
        setEvents(response.data);
        setApiEnd(true)
      })
      .catch(function (error) {
        if (error.response.status == 401) { navigate("/login") }
        console.log(error);
      })
  }, [apiLoad]);

  useEffect(() => {
    //מביא את רשימת הלקוחות
    axios.get(`https://easy-tor-server.onrender.com/customers`, { withCredentials: true })
      .then(function (response) {
        setCustomersList(response.data)
      })
      .catch(function (error) {
        if (error.response.status == 401) { navigate("/login") }
        console.log(error);
      })
    //מביא את רשימת המוצרים
    axios.get(`https://easy-tor-server.onrender.com/services`, { withCredentials: true })
      .then(function (response) {
        setServicesList(response.data)
      })
      .catch(function (error) {
        if (error.response.status == 401) { navigate("/login") }
        console.log(error);
      })
  }, []);

  const deleteEvent = (id_event) => {
    axios.post('https://easy-tor-server.onrender.com/deleteEvents', {
      id: id_event
    }, { withCredentials: true })
      .then(function () {
        setApiLoad(apiLoad + 1);
        toast.success("נמחק בהצלחה");
      })
      .catch(function (error) {
        if (error.response.status == 401) { navigate("/login") }
        console.log(error);
      })
  }

  const creatEvent = () => {
    //בודק אם טווחי השעות תקין
    if (start < end && start != -1 && end != -1) {
      axios.post('https://easy-tor-server.onrender.com/createEvents', {
        customer_id: customer_id,
        service_id: service_id,
        date: dateTor,
        start: start,
        end: end
      }, { withCredentials: true })
        .then(function () {
          setApiLoad(apiLoad + 1);
          toast.success("התור נוסף בהצלחה");
          createClose();
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

  //מייצר פורמט של שעה מדקות
  const formatTime = (minutes) => {
    return ((Math.floor(minutes / 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }))
      + ":" + ((minutes % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })));
  }

  //פורמט של קישור לטלפון
  const phone = (customer_phone) => { return ('tel:' + customer_phone) };
  //פורמט של קישור לוואטצאפ
  const whatsapp = (customer_whatsapp) => {
    let whatsapp_slice = customer_whatsapp.slice(1);
    return ('https://wa.me/972' + whatsapp_slice)
  };

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

  return (
    <div className="Schedule">
      <Container>
        <Row className="justify-content-md-center">
          <Col lg={2}></Col>
          <Col lg={8}>
            <div className='tytle'>יומן עבודה</div>
            <Row>
              <Col lg={5}>
                <Calendar onChange={(e) => {
                  setApiEnd(false);
                  setApiLoad(apiLoad + 1);
                  setDate(e);
                }} value={date} calendarType={"Hebrew"} className='schedule_clender' />
              </Col>
              <Col lg={7}>
                {apiEnd && settings ? <div>
                  <Row>
                    <Col lg={7} xs={7}>
                      <div className='schedule_today'>{date.toLocaleString('he-IL',
                        { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                      {settings[date.getDay()].start != -1 ?
                        <div className='schedule_today_text'>שעות פעילות: {(formatTime(settings[date.getDay()].start))} עד {(formatTime(settings[date.getDay()].end))}
                        </div> : <div className='schedule_today_text'>העסק סגור</div>}
                    </Col>
                    <Col lg={5} xs={5}>
                      <div className='button_mew'><Link className='signup_link'>
                        <Button className='button_outline button_schedule' onClick={() => setModalCreatEvent(true)}>
                          הוספת תור</Button></Link></div>
                    </Col>
                  </Row>
                  <div className='dashboard_event'>
                    {events.length == 0 ? <div className='dashboard_div_pause'>אין תורים מתוכננים ביום זה</div> :
                      events.map((event, index) => (
                        event.type == 1 ?
                          <Accordion key={index}>
                            <Accordion.Item eventKey={index}>
                              <Accordion.Header>
                                <Row className='dashboard_div_events'>
                                  <Col xs={3}>
                                    <div className='events_time_start'>{formatTime(event.start)}</div>
                                    <div className='events_time_end'>עד {formatTime(event.end)}</div>
                                  </Col>
                                  <Col xs={9}>
                                    <div className='events_service'>{event.service.name}</div>
                                    <div className='events_customer'>לקוח/ה: {event.service.customer[0].name}</div>
                                  </Col></Row>
                              </Accordion.Header>
                              <Accordion.Body>
                                <Row>
                                  <Col xs={4}>
                                    <div className='d-grid'>
                                      <a href={phone(event.service.customer[0].phone)} className='schedule_link'>
                                        <div className='schedule_link_text'>התקשר <FiPhone className='schedule_icon' />
                                        </div></a></div>
                                  </Col>
                                  <Col xs={4}>
                                    <div className='d-grid'>
                                      <a href={whatsapp(event.service.customer[0].phone)} className='schedule_link'>
                                        <div className='schedule_link_text'>הודעה <BsWhatsapp className='schedule_icon' />
                                        </div></a></div>
                                  </Col>
                                  <Col xs={4}>
                                    <div className='d-grid'>
                                      <Button className='schedule_delete' onClick={() => deleteEvent(event._id)}>מחק תור</Button>
                                    </div>
                                  </Col>
                                </Row>
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                          :
                          <Accordion key={index}>
                            <Accordion.Item eventKey={index}>
                              <Accordion.Header>
                                <Row className='dashboard_div_events'>
                                  <Col xs={3} className='events_pause_text'>הפסקה</Col>
                                  <Col xs={6}><div className='events_pause_number'>{formatTime(event.end)} - {formatTime(event.start)}</div></Col>
                                  <Col xs={3}></Col>
                                </Row>
                              </Accordion.Header>
                              <Accordion.Body>
                                <Row>
                                  <Col xs={8}></Col>
                                  <Col xs={4}>
                                    <div className='d-grid'>
                                      <Button className='schedule_delete' onClick={() => deleteEvent(event._id)}>מחק</Button>
                                    </div>
                                  </Col>
                                </Row>
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>))}
                  </div>
                </div> : <Loading />}
              </Col>
            </Row>
          </Col>
          <Col lg={2}></Col>
        </Row>
      </Container>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false}
        closeOnClick rtl={true} pauseOnFocusLoss draggable pauseOnHover theme="light" />

      <Modal show={modalCreatEvent} onHide={createClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>הוספת תור</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Select size="sm" onChange={(e) => setCustomer_id(e.target.value)}>
                <option value={0}>בחר לקוח</option>
                {customersList.map((customer, index) => (
                  <option key={index} value={customer._id}>
                    {customer.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Select size="sm" onChange={(e) => setService_id(e.target.value)}>
                <option value={0}>בחר שירות</option>
                {servicesList.map((services, index) => (
                  <option key={index} value={services._id}>
                    {services.name}  {services.time} דקות מחיר: {services.price}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control size="sm" type="date" value={dateTor} onChange={(e) => setDateTor(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Select size="sm" onChange={(e) => {
                setStart(e.target.value);
                const getTimeServise = servicesList.filter(service => service._id == service_id);
                setEnd(parseInt(e.target.value) + parseInt((getTimeServise[0].time)));
              }}>
                <option value={-1}>תור בשעה</option>
                {options}
              </Form.Select> </Form.Group>

            <Form.Group className="mb-3">
              <div className='d-grid'>
                <Button className='button_classic' onClick={creatEvent}>שלח</Button>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>

    </div>
  );
}

export default Schedule;