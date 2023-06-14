import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import '../App.css';
import { Button, Col, Row, Container, Accordion } from 'react-bootstrap';
import { FcCalendar, FcClock, FcMoneyTransfer, FcTodoList } from 'react-icons/fc';
import { BsWhatsapp } from 'react-icons/bs';
import { FiPhone } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './loading';


function Dashboard() {
    const [settings, setSettings] = useState();
    const [businessUsers, setBusinessUsers] = useState();
    const [events, setEvents] = useState([]);
    const [apiEnd, setApiEnd] = useState(false);
    const [apiLoad, setApiLoad] = useState(0);

    const navigate = useNavigate();
    const date = new Date();

    useEffect(() => {
        //מביא את הגדרות העסק
        axios.get('https://easy-tor-server.onrender.com/settings', { withCredentials: true })
            .then(function (response) {
                setSettings(response.data[0].weekly)
            })
            .catch(function (error) {
                if (error.response.status == 401) { navigate("/login") }
                console.log(error);
            })

        //מביא את הטוקן של העסק
        axios.get('https://easy-tor-server.onrender.com/user', { withCredentials: true })
            .then(function (response) {
                setBusinessUsers(response.data[0].business_token);
            })
            .catch(function (error) {
                if (error.response.status == 401) { navigate("/login") }
                console.log(error);
            })

        //מביא את רשימת האירועים של היום
        axios.post('https://easy-tor-server.onrender.com/events', {
            date: date.toLocaleDateString('en-CA')
        }, { withCredentials: true })
            .then(function (response) {
                //מסנן את האירועים מסוג הפסקה
                const eventsCustomer = response.data.filter(event => event.type == 1);
                setEvents(eventsCustomer);
                setApiEnd(true)
            })
            .catch(function (error) {
                if (error.response.status == 401) { navigate("/login") }
                console.log(error);
            })
    }, [apiLoad]);

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

    //מייצר פורמט של שעה מדקות
    const formatTime = (minutes) => {
        return ((Math.floor(minutes / 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }))
            + ":" + ((minutes % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })));
    }
    //מחשב את התורים שבוצעו
    const pastEvents = events.filter(event => event.end < ((date.getHours() * 60) + date.getMinutes()));
    //מחשב את ההכנסה המוערכת
    let totalPriceEvents = 0;
    events.forEach(event => totalPriceEvents += event.service.price);
    //פורמט של קישור לטלפון
    const phone = (customer_phone) => { return ('tel:' + customer_phone) };
    //פורמט של קישור לוואטצאפ
    const whatsapp = (customer_whatsapp) => {
        let whatsapp_slice = customer_whatsapp.slice(1);
        return ('https://wa.me/972' + whatsapp_slice)
    };

    return (
        <div className='Dashboard'>

            <Container>
                <Row>
                    <Col lg={2}></Col>
                    <Col lg={4}> <div className='dashboard_today'>היום, {date.toLocaleString('he-IL',
                        { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        {settings && businessUsers && apiEnd ? <div>
                            <div>
                                {settings[date.getDay()].start != -1 ?
                                    <div>שעות פעילות: {(formatTime(settings[date.getDay()].start))} עד {(formatTime(settings[date.getDay()].end))}
                                    </div> : <div>העסק סגור</div>}
                            </div>
                            <div className='dashboard_details'>
                                <Row>
                                    <Col xs={6} className='dashboard_text'>
                                        <Link to={"schedule"}><Row>
                                            <Col xs={8}><div>מגיעים היום </div>
                                                <div className='dashboard_sum'>{events.length}</div></Col>
                                            <Col xs={4}><FcCalendar className='dashboard_icon' /></Col>
                                        </Row></Link>
                                    </Col>
                                    <Col xs={6} className='dashboard_text'>
                                        <Link to={"schedule"}><Row>
                                            <Col xs={8}><div>תורים שהושלמו </div>
                                                <div className='dashboard_sum'>{pastEvents.length}</div></Col>
                                            <Col xs={4}><FcTodoList className='dashboard_icon' /></Col>
                                        </Row></Link>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={6} className='dashboard_text'>
                                        <Link to={"settings"}><Row>
                                            <Col xs={8}><div>שעות עבודה</div>
                                                <div className='dashboard_sum'>
                                                    {formatTime((settings[date.getDay()].end - settings[date.getDay()].start))}</div></Col>
                                            <Col xs={4}><FcClock className='dashboard_icon' /></Col>
                                        </Row></Link>
                                    </Col>
                                    <Col xs={6} className='dashboard_text'>
                                        <Row>
                                            <Col xs={8}><div>הכנסה מוערכת </div>
                                                <div className='dashboard_sum'>₪{totalPriceEvents}</div></Col>
                                            <Col xs={4}><FcMoneyTransfer className='dashboard_icon' /></Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                            <h5 className='dashboard_tytle_link'>דף העסק שלכם</h5>
                            <div className='dashboard_div_link'>
                                <div>רוצים שהלקוחות שלכם יקבעו תור בעצמם? שלחו להם את הלינק</div>
                                <div className='dashboard_link'><a href={`https://easy-tor.netlify.app/users/${businessUsers}`} className='link_url'>
                                    https://easy-tor.netlify.app/users/{businessUsers}</a></div>
                                <div className='dashboard_button'>
                                    <Row>
                                        <Col lg={2} xs={0}></Col>
                                        <Col lg={4} xs={6}>
                                            <Button className='button_outline' onClick={() => {
                                                toast.success("הלינק הועתק ללוח");
                                                navigator.clipboard.writeText(businessUsers)
                                            }}>העתק ללוח</Button>
                                        </Col>
                                        <Col lg={4} xs={6}>
                                            <Button className='button_outline' onClick={() => navigator.clipboard.writeText(businessUsers)}>שתפו ב- <BsWhatsapp /></Button>
                                        </Col>
                                        <Col lg={2} xs={0}></Col>
                                    </Row>
                                </div>
                            </div>
                        </div> : <div className='margin_loading'><Loading /></div>}
                    </Col>
                    <Col lg={1}></Col>
                    <Col lg={4}>
                        {settings && businessUsers && apiEnd ? <div>
                            <h5 className='dashboard_tytle_event'>מי מגיע היום</h5>
                            <div className='dashboard_event'>
                                {events.length == 0 ? <div className='dashboard_div_link'>כרגע אין משהו מעניין...</div> :
                                    events.map((event, index) => (
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
                                    ))}
                            </div>
                        </div> : null}
                    </Col>
                    <Col lg={1}></Col>
                </Row>
            </Container>
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false}
                closeOnClick rtl={true} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </div>);
}

export default Dashboard;