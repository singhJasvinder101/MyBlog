import React from 'react';
import { Form, Button, Container, Row, Col, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"
import { setRedxUserState } from '../../redux/slices/loginRegisterSlice';
import axios from "axios"

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

        const email = form.email.value   // targeting by name then getting value
        const password = form.password.value
        const donotlogout = form.donotlogout.checked
        // console.log(donotlogout)

        if (e.currentTarget.checkValidity() === true && email && password) {
            // console.log("good")
            setLoginUserResponseState({ loading: true })
            userLoginApiRequest(email, password, donotlogout)
                .then(res => {
                    setLoginUserResponseState({
                        success: res.success, loading: false, error: ""
                    })
                    // console.log(res)
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
                })
            setValidated(true);
        }
    }

    return (
        <div className='login-bg text-light'>
            <Container className="pb-4">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <h2 className="text-center pt-5">Login</h2>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email Address</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        name="email"
                                        type="email"
                                        placeholder="Email Address"
                                        required />
                                    <Form.Control.Feedback type="invalid">Please enter a valid email address</Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    name="password"
                                    type="password"
                                    placeholder="password"
                                    required />
                                <Form.Control.Feedback type="invalid">Please enter a valid password</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3 mt-3" controlId="formBasicCheckbox">
                                <Form.Check
                                    name='donotlogout'
                                    type='checkbox'
                                    label='Do not logout' />
                            </Form.Group>


                            <Row className="pb-2">
                                <Col>
                                    Don't you have an account? <Link to="/register">Register</Link> {/* Corrected typo */}
                                </Col>
                            </Row>

                            <Button type="submit" className='mt-2'>
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
