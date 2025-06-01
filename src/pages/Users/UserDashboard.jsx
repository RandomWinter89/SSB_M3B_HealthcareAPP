import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../components/AuthProvide";

import { fetchAllStuffs } from "../../features/stuffsSlice";
import { fetchAllAppts } from "../../features/apptsSlice";
import { fetchUserDetail, fetchUserProfile } from "../../features/usersSlice";

import NewAppts from "../../components/NewAppts";
import ApptsModal from "../../components/ApptsModal";

import { Table, Col, Row, Button, Card } from "react-bootstrap";

const UserDashboard = () => {
  const [apptId, setApptId] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showApptModal, setShowApptModal] = useState(false);
  const [currentAppt, setCurrentAppt] = useState([]);
  
  let stuffs = useSelector((state) => state.stuffsData.stuffs) || [];
  let appts = useSelector((state) => state.appointments.appts) || [];
  let profile = useSelector((state) => state.users.profile) || [];
  const user = useSelector((state) => state.users.users);
  const { currentUser } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user || user.length === 0) {
      dispatch(fetchUserDetail(currentUser.email));
    }

    if (profile || profile.length === 0) {
      dispatch(fetchUserProfile());
    }

    if (!stuffs || stuffs.length === 0) {
      dispatch(fetchAllStuffs());
    }

    if (!appts || appts.length === 0) {
      dispatch(fetchAllAppts());
    }

    if (user && user.length !== 0 && user[0].email !== currentUser.email) {
      console.log("Fetching ", user[0].email);
      stuffs = [];
      appts = [];
      profile = [];
      setCurrentAppt([]);
      
      dispatch(fetchUserDetail(currentUser.email));
      dispatch(fetchUserProfile());
      dispatch(fetchAllStuffs());
      dispatch(fetchAllAppts());
    }
  }, [user, dispatch])

  useEffect(() => {
    if (appts.length !== 0 && user.length !== 0)
      setCurrentAppt(appts.filter((data) => data.user_id === user[0].id));
    
  }, [appts, user])
  
  return (
    <Row>
      <Col>
        <h1 className="mb-3">Upcoming Appointment</h1>
        {currentAppt.length != 0 && currentAppt.map((data, index) => (
          <Card key={index} className="mb-3" style={{ width: '24rem' }}>
            <Card.Body>
              <h4>{data.servicetype} at {data.apptdate.split("T")[0]}</h4>
              <p>Appointment time: {data.appttime}</p>
              <Button key={index} className="w-100" onClick={() => {setShowApptModal(true); setApptId(data.id)}}>
                Open more
              </Button>
            </Card.Body>
          </Card>
        ))}
      </Col>
      
      
      <Col>
        {stuffs.length == 0 ? <p>Can't book appointment, without doctor exist</p> : (<>
          <h1 className="mb-3">Book Appointment</h1>
          <Button onClick={() => setShowModal(true)}>Book an Appointment</Button>
          <hr/>
          <h2>Doctor</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="fs-6">#</th>
                <th className="fs-6">Name</th>
                <th className="fs-6">Age</th>
                <th className="fs-6">Position</th>
              </tr>
            </thead>
            <tbody>
              {stuffs.map((stuff, index) => 
                  <tr key={stuff.id}>
                    <td className="fs-6">{index + 1}</td>
                    <td className="fs-6">{stuff.stuffname}</td>
                    <td className="fs-6">{stuff.age}</td>
                    <td className="fs-6">{stuff.stuffposition}</td>
                  </tr>
                )
              }
            </tbody>
          </Table>
        </>)}
      </Col>

      {showModal && <NewAppts show={showModal} handleClose={() => setShowModal(false)}/>}
      {showApptModal && <ApptsModal show={showApptModal} handleClose={() => setShowApptModal(false)} appointmentData={appts.find(data => data.id === apptId)} />}
    </Row>
  )
};

export default UserDashboard;