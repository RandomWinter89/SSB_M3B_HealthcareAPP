import { updateApptDetail, removeAppt } from "../features/apptsSlice";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

const timeSlots = ["08:00:00", "10:00:00", "12:00:00", "14:00:00", "16:00:00"];

//Grab next 30 days
const next30Day = () => {
  let dates = [];
  const today = new Date();

  for (let i = 1; i < 30; i++) {
    let nextDate = new Date();
    nextDate.setDate(today.getDate() + i);
    dates.push(nextDate.toISOString().split('T')[0]);
  }

  return dates;
}

//Check available dates
const getAvailableDates = (bookedDates, doctorID) => {
  let next30Days = next30Day();
  let bookedSet = new Set(bookedDates.filter(appt => appt.stuff_id === doctorID).map(appt => appt.apptdate));

  return next30Days.filter(date => !bookedSet.has(date));
}

//Check available time
const getAvailableTimes = (bookedAppointments, date, doctorId) => {
  let bookedTimes = bookedAppointments.filter(
    appt => appt.apptdate.split('T')[0] === date && appt.stuff_id === doctorId
  ).map(appt => appt.appttime);
  let timeSet = new Set(bookedTimes);

  return timeSlots.filter(time => !timeSet.has(time));
}

const ApptsModal = ({show, handleClose, appointmentData}) => {
  const stuffs = useSelector((state) => state.stuffsData.stuffs.find(data => data.id === appointmentData.stuff_id));
  const user = useSelector((state) => state.users.users.find(data => data.id === appointmentData.user_id));
  const appts = useSelector((state) => state.appointments.appts);
  
  const [selectedDate, setSelectedDate] = useState(appointmentData.apptdate.split("T")[0]);
  const [selectedTime, setSelectedTime] = useState(appointmentData.appttime);
  const [availAppts, setAvailAppts] = useState([]);
  const dispatch = useDispatch();

  const [isUpdate, setIsUpdate] = useState(false);

  const onToggleUpdate = () => {
    setIsUpdate(!isUpdate);
  }

  const onHandle_UpdateAppts = (e) => {
    e.preventDefault();

    if (selectedDate === "None" || selectedTime === "None")
      return alert("Please select a date and time");

    const id = appointmentData.id;
    dispatch(updateApptDetail({selectedDate, selectedTime, id}));
    onToggleUpdate();
  }
  
  const onHandle_DeleteAppts = () => {
    dispatch(removeAppt(appointmentData.id));
    handleClose();
  }

  useEffect(() => {
    setAvailAppts(getAvailableDates(appts, appointmentData.stuff_id));
  }, [])
  
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        {user.username}'s {appointmentData.servicetype} appointment with {stuffs.stuffname}
      </Modal.Header>

      <Modal.Body>
        <p>Description: {appointmentData.description}</p>
        <hr/>
        <p>Patient: {user.username}</p>
        <p>Doctor: {stuffs.stuffname}</p>
        <hr/>
        {!isUpdate 
          ? <p>Date: {appointmentData.apptdate.split("T")[0]}</p>
          : <Form.Select className="mb-3" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
            <option value="None">None</option>
            {availAppts.map((date, index) => (<option value={date} key={index}>{date}</option>))}
          </Form.Select>
        }
        {!isUpdate 
          ? <p>Time: {appointmentData.appttime}</p>
          : <Form.Select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
            <option value="None">None</option>
              {getAvailableTimes(appts, selectedDate, appointmentData.id).map((time, index) => (
              <option key={index} value={time}>{time}</option>
            ))}
          </Form.Select>
        }
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onToggleUpdate}>
          {!isUpdate ? "Modify Appointment" : "Cancel Modify"}
        </Button>
        {isUpdate && <Button onClick={onHandle_UpdateAppts}>Update Appointment</Button>}
        <Button onClick={onHandle_DeleteAppts}>Delete Appointment</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ApptsModal;