import React, { Component } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { getFirebase } from "react-redux-firebase";

class Login extends Component {

  state = {
    email: '',
    password: '',
    error: false,
    errorMessage: '',
    isfetching: false,
  }

  _loginUser = async (e) => {
    e.preventDefault();
    
    const { email, password } = this.state;
    if(email === ''){
      this.setState({ error: true, errorMessage: 'Email is required' });
      return;
    }
    if(password === ''){
      this.setState({ error: true, errorMessage: 'Password is required' });
      return;
    }
    this.setState({ isfetching: true });

    // Login to firebase
    const firebase = getFirebase();
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        window.location = "/";
      })
      .catch(error => {
        var errorMessage = error.message;
        this.setState({
          error: true,
          errorMessage
        });
      });
      // Login to firebase - Ends

      this.setState({ isfetching: false });
  }

  render() {
    const { error, errorMessage, isfetching } = this.state;
    return (
      <div className="login-frm">
        { error && (
          <Alert variant="danger">
            {errorMessage}
          </Alert>
        )}
        <Form onSubmit={e => this._loginUser(e)}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Enter email" 
              onChange={e => this.setState({ email: e.target.value })} 
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Password" 
              onChange={e => this.setState({ password: e.target.value })} 
            />
          </Form.Group>
          {
            isfetching ?
              <Button variant="primary" type="submit" disabled>
                Submit
              </Button>
              :
              <Button variant="primary" type="submit">
                Submit
              </Button>
          }
        </Form>
      </div>
    );
  }
}

export default Login;
