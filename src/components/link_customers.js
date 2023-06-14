import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../App.css';
import { Col, Row, Button, Image } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { BsArrowRightSquare } from 'react-icons/bs';
import Loading from './loading';
import LoginCustomers from './login_customers';
import SignupCustomers from './signup_customers';
import Swal from 'sweetalert2'

function LinkCustomers() {
    const [business, setBusiness] = useState();
    const [settings, setSettings] = useState();
    const [servicesList, setServicesList] = useState();
    const [events, setEvents] = useState([]);
    const [date, setDate] = useState(new Date());
    const [dateTor, setDateTor] = useState();
    const [start, setStart] = useState(-1);
    const [end, setEnd] = useState(-1);
    const [apiEnd, setApiEnd] = useState(false);
    const [apiLoad, setApiLoad] = useState(0);
    const [service, setServices] = useState();
    const [serviceTime, setServiceTime] = useState();
    const [nav, setNav] = useState("setting");
    const [eventEmpty, setEventEmpty] = useState([]);
    const [notVerify, setNotVerify] = useState(false);

    const params = useParams();
    const navigate = useNavigate();

    let linkBookings = "/bookings/"
    linkBookings += params.token;

    //מביא את פרטי העסק
    useEffect(() => {
        axios.get(`https://easy-tor-server.onrender.com/getUser/${params.token}`, { withCredentials: true })
            .then(function (response) {
                setBusiness(response.data[0]);
                //מביא את שעות הפעילות
                axios.post(`https://easy-tor-server.onrender.com/getSettings`,
                    { business_users_id: response.data[0]._id },
                    { withCredentials: true })
                    .then(function (response) {
                        setSettings(response.data[0].weekly);
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                //מביא את רשימת השירותים
                axios.post(`https://easy-tor-server.onrender.com/getServies`,
                    { business_users_id: response.data[0]._id },
                    { withCredentials: true })
                    .then(function (response) {
                        setServicesList(response.data);
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            })
            .catch(function (error) {
                console.log(error);
            })
    }, []);

    //מביא את האירועים של היום
    useEffect(() => {
        if (business && serviceTime) {
            axios.post('https://easy-tor-server.onrender.com/getEvents',
                {
                    date: date.toLocaleDateString('en-CA'),
                    business_users_id: business._id
                },
                { withCredentials: true })
                .then(function (response) {
                    setEvents(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
    }, [apiLoad]);

    //רשימת התורים הפנויה
    useEffect(() => {
        if (business && serviceTime) {
            let arrayEvent = [];
            for (let i = settings[date.getDay()].start; i < (settings[date.getDay()].end - (serviceTime - 1)); i += 5) {
                let searchEvent = events.filter(event => event.start >= i && event.start < (i + serviceTime) ||
                    event.end > i && event.start < i)
                if (searchEvent.length == 0) {
                    arrayEvent.push(i);
                }
            }
            setEventEmpty(arrayEvent);
            setApiEnd(true);
        }
    }, [events]);

    //בודק אם הלקוח מחובר
    useEffect(() => {
        if (nav == "schedule" || nav == "login") {
            axios.get('https://easy-tor-server.onrender.com/getBookings',
                { withCredentials: true })
                .then(function () {
                    setNotVerify(false);
                })
                .catch(function (error) {
                    if (error.response.status == 401) { setNotVerify(true) }
                })
        }
    }, [nav]);

    const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"]

    //מייצר פורמט של שעה מדקות
    const formatTime = (minutes) => {
        return ((Math.floor(minutes / 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }))
            + ":" + ((minutes % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })));
    }

    const submitTor = () => {
        axios.post('https://easy-tor-server.onrender.com/customerCreateEvent', {
            business_users_id: business._id,
            service_id: service._id,
            date: dateTor,
            start: start,
            end: end
        },
            { withCredentials: true })
            .then((response) => {
                if (response.status == 200) {
                    Swal.fire({
                        title: "התור נקבע בהצלחה",
                        text: "במקרה של ביטול נא לעדכן בהקדם האפשרי",
                        icon: 'success',
                        confirmButtonText: 'סגור',
                        confirmButtonColor: '#10b981',
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate(linkBookings);
                        }
                    })
                }
            })
            .catch((error) => {
                if (error.response.status == 401) {
                    toast.error("אירעה שגיאה, נסו שוב מאוחר יותר");
                    console.log(error);
                }
            })
    };

    return (
        <div className='LinkCustomers'>
            <Image src='../logo.png' height={40} width={130}></Image>
            {business && settings ? <div>
                <div className='link_text1'>{business.business_name}</div>
                <div className='link_text2'>{business.phone}</div>
                <Row className='row_link'>
                    <Col lg={3}></Col>
                    <Col lg={6}>
                        {nav == "setting" ? <div>
                            <Row>
                                <Col lg={2}></Col>
                                <Col lg={8}>
                                    <div className='link_settings'>
                                        <div className='link_settings_text'>שעות פעילות:</div>
                                        <div className='link_day'>
                                            {settings.map((day, index) => (
                                                <Row key={index}>
                                                    <Col xs={5}>{days[index]}</Col>
                                                    <Col xs={1}></Col>
                                                    {day.start != -1 ?
                                                        <Col xs={5}>{formatTime(day.end)} - {formatTime(day.start)}</Col>
                                                        :
                                                        <Col xs={5}>סגור</Col>}
                                                    <Col xs={1}></Col>
                                                </Row>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='d-grid'>
                                        <Button className='button_classic' onClick={() => { setNav("service") }}>לחצו לקביעת תור</Button>
                                    </div>
                                    <div className='div_signup_link'>
                                        <div className='link_text'>יש לך תור קיים?</div>
                                        <Link to={linkBookings} className='signup_link'><div className='div_signup_text'>לחצו לצפיה בתורים שלכם</div></Link>
                                    </div>
                                </Col>
                                <Col lg={2}></Col>
                            </Row>
                        </div> : <div>
                            {nav == "service" ? <div>
                                <Row>
                                    <Col lg={2}></Col>
                                    <Col lg={8}>
                                        <div className='link_title'>
                                            <button onClick={() => { setNav("setting") }} className='link_button_replay'>
                                                <BsArrowRightSquare className='div_signup_text' /> </button>
                                            בחרו את סוג השירות</div>
                                        {servicesList.length != 0 ? <div>
                                            {servicesList.map((service, index) => (
                                                <div className='d-grid' key={index}>
                                                    <Button className='button_event' onClick={() => {
                                                        setServices(service);
                                                        setServiceTime(service.time);
                                                        setApiEnd(false);
                                                        setApiLoad(apiLoad + 1);
                                                        setNav("schedule");
                                                    }}>
                                                        <div className='link_services'>
                                                            <Row>
                                                                <Col xs={7}>{service.name}</Col>
                                                                <Col xs={3}>{service.time} דק'</Col>
                                                                <Col xs={2}> ₪{service.price}</Col>
                                                            </Row>
                                                        </div>
                                                    </Button></div>))}
                                        </div>
                                            : <div className='list_empty'>אין עדיין שירותים</div>}
                                    </Col>
                                    <Col lg={2}></Col>
                                </Row>
                            </div> : <div>
                                {nav == "schedule" ? <div>
                                    <Row>
                                        <Col lg={6}>
                                            <div className='link_title'>
                                                <button onClick={() => { setNav("service") }} className='link_button_replay'>
                                                    <BsArrowRightSquare className='div_signup_text' /> </button>
                                                מתי תרצו להגיע?</div>
                                            <Calendar onChange={(e) => {
                                                setDate(e);
                                                setApiEnd(false);
                                                setApiLoad(apiLoad + 1);
                                            }} value={date} calendarType={"Hebrew"} className='schedule_clender' />
                                        </Col>
                                        <Col lg={6}>
                                            <div className='link_event_text'>
                                                <div>אפשרויות הגעה</div>
                                                <div>{date.toLocaleString('he-IL',
                                                    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                            </div>
                                            {apiEnd ? <div>
                                                <Row className='row_event'>
                                                    {eventEmpty.map((time, index) => (
                                                        <Col xs={4} key={index}><button className='button_event'
                                                            onClick={() => {
                                                                setDateTor(date.toLocaleDateString('en-CA'));
                                                                setStart(time);
                                                                setEnd(time + serviceTime);
                                                                setNav("login");
                                                            }}>{formatTime(time)}
                                                            <div className='button_event_text'> עד {formatTime(time + serviceTime)}</div>
                                                        </button></Col>
                                                    ))}
                                                </Row>
                                            </div> : <Loading />}
                                        </Col>
                                    </Row>
                                </div> : <div>
                                    {nav == "login" ? <div>
                                        <Row>
                                            <Col lg={2}></Col>
                                            <Col lg={8}>
                                                <div className='link_title'>
                                                    <button onClick={() => { setNav("schedule") }} className='link_button_replay'>
                                                        <BsArrowRightSquare className='div_signup_text' /> </button>
                                                    נא אשרו הזמנתכם</div>
                                                <div className='link_settings'>
                                                    <div>תור ל
                                                        {service.name}
                                                    </div>
                                                    <div className='link_tor'>
                                                        <div>{date.toLocaleString('he-IL',
                                                            { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ,
                                                            בשעה {formatTime(start)} </div>
                                                        <div>₪{service.price} &nbsp; {service.time} דקות</div>
                                                    </div>
                                                </div>
                                                {notVerify ? <div>
                                                    <div className='link_login'>לפני שקובעים, אנחנו מכירים?</div>
                                                    <Row>
                                                        <Col xs={6}>
                                                            <SignupCustomers business={business._id} setNotVerify={setNotVerify} />
                                                        </Col>
                                                        <Col xs={6}>
                                                            <LoginCustomers business={business._id} setNotVerify={setNotVerify} />
                                                        </Col>
                                                    </Row>
                                                </div> : <div className='d-grid button_tor'>
                                                    <Button className='button_classic' onClick={submitTor}>קבע תור</Button>
                                                </div>}
                                            </Col>
                                            <Col lg={2}></Col>
                                        </Row>
                                    </div> : <Loading />}
                                </div>}
                            </div>}
                        </div>}
                    </Col >
                    <Col lg={3}></Col>
                </Row >
            </div > : <div className='margin_loading'><Loading /></div>}

            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false}
                closeOnClick rtl={true} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </div >
    );
}

export default LinkCustomers;

