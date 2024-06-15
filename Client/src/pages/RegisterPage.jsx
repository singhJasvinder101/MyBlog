import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setRedxUserState } from '../../redux/slices/loginRegisterSlice';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Updated import for FaEye and FaEyeSlash icons
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegisterButton from '../components/Registerwithgoogle'; // Added import for RegisterButton

const RegisterPage = () => {
    const apiUrl = import.meta.env.VITE_API_URI;
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
    const [validated, setValidated] = useState(false);
    const [passwordValidated, setPasswordValidated] = useState(true);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [lastToastMessage, setLastToastMessage] = useState('');
    const [registerUserResponseState, setRegisterUserResponseState] = useState({
        success: "",
        error: "",
        loading: false,
    });
    const [passwordsMatchState, setPasswordsMatchState] = useState(true);
    const dispatch = useDispatch();

    const userRegisterApiRequest = async (name, lastname, email, password) => {
        const { data } = await axios.post(`${apiUrl}/api/users/register`, {
            name, lastname, email, password
        });
        sessionStorage.setItem("userInfo", JSON.stringify(data.userCreated));
        return data;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget.elements;

        const name = form.name.value;
        const lastname = form.lastname.value;
        const email = form.email.value;
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;

        let isValid = validatePassword(password);

        setPasswordValidated(isValid);

        if (isValid && password === confirmPassword) {
            setRegisterUserResponseState({ loading: true });
            userRegisterApiRequest(name, lastname, email, password).then(res => {
                setRegisterUserResponseState({
                    success: res.success,
                    loading: false,
                    error: ""
                });

                if (res.success === "user created") {
                    dispatch(setRedxUserState(res.userCreated));
                    window.location.assign('/');
                }

            }).catch((err) => {
                setRegisterUserResponseState({
                    error: err.response.data.message ? err.response.data.message : err.response.data
                });
                showToast(err.response.data.message ? err.response.data.message : err.response.data);
            });

        } else {
            if (password !== confirmPassword) {
                showToast("Passwords do not match");
            }
        }

        setValidated(true);
    };

    const validatePassword = (password) => {
        if (password.length < 8) {
            showToast("Password must be at least 8 characters long");
            return false;
        }

        if (!/[A-Z]/.test(password)) {
            showToast("Password must contain at least one uppercase letter");
            return false;
        }

        if (!/[a-z]/.test(password)) {
            showToast("Password must contain at least one lowercase letter");
            return false;
        }

        if (!/[0-9]/.test(password)) {
            showToast("Password must contain at least one digit");
            return false;
        }

        if (!/[!@#$%^&*()]/.test(password)) {
            showToast("Password must contain at least one special character");
            return false;
        }

        return true;
    };

    const showToast = (message) => {
        if (message !== lastToastMessage) {
            setLastToastMessage(message);
            toast.error(message);
        }
    };

    const onChangePassword = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordValidated(validatePassword(newPassword));
        setPasswordsMatchState(newPassword === confirmPassword);
    };

    const onChangeConfirmPassword = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        setPasswordsMatchState(newConfirmPassword === password);
    };

    return (
        <div className='register-bg pb-5 mb-5'>
            <Container className="text-light">
                <Row className="pt-4 justify-content-center">
                    <Col md={6}>
                        <h2 className="text-center Pacifico">Register</h2>

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
                                        type={showPassword ? "text" : "password"}
                                        placeholder="password"
                                        name="password"
                                        value={password}
                                        minLength={8}
                                        onChange={onChangePassword}
                                        isInvalid={!passwordValidated}
                                        isValid={passwordValidated && password.length > 0}
                                        required
                                    />
                                    {showPassword ? <FaEye className="eye-register" onClick={() => setShowPassword(false)} /> : <FaEyeSlash className="eye-register" onClick={() => setShowPassword(true)} />}
                                    <Form.Control.Feedback type="invalid">Invalid password</Form.Control.Feedback>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3 pass" controlId="formBasicPasswordRepeat">
                                <Form.Label>Repeat Password</Form.Label>
                                <div className="position-relative">
                                    <Form.Control
                                        type={showPasswordRepeat ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Repeat Password"
                                        value={confirmPassword}
                                        onChange={onChangeConfirmPassword}
                                        isInvalid={!passwordsMatchState}
                                        required
                                    />
                                    {showPasswordRepeat ? <FaEye className={`${passwordsMatchState ? "eye-register-repeat" : "eye-register-repeat1"}`} onClick={() => setShowPasswordRepeat(false)} /> : <FaEyeSlash className={`${passwordsMatchState ? "eye-register-repeat" : "eye-register-repeat1"}`} onClick={() => setShowPasswordRepeat(true)} />}
                                    <Form.Control.Feedback type="invalid">Passwords do not match</Form.Control.Feedback>
                                </div>
                            </Form.Group>

                            <h6 className="text-center">Or</h6>
                            <RegisterButton />

                            <Row className="pb-2">
                                <Col>
                                    Do you already have an account? <Link to="/login">Login</Link>
                                </Col>
                            </Row>

                            <Button type="submit" className='custom-button px-4 py-2 rounded-pill'>
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

                            <Row className="pb-2">
                                <Col>
                                    Do you already have an account? <Link className='custom' to="/login">Login</Link>
                                </Col>
                            </Row>

                            <Alert show={
                                registerUserResponseState &&
                                registerUserResponseState.success === "user created"
                            } variant="info">
                                Registered Successfully!
                            </Alert>

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

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default RegisterPage;
