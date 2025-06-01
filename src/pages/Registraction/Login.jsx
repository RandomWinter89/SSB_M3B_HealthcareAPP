import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { AuthContext } from "../../components/AuthProvide";

import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

import { Form, Button } from "react-bootstrap";

const isHealthcareEmail = (email) => {
  return email.endsWith("@healthcare.com");
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { currentUser } = useContext(AuthContext) || null;
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    if (currentUser && isHealthcareEmail(currentUser.email)) {
      navigate("/stuffDashboard");
    }

    if (currentUser && !isHealthcareEmail(currentUser.email)) {
      navigate("/userDashboard");
    }
  }, [currentUser])

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log("Invalid Email or Password: ", error.code, error.message);
      console.error(error);
    }
  }

  const NavigateSignup = () => {
    navigate("/signup");
  }
  
  return (
    < >
      <h1 className="mb-4">Login your account</h1>
      <Form onSubmit={handleLogin}>
        <Form.Label>Email</Form.Label>
        <Form.Control type="text" onChange={(e) => setEmail(e.target.value)}/>
        
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" onChange={(e) => setPassword(e.target.value)}/>

        <Button className="mt-4 w-100" type="submit">Login</Button>
      </Form>

      <p className="mt-2">Don't have an account? <a style={{ color: "blue", cursor: "pointer"}} onClick={NavigateSignup}>Signup</a></p>
    </>
  )
}

export default Login;