import React, { useEffect } from 'react';
import { Form, Button, Container, Row, Col, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"
import { setRedxUserState } from '../../redux/slices/loginRegisterSlice';
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import axios from "axios"
import SignInButton from '../components/Signinwithgoogle';
import { auth } from '../components/firebase';
axios.defaults.withCredentials = true;

const userLoginApiRequest = async (email, password, donotlogout) => {
    const apiUrl = import.meta.env.VITE_API_URI;
    const { data } = await axios.post(`${apiUrl}/api/users/login`,
        { email, password, donotlogout }, {
        withCredentials: true,
    })
    if (data.userLoggedIn.donotlogout) {
        localStorage.setItem("userInfo", JSON.stringify(data.userLoggedIn))
    } else {
        sessionStorage.setItem("userInfo", JSON.stringify(data.userLoggedIn))
    }
    return data
}

const LoginPage = () => {
    const [validated, setValidated] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const [passwordValidated, setPasswordValidated] = useState(false)
    const [emailValidated, setEmailValidated] = useState(true)

    const [loginUserResponseState, setLoginUserResponseState] = useState({
        success: "",
        error: "",
        loading: false,
    });

    const dispatch = useDispatch()

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget.elements;

        const email = form.email.value
        const password = form.password.value
        const donotlogout = form.donotlogout.checked
        // Check for password conditions
        if (!/[A-Z]/.test(password) ||
            !/[0-9]/.test(password) ||
            password.length < 8 ||
            !/[!@#$%^&*()]/.test(password)) {
            setPasswordValidated(true)
            setValidated(true)
            return
        } else {
            setPasswordValidated(false)
            setValidated(true)
        }
        if (e.currentTarget.checkValidity() === true && email && password) {
            setLoginUserResponseState({ loading: true })
            userLoginApiRequest(email, password, donotlogout)
                .then(res => {
                    setLoginUserResponseState({
                        success: res.success, loading: false, error: ""
                    })
                    if (res.success) {
                        dispatch(setRedxUserState(res.userLoggedIn))
                        window.location.assign('/')
                    }
                })
                .catch((err) => {
                    // console.log(err.response.data.message ? err.response.data.message : err.response.data)
                    setLoginUserResponseState({
                        error: err.response.data.message ? err.response.data.message : err.response.data
                    })
                    console.log(err)
                })
            setValidated(true);
        }
    }

    return (
        <div className='login-bg text-light'>
            <Container className="pb-4">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <h2 className="Pacifico text-center pt-5 blue">Login</h2>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email Address</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        name="email"
                                        type="email"
                                        placeholder="Email Address"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">Please enter a valid email address</Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-3 relative" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <div className="position-relative">

                                    <Form.Control
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="password"
                                        isInvalid={passwordValidated}
                                        required />
                                    {showPassword ? <FaEye className='eye' onClick={() => setShowPassword(false)} /> : <FaEyeSlash className='eye' onClick={() => setShowPassword(true)} />}
                                    <Form.Control.Feedback type="invalid">Please enter a valid password</Form.Control.Feedback>
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3 mt-3" controlId="formBasicCheckbox">
                                <Form.Check
                                    name='donotlogout'
                                    type='checkbox'
                                    label='Remember Me' />
                            </Form.Group>
                            
                            <h6 className="text-center">Or</h6>

                            <SignInButton />



                            <Row className="pb-2">
                                <Col>
                                    Don't you have an account? <Link className='' to="/register">Register</Link> 
                                </Col>
                                <Link to="/forgot-password">
                                        <b>Forgot Password</b>
                                    </Link>
                            </Row>

                            <Button type="submit" className='custom-button mt-2 px-4 py-2 rounded-pill'>

                                {loginUserResponseState && loginUserResponseState.loading === true ? (
                                    <Spinner
                                        className='mx-2'
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true" />
                                ) : ""}
                                Submit
                            </Button>

                            {loginUserResponseState && (
                                <Alert className='mt-3' show={loginUserResponseState.error === "wrong credentials"} variant="danger">
                                    Wrong Credentials
                                </Alert>
                            )}
                        </Form>
                    </Col>
                </Row>
            </Container>

        </div>
    )
}

export default LoginPage
