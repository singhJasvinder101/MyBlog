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
      const response = await fetch("http://localhost:3000/api/form/contactus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("response: ", response);
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
    <Container className="d-flex justify-content-center align-items-center vh-100 mt-0 ">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <div className="p-4 shadow rounded bg-white">
            <h2 className="text-center mb-4">Contact Us</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  onChange={handleChange}
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
  );
}

export default ContactUs;
