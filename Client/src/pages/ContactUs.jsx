import { useState } from "react";
import React from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

const defaultContactFormData = {
  username: "",
  email: "",
  message: "",
};

function ContactUs() {
  const [data, setData] = useState(defaultContactFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URI}/api/form/contactus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      //console.log("response: ", response);
      // alert(response);

      if (response.ok) {
        setData(defaultContactFormData);
        const responseData = await response.json();
        alert("Form Submitted Successfully");
      
        //console.log(responseData);
      } else {
        // Handle API error here
        console.error("API Error:", response.status, response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center w-full pt-40"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Container className="flex justify-center items-center w-full h-full" >
        <Row className="w-100">
          <Col md={{ span: 6, offset: 3 }}>
            <div className="p-4 shadow rounded bg-white mt-5 mb-5" >
              <h2 className="text-center mb-4">Contact Us</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName" className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    onChange={handleChange}
                    value={data.username}
                    name="username"
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formMessage" className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter your message"
                    name="message"
                    value={data.message}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Submit
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ContactUs;
