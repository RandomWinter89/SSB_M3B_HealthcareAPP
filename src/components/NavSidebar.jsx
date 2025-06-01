import { getAuth } from "firebase/auth";
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from "./AuthProvide";
import { useEffect, useContext } from "react";

import { Button, Container, Navbar, Nav } from 'react-bootstrap';

const isHealthcareEmail = (email) => {
  return email.endsWith("@healthcare.com");
}

const UserNav = () => {
  return (
    <Nav className="flex-column">
      <Nav.Link as={Link} to="/userDashboard">Dashboard</Nav.Link>
      <Nav.Link as={Link} to="/userDetail">Personal Detail</Nav.Link>
    </Nav>
  )
}

const StuffNav = () => {
  
  return (
    <Nav className="flex-column">
      <Nav.Link as={Link} to="/stuffDashboard">Dashboard</Nav.Link>
      <Nav.Link as={Link} to="/stuffAppointment">Appointment</Nav.Link>
      <Nav.Link as={Link} to="/stuffDetail">Personal Detail</Nav.Link>
    </Nav>
  )
}

//Navigation must checked whether data is valid or not.
const NavSidebar = () => {
  const { currentUser } = useContext(AuthContext) || null;
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  const hasRegistered = () => {
    return location.pathname !== '/login' || location.pathname !== '/signup';
  }

  useEffect(() => {
    if (!currentUser && hasRegistered)
      navigate("/login");
  }, [currentUser]);

  const handleLogout = () => auth.signOut();

  return (
    < >
      <Navbar bg="dark" data-bs-theme="dark" className="vh-100">
        <Container className="flex-column">
          {currentUser && (isHealthcareEmail(currentUser.email) ? <StuffNav /> : <UserNav />)}
          {currentUser && <Button className="mt-3 w-100" onClick={handleLogout}>Logout</Button>}
          {!currentUser && (
            <Nav className="flex-column">
              <Nav.Link className="text-start w-100" as={Link} to="/login">Login</Nav.Link>
              <Nav.Link className="text-start w-100" as={Link} to="/signup">Signup</Nav.Link>
            </Nav>
          )}
        </Container>
      </Navbar>
      <Outlet />
    </>
  )
}

export default NavSidebar;