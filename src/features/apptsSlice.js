import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_API;


//===================================================

//CREATE APPT *** (Done)
export const createAppt = createAsyncThunk(
    "appts/createAppt",
    async ({service, desc, selectedDate, selectedTime, userID, selectedDoctor}) => {
        const database = {
            service_type: service,
            description: desc,
            date: selectedDate,
            time: selectedTime,
            patient: userID,
            doctor: selectedDoctor
        };

        console.log("Receive ID: ", database);

        const res = await axios.post(`${API}/appts`, database);
        return res.data;
    }
)

//GET ALL APPT - Patient Appointments
export const fetchAllAppts = createAsyncThunk(
    "appts/fetchAllAppts",
    async () => {
        const res = await fetch(`${API}/appts`);
        const data = await res.json();
        return data;
    }
)

//GET USER APPT ***(DONE)
export const fetchUserAppts = createAsyncThunk(
    "appts/fetchUserDetail",
    async (userID) => {
        const res = await fetch(`${API}/appts/users/${userID}`);
        const data = await res.json();
        return data;
    }
)

//GET DOCTOR APPT 
export const fetchDoctorAppts = createAsyncThunk(
    "appts/fetchPatients",
    async (stuffID) => {
        const res = await fetch(`${API}/appts/doctor/${stuffID}`);
        const data = await res.json();
        return data;
    }
)

//UPDATE APPT *** (Done)
export const updateApptDetail = createAsyncThunk(
    "appts/updateApptDetail",
    async ({selectedDate, selectedTime, id}) => {
        const database = {
            appts_date: selectedDate,
            appts_time: selectedTime
        };

        const res = await axios.put(`${API}/appts/${id}`, database);
        console.log(res.data);
        return res.data;
    }
)

//REMOVE APPT *** (Done)
export const removeAppt = createAsyncThunk(
    "appts/removeAppt",
    async (id) => {
        const res = await axios.delete(`${API}/appts/${id}`);
        return res.data;
    }
)

//===================================================

const apptsSlice = createSlice({
    name: "apptsSlice",
    initialState: { appts: [] },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createAppt.fulfilled, (state, action) => {
            state.appts = [action.payload, ...state.appts];
        })
        .addCase(fetchAllAppts.fulfilled, (state, action) => {
            state.appts = action.payload;
        })
        .addCase(fetchUserAppts.fulfilled, (state, action) => {
            console.log("Appointment: ", action.payload);
            state.appts = action.payload;
        })
        .addCase(fetchDoctorAppts.fulfilled, (state, action) => {
            state.appts = action.payload;
        })
        .addCase(updateApptDetail.fulfilled, (state, action) => {
            if (action.payload.updatedAppt) { 
                state.appts = state.appts.map((appt) => {
                    if (appt.id === action.payload.updatedAppt.id) {
                        return action.payload.updatedAppt;
                    } else {
                        return appt;
                    }
                });
            };
        })
        .addCase(removeAppt.fulfilled, (state, action) => {
            if (action.payload.deletedAppt)
                state.appts = state.appts.filter((appt) => 
                    appt.id !== action.payload.deletedAppt.id
                );
        })
    }
})

export default apptsSlice.reducer;