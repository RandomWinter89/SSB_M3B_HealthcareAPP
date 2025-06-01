import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { AuthContext } from "../../components/AuthProvide";

import { useContext, useState, useEffect } from "react";
import { createStuff, createStuffProfile } from "../../features/stuffsSlice";
import { createUser, createUserProfile } from "../../features/usersSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Form, Col, Row, Button } from "react-bootstrap";

//Function Validation
const isHealthcareEmail = (email) => {
  return email.endsWith("@healthcare.com");
};

//Register new account
const RegisterNewAccount = ({ setFile }) => {
  //Setup email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //Setup personal detail
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("Male");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [birthDate, setBirthDate] = useState("");

  //Setup position and role
  const [position, setPosition] = useState("Registered Nurse");
  const [specialist, setSpecialist] = useState("Endocrinologist");
  const [department, setDepartment] = useState("Endocrinology");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const dispatch = useDispatch();
  const auth = getAuth();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password.trim().length < 6)
      return alert("Password must be at least 6 characters or more");

    if (password !== confirmPassword) return alert("Passwords do not match");

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      console.log(email);

      if (isHealthcareEmail(email)) {
        dispatch(
          createStuff({
            name,
            phone,
            email,
            age,
            gender,
            address,
            birthDate,
            position,
            specialist,
            department,
          }),
        );
        setPosition("Registered Nurse");
        setSpecialist("Endocrinologist");
        setDepartment("Endocrinology");
      } else {
        dispatch(
          createUser({ name, phone, email, age, gender, address, birthDate }),
        );
      }

      setName("");
      setAge(0);
      setGender("Male");
      setPhone("");
      setAddress("");
      setBirthDate("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1 className="mb-2">Register Account</h1>
      <p>Gmail will automatically set uncapitalize.</p>
      <p>Password must be 6 more more</p>
      <p>Admin access can use @healthcare.com</p>
      <Form onSubmit={handleSignup}>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="text"
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
        />

        <Row className="mt-2">
          <Form.Group as={Col}>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
        </Row>

        <hr />

        <h2>Personal Detail</h2>
        <Form.Group className="mb-2">
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>
            {!isHealthcareEmail(email) ? "Username" : "Stuff Name"}
          </Form.Label>
          <Form.Control
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Name"
          />
        </Form.Group>

        <Row className="mb-2">
          <Form.Group as={Col}>
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              placeholder="Phone number"
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Age</Form.Label>
            <Form.Control
              type="number"
              onChange={(e) => setAge(e.target.value)}
              value={age}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Gender</Form.Label>
            <Form.Select
              onChange={(e) => setGender(e.target.value)}
              value={gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Select>
          </Form.Group>
        </Row>

        <Form.Group className="mb-2">
          <Form.Label>Address</Form.Label>
          <Form.Control
            as="textarea"
            onChange={(e) => setAddress(e.target.value)}
            value={address}
            placeholder="Register your address number"
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Birth of Date</Form.Label>
          <Form.Control
            type="date"
            onChange={(e) => setBirthDate(e.target.value)}
            value={birthDate}
          />
        </Form.Group>

        {isHealthcareEmail(email) && (
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Position</Form.Label>
              <Form.Select
                onChange={(e) => setPosition(e.target.value)}
                value={position}
              >
                <option value="Registered Nurse">General Practitioner</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Medical Assistant">Medical Assistant</option>
                <option value="Surgical Tech">Surgical Tech</option>
                <option value="Pharmacy Tech">Pharmacy Tech</option>
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Specialist</Form.Label>
              <Form.Select
                onChange={(e) => setSpecialist(e.target.value)}
                value={specialist}
              >
                <option value="Endocrinologist">Endocrinologist</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Department</Form.Label>
              <Form.Select
                onChange={(e) => setDepartment(e.target.value)}
                value={department}
              >
                <option value="Endocrinology">Endocrinology</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Gastroenterology">Gastroenterology</option>
              </Form.Select>
            </Form.Group>
          </Row>
        )}

        <Button className="w-100 mt-4" type="submit">
          Create Account
        </Button>
      </Form>
    </>
  );
};

const Signup = () => {
  const { currentUser } = useContext(AuthContext) || null;
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    //isHealthcareEmail(currentUser.email)
    let userId;
    let email;
    if (currentUser) {
      userId = currentUser.uid;
      email = currentUser.email;
    }

    if (currentUser && isHealthcareEmail(currentUser.email)) {
      dispatch(createStuffProfile({ userId, email, file }));
      navigate("/stuffDashboard");
    } else if (currentUser && !isHealthcareEmail(currentUser.email)) {
      
      dispatch(createUserProfile({ userId, email, file }));
      navigate("/userDashboard");
    }
  }, [currentUser]);

  const NavigateLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <RegisterNewAccount
        setFile={(data) => {
          setFile(data);
          console.log(data);
        }}
      />
      <p className="mt-2">
        Have an account?{" "}
        <a style={{ color: "blue", cursor: "pointer" }} onClick={NavigateLogin}>
          Login
        </a>
      </p>
    </>
  );
};

export default Signup;
