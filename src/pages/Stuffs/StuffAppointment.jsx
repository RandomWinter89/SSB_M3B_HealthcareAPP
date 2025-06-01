import { AuthContext } from "../../components/AuthProvide";

import { useDispatch, useSelector } from "react-redux";
import { fetchStuff } from "../../features/stuffsSlice";
import { fetchAllAppts } from "../../features/apptsSlice";

import { useContext, useEffect, useState } from "react";

import { Card } from "react-bootstrap";

const StuffAppointment = () => {
  const appts = useSelector((state) => state.appointments.appts);
  const personal = useSelector((state) => state.stuffsData.personal);
  const [ownAppts, setOwnAppts] = useState([]);
  const [collegueAppts, setCollegueAppts] = useState([]);
  const [triggerBug, setTriggerBug] = useState(0);

  const { currentUser } = useContext(AuthContext);
  const dispatch = useDispatch();

  const sortAppts = () => {
    const ownAppts = appts.filter(appt => appt.stuff_id === personal[0].id);
    const collegueAppts = appts.filter(appt => appt.stuff_id !== personal[0].id);

    setOwnAppts(ownAppts);
    setCollegueAppts(collegueAppts);
  }

  useEffect(() => {
    if (appts.length === 0)
      dispatch(fetchAllAppts());

    if (personal.length === 0 && triggerBug != 4) {
      dispatch(fetchStuff(currentUser.email));
      setTriggerBug(triggerBug + 1);
    }

    if (appts !== 0 && personal.length !== 0)
      sortAppts();
  }, [dispatch, appts, personal])
  
  return (
    < >
      <h1>Personal Appointment</h1>
      {ownAppts.map((data, index) => (
        <Card key={index} className="mb-3" style={{ width: '24rem' }}>
          <Card.Body>
            <h4 className="mb-4">{data.servicetype} at {data.apptdate.split("T")[0]}</h4>
            <p className="mb-1">Appointment time: {data.appttime}</p>
            <p className="mb-1">Service Type: {data.servicetype}</p>
            <p className="mb-1">Description: {data.description}</p>
          </Card.Body>
        </Card>
      ))}
      
      <hr/>
      
      <h2>Collegue Appointment</h2>
      {collegueAppts.map((data, index) => (
        <Card key={index} className="mb-3" style={{ width: '24rem' }}>
          <Card.Body>
            <h4 className="mb-4">{data.servicetype} at {data.apptdate.split("T")[0]}</h4>
            <p className="mb-1">Appointment time: {data.appttime}</p>
            <p className="mb-1">Service Type: {data.servicetype}</p>
            <p className="mb-1">Description: {data.description}</p>
          </Card.Body>
        </Card>
      ))}
    </>
  )
}

export default StuffAppointment;