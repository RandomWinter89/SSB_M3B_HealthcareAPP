import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { collection, deleteDoc, doc, setDoc, getDocs } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { db, storage } from "../firebase";

const API = import.meta.env.VITE_BACKEND_API;

//===================================================

//Create Stuff ***(DONE)
export const createStuff = createAsyncThunk(
    "stuffs/createStuff",
    async ({name, phone, email, age, gender, address, birthDate, position, specialist, department}) => {
        const database = {
            stuff_name: name,
            stuff_address: address,
            stuff_phone: phone,
            stuff_email: email,
            stuff_age: age,
            stuff_gender: gender,
            stuff_birth_date: birthDate,
            stuff_position: position,
            stuff_specialist: specialist,
            stuff_department: department,
        };

        const res = await axios.post(`${API}/stuffs`, database);
        return res.data;
    }
)

export const createStuffProfile = createAsyncThunk(
    "users/createStuffProfile",
    async ({userId, email, file}) => {
        try {
            let imageUrl = "";

            if (file !== null) {
                const imageRef = ref(storage, `images/${file.name}`);
                const response = await uploadBytes(imageRef, file);
                imageUrl = await getDownloadURL(response.ref);
            }

            const userRef = doc(db, `users/${userId}`); // Reference to the new user document
            await setDoc(userRef, {
                imageUrl,
                email
            });

            console.log("userRef: ", userRef);

            const user = {
                id: userId,
                imageUrl,
                email,
            };

            console.log("User date: ", user);

            return user;
        } catch (error) {
            console.error("Error in createProfile: ", error);
            throw error;
        }
    }
);


//GET All detail ***(DONE)
export const fetchAllStuffs = createAsyncThunk(
    "stuffs/fetchAllStuff",
    async () => {
        const res = await fetch(`${API}/stuffs`);
        const users = await res.json();
        return users;
    }
)

//GET Stuff detail ***(DONE)
export const fetchStuff = createAsyncThunk(
    "stuffs/fetchStuff",
    async (email) => {
        const res = await fetch(`${API}/stuffs/${email}`);
        const userDetail = await res.json();
        return userDetail;
    }
)

//Fetch Profile
export const fetchAllProfile = createAsyncThunk(
    "users/fetchAllProfile",
    async () => {
        try {
            const postsRef = collection(db, "users"); // Reference to the global "posts" collection
            const querySnapshot = await getDocs(postsRef);

            const docs = querySnapshot.docs.map((doc) => (
                { id: doc.id, ...doc.data() }
            ));

            return docs;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
)

//Update Stuff detail ***(DONE)
export const updateStuffDetail = createAsyncThunk(
    "stuffs/updateStuffDetail",
    async ({name, phone, address, id}) => {
        const database = {
            stuff_name: name,
            stuff_phone: phone,
            stuff_address: address,
        };

        const res = await axios.put(`${API}/stuffs/${id}`, database);
        console.log(res.data);
        return res.data;
    }
)

//Remove user detail ***(DONE)
export const removeStuffDetail = createAsyncThunk(
    "stuffs/removeStuffDetail",
    async (id) => {
        const res = await axios.delete(`${API}/stuffs/${id}`);
        return res.data;
    }
)

//Remove Profile
export const removeStuffProfile = createAsyncThunk(
    "users/removeStuffProfile",
    async ({userId, postId}) => {
        try {
            const userRef = doc(db, `users/${userId}`);
            await deleteDoc(userRef);
            return postId;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
)

//===================================================

const stuffsSlice = createSlice({
    name: "stuffSlice",
    initialState: { stuffs: [], profile: [], personal: []},
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createStuff.fulfilled, (state, action) => {
            state.persProfile = action.payload;
            console.log("Fetch stuff: ", action.payload);
            console.log("Created : ", state.stuffs);
        })
        .addCase(createStuffProfile.fulfilled, (state, action) => {
            state.profile = [action.payload, ...state.profile];
        })
        .addCase(fetchAllStuffs.fulfilled, (state, action) => {
            state.stuffs = action.payload;
        })
        .addCase(fetchAllProfile.fulfilled, (state, action) => {
            state.profile = action.payload.filter((user) => user.email.endsWith("@healthcare.com"));
            console.log("Profile: ", state.profile, " + Action: ", action.payload);
        })
        .addCase(fetchStuff.fulfilled, (state, action) => {
            state.personal = action.payload;
        })
        .addCase(updateStuffDetail.fulfilled, (state, action) => {
            state.personal = action.payload.updatedStuff;
            console.log("Extract: ", state.personal);
        })
        .addCase(removeStuffDetail.fulfilled, (state) => {
            state.personal = [];
        })
    }
})

export default stuffsSlice.reducer;