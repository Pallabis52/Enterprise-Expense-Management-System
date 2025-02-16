import React, { useState } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`, credentials);
      dispatch(loginSuccess(response.data));
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <Container>
      <Typography variant="h4">Login</Typography>
      <TextField label="Email" fullWidth onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} />
      <TextField label="Password" type="password" fullWidth onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
      <Button variant="contained" color="primary" onClick={handleLogin}>Login</Button>
    </Container>
  );
};

export default Login;
