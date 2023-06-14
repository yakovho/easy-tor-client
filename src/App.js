import { useState} from 'react';
import './App.css';
import { Routes, Route, Link} from "react-router-dom";
import Dashboard from './components/dashboard';
import Settings from './components/settings';
import Services from './components/services';
import Events from './components/events';
import Schedule from './components/schedule';
import BusinessDetails from './components/business_details';
import Customers from './components/customers';
import Signup from './components/signup';
import Login from './components/login';
import LinkCustomers from './components/link_customers';
import BookingsCustomers from './components/bookings_cutomers';
import { Container, Nav, Navbar, Image } from 'react-bootstrap';

function App() {
  const [active, setActive] = useState("/");

  //לא מציג את התפריט לדף של הלקוחות
  const notNavbar = window.location.href.includes("users");

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="business_details" element={<BusinessDetails />} />
        <Route path="settings" element={<Settings />} />
        <Route path="services" element={<Services />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="events" element={<Events />} />
        <Route path="customers" element={<Customers />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="users/:token" element={<LinkCustomers />} />
        <Route path="bookings/:token" element={<BookingsCustomers />} />
      </Routes>

      {notNavbar ? null :
        <div>
          <Navbar collapseOnSelect expand="lg" bg="light" variant="light" fixed="top" dir='ltr'>
            <Container>
              <Navbar.Brand as={Link} to="/"><Image src='logo.png' height={40} width={130}></Image></Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav dir='rtl' activeKey={active}
                  onSelect={(selectedKey) => setActive(selectedKey)}>
                  <Nav.Link eventKey={"/"} as={Link} to="/">ראשי</Nav.Link>
                  <Nav.Link eventKey={"business_details"} as={Link} to="business_details">פרטי העסק</Nav.Link>
                  <Nav.Link eventKey={"settings"} as={Link} to="settings">שעות פעילות</Nav.Link>
                  <Nav.Link eventKey={"schedule"} as={Link} to="schedule">יומן עבודה</Nav.Link>
                  <Nav.Link eventKey={"events"} as={Link} to="events">חופשים והפסקות</Nav.Link>
                  <Nav.Link eventKey={"services"} as={Link} to="services">שירותים</Nav.Link>
                  <Nav.Link eventKey={"customers"} as={Link} to="customers">לקוחות</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>}
    </div>);
}

export default App;
