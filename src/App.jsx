import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvide";
import { Provider } from "react-redux";
import store from "./store";

import { Container, Row, Col } from "react-bootstrap";

import Login from "./pages/Registraction/Login";
import Signup from "./pages/Registraction/Signup";

import StuffDashboard from "./pages/Stuffs/StuffDashboard";
import StuffDetail from "./pages/Stuffs/StuffDetail";
import StuffAppointment from "./pages/Stuffs/StuffAppointment";

import UserDashboard from "./pages/Users/UserDashboard";
import UserDetail from "./pages/Users/UserDetail";

import NavSidebar from "./components/NavSidebar";

export default function App() {
  return (
    <AuthProvider>
      <Provider store={store}>
        <BrowserRouter>
          {/* Bootstrap Visualization */}
          <Container fluid>
            <Row className="flex-nowrap">
              <Col className="col-2 vh-100 px-0 w-15" style={{position: "sticky", top: "0"}}>
                <NavSidebar />
              </Col>

              <Col className="p-4">
                <Routes>
                  <Route path="/userDashboard" element={<UserDashboard />} />
                  <Route path="/userDetail" element={<UserDetail />} />
                  
                  <Route path="/stuffDashboard" element={<StuffDashboard />} />
                  <Route path="/stuffAppointment" element={<StuffAppointment />} />
                  <Route path="/stuffDetail" element={<StuffDetail />} />

                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="*" element={<Login />} />
                </Routes>
              </Col>
            </Row>
          </Container>
          {/* End of Bootstrap  */}
        </BrowserRouter>
      </Provider>
    </AuthProvider>
  );
}
