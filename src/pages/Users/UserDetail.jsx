import { updateUserDetail, removeUserDetail, fetchUserProfile, fetchUserDetail } from "../../features/usersSlice";
import { useDispatch, useSelector } from "react-redux";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../components/AuthProvide";
import { getAuth, deleteUser } from "firebase/auth";

import { Button, Image } from "react-bootstrap";

const UserDetail = () => {
  const userData = useSelector((state) => state.users.users);
  const userProfile = useSelector((state) => state.users.profile);
  const [isUpdate, setIsUpdate] = useState(false);
  const [triggerBug, setTriggerBug] = useState(0);
  const [profile, setProfile] = useState(null);
  
  //Profile Update
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const { currentUser } = useContext(AuthContext);
  const dispatch = useDispatch();
  const auth = getAuth();

  useEffect(() => {
    if (userData.length === 0 && triggerBug != 3){
      dispatch(fetchUserDetail(currentUser.email));
      setTriggerBug(triggerBug + 1);
      console.log(triggerBug);
    }

    if (userData.length !== 0) {
      setName(userData[0].username);
      setPhone(userData[0].phonenumber);
      setAddress(userData[0].address);
    }

    if (userProfile.length === 0) {
      dispatch(fetchUserProfile());
    }

    if (userProfile.length !== 0 && profile == null) {
      const data = userProfile.filter((data) => data.email === currentUser.email);
      setProfile(data[0]);
    } 

  }, [dispatch, userProfile, userData, profile]);

  const onRemove = async () => {
    const id = userData[0].id;
    dispatch(removeUserDetail(id));
    try {
      await deleteUser(currentUser);
      console.log("User has removed");
      await auth.signOut();
    } catch (error) {
      console.log(error);
    }
  }

  const onToggleUpdate = () => {
    setIsUpdate(!isUpdate);
  }

  const onSubmitUpdate = (e) => {
    e.preventDefault();
    const id = userData[0].id;
    dispatch(updateUserDetail({name, phone, address, id}));
    onToggleUpdate();
  }

  return (
    < >
      {userData.length == 0 
        ? (<h1>Loading...</h1>)
        : (<>
          <h1>Personal Details</h1>
          {profile && <Image src={profile.imageUrl} style={{width: 200}} />}
          <div>
            {!isUpdate
              ? <p><strong>Name</strong>: {userData[0].username}</p>
              : <input 
                  type="text" 
                  placeholder={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
            }
            <hr/>
            <p><strong>Age</strong>: {userData[0].age}</p>
            <p><strong>Gender</strong>: {userData[0].gender}</p>
            <p><strong>Birth of Date</strong>: {userData[0].birthDate}</p>
            <hr/>
            {!isUpdate
              ? <p><strong>Phone</strong>: {userData[0].phonenumber}</p>
              : <input 
                  type="text" 
                  placeholder={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
            }
            <p><strong>Email</strong>: {userData[0].email}</p>

            {!isUpdate
              ? <p><strong>Address</strong>: {userData[0].address}</p>
              : <input 
                  type="text" 
                  placeholder={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                />
            }
          </div>

          <h3>Health Inspection</h3>
          <div>
            <p><strong>Health</strong>: {userData[0].health}</p>
            <p><strong>Status</strong>: {userData[0].health_status}</p>
            <p><strong>Description</strong>: {userData[0].description}</p>
          </div>

          <h5>Modification Action</h5>
          <Button className="me-2" onClick={onToggleUpdate}>
              {isUpdate ? "Cancel Update" : "Activate Update"}
          </Button>
          {isUpdate && <Button className="me-2" onClick={onSubmitUpdate}>Update Detail</Button>}
          <Button onClick={onRemove}>Delete Account</Button>
        </>)
      }
    </>
  )
}

export default UserDetail;