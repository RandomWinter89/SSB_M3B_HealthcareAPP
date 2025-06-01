import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../../components/AuthProvide";

import { fetchAllUsers } from "../../features/usersSlice";
import { fetchAllStuffs, fetchStuff } from "../../features/stuffsSlice";
import { useContext, useEffect } from "react";

import { Table } from "react-bootstrap";

const StuffDashboard = () => {
  const personal = useSelector((state) => state.stuffsData.personal);
  let stuffs = useSelector((state) => state.stuffsData.stuffs); 
  let users = useSelector((state) => state.users.users);
  const dispatch = useDispatch();

  const { currentUser } = useContext(AuthContext);
  const currentStuff = personal?.[0];

  useEffect(() => {
    if (!personal || personal.length === 0)
      dispatch(fetchStuff(currentUser.email));

    if (!stuffs || stuffs.length === 0)
      dispatch(fetchAllStuffs());

    if (!users || users.length === 0)
      dispatch(fetchAllUsers());

    if (currentUser != null) {
      if (personal.length !== 0 && personal[0].email !== currentUser.email) {
        console.log("Refetch all stuff");
        dispatch(fetchStuff(currentUser.email));
        dispatch(fetchAllStuffs());
        dispatch(fetchAllUsers());
      }
    }
  }, [personal, dispatch])
  
  return (
    <>
      {/* Column Main - All Patient */}
      <h1>Patient Dashboard</h1>
      {(users.length == 0 && personal.length == 0) ? <p>No patient</p> :
        <Table striped bordered hover>
          <thead>
            <tr>
              <th className="fs-6">#</th>
              <th className="fs-6">Name</th>
              <th className="fs-6">Age</th>
              <th className="fs-6">Gender</th>
            </tr>
          </thead>
          
          <tbody>
            {users.map((data, index) => {
              if (currentStuff && data.stuff_id === currentStuff.id)
                return (< ></>);
      
              return (
                < >
                  <tr key={data.id}>
                    <td className="fs-6">{index + 1}</td>
                    <td className="fs-6">{data.username}</td>
                    <td className="fs-6">{data.age}</td>
                    <td className="fs-6">{data.gender}</td>
                  </tr>
                </>
              )
            })}
          </tbody>
        </Table>
      }
      
      {/* Column Aside - Other Collegue (bottom) + Calender (top) */}
      <h2>Collegue</h2>
      {(stuffs.length == 0 && personal.length == 0) ? <p>No other doctor</p> : (<>
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
            {stuffs.map((stuff, index) => {
              if (currentStuff && stuff.id === currentStuff.id)
                return (<></>)
                  
              return (< >
                <tr key={stuff.id}>
                  <td className="fs-6">{index + 1}</td>
                  <td className="fs-6">{stuff.stuffname}</td>
                  <td className="fs-6">{stuff.age}</td>
                  <td className="fs-6">{stuff.stuffposition}</td>
                </tr>
              </>)
            })}
          </tbody>
        </Table>
      </>)}
    </>
  );
};

export default StuffDashboard;
