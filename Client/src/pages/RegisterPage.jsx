import React from 'react';
import { Form, Button, Container, Row, Col, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux"
import { setRedxUserState } from '../../redux/slices/loginRegisterSlice';
import {FaEye , FaEyeSlash} from 'react-icons/fa6'

const RegisterPage = () => {
    const apiUrl = import.meta.env.VITE_API_URI;
    const [showPassword,setShowPassword]=useState(false)
    const [showPasswordRepeat,setShowPasswordRepeat]=useState(false)
    const [validated, setValidated] = useState(false);
    const [registerUserResponseState, setRegisterUserResponseState] = useState({
        success: "",
        error: "",
        loading: false,
    });
    const [passwordsMatchState, setPasswordsMatchState] = useState(true);
    const dispatch = useDispatch()

    const userRegisterApiRequest = async (name, lastname, email, password) => {
        const { data } = await axios.post(`${apiUrl}/api/users/register`, {
            name, lastname, email, password
        })
        sessionStorage.setItem("userInfo", JSON.stringify(data.userCreated));
        return data
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget.elements

        const name = form.name.value
        const lastname = form.lastname.value
        const email = form.email.value
        const password = form.password.value
        const confirmPassword = form.confirmPassword.value
        if(!lastname||!email||!password||!confirmPassword||!name){
            setValidated(true);
            return
        }
        if (e.currentTarget.checkValidity() === true &&
            name &&
            lastname &&
            email &&
            password === confirmPassword
        ) {
            setRegisterUserResponseState({ loading: true });
            userRegisterApiRequest(name,lastname,email,password).then(res => {
                    setRegisterUserResponseState({
                        success: res.success,
                        loading: false,
                        error: ""
                    })

                    if (res.success === "user created") {
                        dispatch(setRedxUserState(res.userCreated))
                        window.location.assign('/')
                    }

                })
                .catch((err) => {
                    // console.log(err.response.data.message ? err.response.data.message : err.response.data)
                    setRegisterUserResponseState({
                        error: err.response.data.message ? err.response.data.message : err.response.data
                    })
                })

        }
        setValidated(true)

    }

    const onChange = () => {
        const password = document.querySelector('input[name=password]');
        const confirmPassword = document.querySelector('input[name=confirmPassword]');

        if (confirmPassword.value === password.value) {
            setPasswordsMatchState(true)
        } else {
            setPasswordsMatchState(false)
        }

    }

    return (
        <div className='register-bg pb-5'>
            <Container className="text-light">
                <Row className="pt-4 justify-content-center">
                    <Col md={6}>
                        <h2 className="text-center">Register</h2>

                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="validationCustom01">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="First Name"
                                    name="name" />
                                <Form.Control.Feedback type="invalid">Please enter a valid name</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasiclastname">
                                <Form.Label>Last name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Last name"
                                    name="lastname" />
                                <Form.Control.Feedback type="invalid">Please enter a valid name</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email Address</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        type="email"
                                        placeholder="Email Address"
                                        name="email"
                                        required />
                                    <Form.Control.Feedback type="invalid">Please enter a valid email address</Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-3 pass" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <div className="position-relative">

                                <Form.Control
                                    type={showPassword?"text":"password"}
                                    placeholder="password"
                                    name="password"
                                    minLength={3}
                                    onChange={onChange}
                                    isInvalid={!passwordsMatchState}
                                    required
                                />
                                {showPassword?<FaEye  className={`${passwordsMatchState?"eye-register":"eye-register1"}`} onClick={()=>setShowPassword(false)}/>:<FaEyeSlash   className={`${passwordsMatchState?"eye-register":"eye-register1"}`} onClick={()=>setShowPassword(true)}/>}

                                <Form.Control.Feedback type="invalid">Both Passwords must match</Form.Control.Feedback>
                                <Form.Text className='text-muted'>password should have at least 3 characters</Form.Text>
                           </div>
                            </Form.Group>

                            <Form.Group className="mb-3 pass" controlId="formBasicPasswordRepeat">
                                <Form.Label>Repeat Password</Form.Label>
                                <div className="position-relative">

                                <Form.Control
                                    type={showPasswordRepeat?"text":"password"}
                                    name="confirmPassword"
                                    placeholder="Repeat Password"
                                    onChange={onChange}
                                    isInvalid={!passwordsMatchState}
                                    required
                                />
                                {showPasswordRepeat?<FaEye className={`${passwordsMatchState?"eye-register-repeat":"eye-register-repeat1"}`} onClick={()=>setShowPasswordRepeat(false)}/>:<FaEyeSlash  className={`${passwordsMatchState?"eye-register-repeat":"eye-register-repeat1"}`} onClick={()=>setShowPasswordRepeat(true)}/>}

                                <Form.Control.Feedback type="invalid">Both passwords must match</Form.Control.Feedback>
                            </div>
                            </Form.Group>

                            <Row className="pb-2">
                                <Col>
                                    Do you already have an account? <Link to="/login">Login</Link>
                                </Col>
                            </Row>

                            <Button type="submit" className=' px-4 py-2 rounded-pill'>
                                {registerUserResponseState &&
                                    registerUserResponseState.loading === true ? (
                                    <Spinner
                                        as="span"
                                        className='mx-2'
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true" />
                                ) : (
                                    ""
                                )}
                                Submit
                            </Button>

                            <Alert show={
                                registerUserResponseState &&
                                registerUserResponseState.success === "user created"
                            } variant="info">
                                Registered Successfully!
                            </Alert>

                            {/* {console.log(registerUserResponseState.error)} */}
                            <Alert show={
                                registerUserResponseState &&
                                registerUserResponseState.error === "user already exists"
                            } variant="danger">
                                User with that email already exists!
                            </Alert>

                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default RegisterPage
