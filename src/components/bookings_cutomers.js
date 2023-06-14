import React, { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import '../App.css';
import { Col, Row, Button, Image } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import Loading from './loading';
import LoginCustomers from './login_customers';

function BookingsCustomers() {
    const [business, setBusiness] = useState();
    const [bookings, setBookings] = useState([]);
    const [apiLoad, setApiLoad] = useState(0);
    const [notVerify, setNotVerify] = useState(false);
    
    const params = useParams();

    //מביא את פרטי העסק
    useEffect(() => {
        axios.get(`https://easy-tor-server.onrender.com/getUser/${params.token}`, { withCredentials: true })
            .then(function (response) {
                setBusiness(response.data[0]);
            })
            .catch(function (error) {
                console.log(error);
            })
    }, []);

    //מביא את אירועי הלקוח
    useEffect(() => {
        axios.get('https://easy-tor-server.onrender.com/getBookings',
            { withCredentials: true })
            .then(function (response) {
                setBookings(response.data);
            })
            .catch(function (error) {
                if (error.response.status == 401) { setNotVerify(true) }
                console.log(error);
            })
    }, [apiLoad]);

    //מוחק אירוע
    const deleteEvent = (id_event) => {
        axios.post('https://easy-tor-server.onrender.com/customerDeleteEvent', {
            id: id_event
        }, { withCredentials: true })
            .then(function () {
                setApiLoad(apiLoad + 1);
                toast.success("נמחק בהצלחה");
            })
            .catch(function (error) {
                toast.error("אירעה שגיאה");
                console.log(error);
            })
    }

    //מייצר פורמט של שעה מדקות
    const formatTime = (minutes) => {
        return ((Math.floor(minutes / 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }))
            + ":" + ((minutes % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })));
    }

    //מייצר פורמט של תאריך התור
    const formatDate = (dateTor) => {
        let format = new Date(dateTor);
        return (format.toLocaleString('he-IL', { weekday: 'long' }) + " " + format.toLocaleDateString('en-AU'));
    }

    let linkusers = "/users/";
    linkusers += params.token;


    return (
        <div className='BookingsCustomers'>
            <Image src='../logo.png' height={40} width={130}></Image>
            {business && bookings ? <div>
                <div className='link_text1'>{business.business_name}</div>
                <div className='link_text2'>{business.phone}</div>
                <Row className='row_link'>
                    <Col lg={4}></Col>
                    <Col lg={4}>
                        <div className='bookings_settings'>
                            <Row>
                                <Col lg={9} xs={7}>
                                    <div className='link_settings_text'>התורים שלי</div>
                                </Col>
                                <Col lg={3} xs={5}>
                                    <div className='button_mew'><Link to={linkusers} className='signup_link'>
                                        <Button className='button_outline'>תור חדש</Button></Link></div>
                                </Col>
                            </Row>
                            {notVerify ? <div className='booking_login'>
                                <LoginCustomers business={business._id} setNotVerify={setNotVerify} setApiLoad={setApiLoad} />
                            </div>
                                : <div>
                                    {bookings.length !== 0 ? <div>
                                        {bookings.map((booking, index) => (
                                            <div className='booking_events'>
                                                <Row key={index} className='row_tor'>
                                                    <Col xs={9}>
                                                        <div>{booking.service.name}</div>
                                                        <div className='booking_eventst_text'>
                                                        <div>{formatDate(booking.date)}</div>
                                                        <div> בשעה {formatTime(booking.start)}</div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={3} className='delete_div'><div className='d-grid delete_event'>
                                                        <Button className='schedule_delete' onClick={() => deleteEvent(booking._id)}>בטל תור</Button>
                                                    </div></Col>
                                                </Row>
                                            </div>
                                        ))}
                                       </div> : <div className='not_events'>לא נקבעו תורים עדיין...</div>}
                                </div>}
                        </div>
                    </Col>
                    <Col lg={4}></Col>
                </Row>
            </div> : <div className='margin_loading'><Loading /></div>}

            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false}
                closeOnClick rtl={true} pauseOnFocusLoss draggable pauseOnHover theme="light" />
        </div >
    );
}

export default BookingsCustomers;