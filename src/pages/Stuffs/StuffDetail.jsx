import { updateStuffDetail, removeStuffDetail, fetchStuff, fetchAllProfile } from "../../features/stuffsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../components/AuthProvide";
import { getAuth, deleteUser } from "firebase/auth";

import { Button, Image } from "react-bootstrap";

const StuffDetail = () => {
  const personInfo = useSelector((state) => state.stuffsData.personal);
  const profiles = useSelector((state) => state.stuffsData.profile);
  const [isUpdate, setIsUpdate] = useState(false);
  const [triggerBug, setTriggerBug] = useState(0);

  //Profile Update
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profile, setProfile] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const dispatch = useDispatch();
  const auth = getAuth();
  
  useEffect(() => {
    if (personInfo.length == 0 && triggerBug != 3){
      console.log("Fetching");
      dispatch(fetchStuff(currentUser.email));
      setTriggerBug(triggerBug + 1);
    }

    if (personInfo.length != 0) {
      setName(personInfo[0].stuffname);
      setPhone(personInfo[0].phonenumber);
      setAddress(personInfo[0].address);
    }

    if (profiles.length === 0) {
      dispatch(fetchAllProfile());
    }

    if (profiles.length !== 0 && profile == null) {
      const data = profiles.find((data) => data.email === currentUser.email);
      setProfile(data);
    }
  }, [dispatch, personInfo, profiles, profile]);

  const onRemove = async () => {
    const id = personInfo[0].id;
    dispatch(removeStuffDetail(id));
    try {
      await deleteUser(currentUser);
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
    const id = personInfo[0].id;
    dispatch(updateStuffDetail({name, phone, address, id}));
    onToggleUpdate();
  }
  
  return (
    < >
      {personInfo.length == 0 
        ? (<h1>Loading...</h1>)
        : (<>
          <h1>Personal Details</h1>
          {profile && <Image src={profile.imageUrl} style={{width: 200}} />}
          <div>
            {!isUpdate
              ? <p><strong>Name</strong>: {personInfo[0].stuffname}</p>
              : <input 
                  type="text" 
                  placeholder={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
            }
            <hr/>
            <p><strong>Age</strong>: {personInfo[0].age}</p>
            <p><strong>Gender</strong>: {personInfo[0].gender}</p>
            <p><strong>Birth of Date</strong>: {personInfo[0].birthDate}</p>
            <hr/>
            {!isUpdate
              ? <p><strong>Phone</strong>: {personInfo[0].phonenumber}</p>
              : <input 
                  type="text" 
                  placeholder={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
            }
            <p><strong>Email</strong>: {personInfo[0].email}</p>

            {!isUpdate
              ? <p><strong>Address</strong>: {personInfo[0].address}</p>
              : <input 
                  type="text" 
                  placeholder={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                />
            }
          </div>

          <h3>Position</h3>
          <div>
            <p><strong>Position</strong>: {personInfo[0].stuffposition}</p>
            <p><strong>Specialist</strong>: {personInfo[0].specialist}</p>
            <p><strong>Department</strong>: {personInfo[0].department}</p>
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

export default StuffDetail;