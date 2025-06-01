import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAppt, fetchAllAppts } from "../features/apptsSlice";
import { Modal, Form, Button } from "react-bootstrap";

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

const NewAppts = ({show, handleClose}) => {
  const stuffs = useSelector((state) => state.stuffsData.stuffs);
  const appts = useSelector((state) => state.appointments.appts);
  const user = useSelector((state) => state.users.users);
  const dispatch = useDispatch();

  const [selectedDoctor, setSelectedDoctor] = useState("None");
  const [selectedDate, setSelectedDate] = useState("None");
  const [selectedTime, setSelectedTime] = useState("None");
  const [availAppts, setAvailAppts] = useState([]);

  const [service, setService] = useState("None");
  const [desc, setDesc] = useState("None");

  useEffect(() => {
    //appts.length != 0 && 
    if (selectedDoctor !== "Null")
      setAvailAppts(getAvailableDates(appts, parseInt(selectedDoctor)));

    if (appts.length === 0) 
      dispatch(fetchAllAppts());
  }, [selectedDoctor])

  const onCreateAppts = (e) => {
    e.preventDefault();

    if (selectedDoctor === "None")
      return alert("Please select a doctor");

    if (selectedDate === "None" || selectedTime === "None")
      return alert("Please select a date and time");

    if (service.trim().length === 0 || desc.trim().length === 0)
      return alert("Please fill in all fields");

    // Remember to add reference
    const userID = user[0].id;
    dispatch(createAppt({service, desc, selectedDate, selectedTime, userID, selectedDoctor}))
    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Book Appointment</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={onCreateAppts}>
          <Form.Group className="mb-2">
            <Form.Label>Doctor</Form.Label>
            <Form.Select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
              <option value="None">None</option>
              {stuffs.map((stuff, index) => (
                <option key={index} value={stuff.id}>{stuff.stuffname}</option>
              ))}
            </Form.Select>
          </Form.Group>
    
          {selectedDoctor !== "None" && (
            < >
              <Form.Group className="mb-2">
                <Form.Label>Date</Form.Label>
                <Form.Select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                  <option value="None">None</option>
                  {availAppts.map((date, index) => (
                    <option key={index} value={date}>{date}</option>
                  ))}
                </Form.Select>
              </Form.Group>
    
              {selectedDate != "None" && (
                <Form.Group className="mb-2">
                  <Form.Label>Time</Form.Label>
                  <Form.Select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
                    <option value="None">None</option>
                    {getAvailableTimes(appts, selectedDate, parseInt(selectedDoctor)).map((time, index) => (
                      <option key={index} value={time}>{time}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
            </>
          )}
  
          <Form.Group className="mb-2">
            <Form.Label>Service Type</Form.Label>
            <Form.Select onChange={(e) => setService(e.target.value)}>
              <option value="None">None</option>
              <option value="Blood Test">Blood Test</option>
              <option value="Body Checkup">Body Checkup</option>
              <option value="Vaccination">Vaccination</option>
              <option value="Consultant">Consultant</option>
            </Form.Select>
          </Form.Group>
  
          <Form.Group className="mb-2">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" onChange={(e) => setDesc(e.target.value)} placeholder="Write your description"/>
          </Form.Group>
    
          <Button type="submit">Create Appointment</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default NewAppts;