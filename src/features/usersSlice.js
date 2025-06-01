import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { collection, deleteDoc, doc, setDoc, getDocs } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { db, storage } from "../firebase";

const API = import.meta.env.VITE_BACKEND_API;

//===================================================

//Create User ***(DONE)
export const createUser = createAsyncThunk(
    "users/createUser",
    async ({ name, phone, email, age, gender, address, birthDate }) => {
        const database = {
            user_name: name,
            user_phone: phone,
            user_email: email,
            user_age: age,
            user_gender: gender,
            user_address: address,
            user_birth_date: birthDate,
        };

        const res = await axios.post(`${API}/users`, database);
        return res.data;
    },
);

export const createUserProfile = createAsyncThunk(
    "users/createProfile",
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
export const fetchAllUsers = createAsyncThunk(
    "users/fetchAllUsers",
    async () => {
        const res = await fetch(`${API}/users`);
        const users = await res.json();
        return users;
    },
);

export const fetchUserProfile = createAsyncThunk(
    "users/fetchUserProfile",
    async () => {
        try {
            const postsRef = collection(db, "users");
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

//GET Personal detail ***(DONE)
export const fetchUserDetail = createAsyncThunk(
    "users/fetchUserDetail",
    async ( email ) => {
        const res = await fetch(`${API}/users/${email}`);
        const userDetail = await res.json();
        return userDetail;
    },
);

//GET Patient detail (STUFF) ***(need test)
export const fetchPatients = createAsyncThunk(
    "users/fetchPatients",
    async (stuff_id) => {
        const res = await fetch(`${API}/users/${stuff_id}/doctor`);
        const users = await res.json();
        return users;
    },
);

//Update Personal detail ***(DONE)
export const updateUserDetail = createAsyncThunk(
    "users/updateUserDetail",
    async ({name, phone, address, id}) => {
        const database = {
            user_name: name,
            user_phone: phone,
            user_address: address,
        };

        const res = await axios.put(`${API}/users/detail/${id}`, database);
        return res.data;
    },
);

//Update Health detail (STUFF) ***(Should work)
export const updateUserHealth = createAsyncThunk(
    "users/updateUserHealth",
    async ({ status, health, description, id }) => {
        // const userId = decode.id;

        const database = {
            patient_status: status,
            patient_health: health,
            patient_description: description,
        };

        const res = await axios.put(`${API}/users/health/${id}`, database);
        return res.data;
    },
);

//Remove user detail ***(DONE)
export const removeUserDetail = createAsyncThunk(
    "users/removeUserDetail",
    async (id) => {
        const res = await axios.delete(`${API}/users/${id}`);
        return res.data;
    },
);

export const removeUserProfile = createAsyncThunk(
    "users/removeUserProfile",
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

const usersSlice = createSlice({
    name: "usersSlice",
    initialState: { users: [], profile: []},
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createUser.fulfilled, (state, action) => {
                state.users = action.payload;
            })
            .addCase(createUserProfile.fulfilled, (state, action) => {
                state.profile = [action.payload, ...state.profile];
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.users = action.payload;
            })
            .addCase(fetchUserDetail.fulfilled, (state, action) => {
                state.users = action.payload;
            })
            .addCase(fetchPatients.fulfilled, (state, action) => {
                state.users = action.payload;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.profile = action.payload.filter((user) => !user.email.endsWith("@healthcare.com"));
            })
            .addCase(updateUserDetail.fulfilled, (state, action) => {
                if (action.payload.updatedUser)
                    state.users = state.users.map((user) => {
                        if (user.id === action.payload.updatedUser.id) {
                            return action.payload.updatedUser;
                        } else {
                            return user;
                        }
                    });
            })
            .addCase(updateUserHealth.fulfilled, (state, action) => {
                if (action.payload.updatedUser) {
                    state.users = state.users.map((user) => {
                        if (user.id === action.payload.updatedUser.id) {
                            return action.payload.updatedUser;
                        } else {
                            return user;
                        }
                    });
                }
            })
            .addCase(removeUserDetail.fulfilled, (state, action) => {
                if (action.payload.deletedUser)
                    state.users = state.users.filter(
                        (user) => user.id !== action.payload.deletedUser.id,
                    );
            })
            .addCase(removeUserProfile.fulfilled, (state, action) => {
                const deletedProfileId = action.payload;
                state.profile = state.profile.filter(
                    (profile) => profile.id !== deletedProfileId,
                )
            })
    },
});

export default usersSlice.reducer;
