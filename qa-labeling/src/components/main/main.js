import logo from '../../resources/main-logo.svg';
import './main.css';
import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class MainPage extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            showLoginForm: false,
            showSignUpForm: false
        };
    }

    render() {
        const shouldShowLoginForm = this.state.showLoginForm;
        const shouldShowSignUpForm = this.state.showSignUpForm;

        return (
            <div className="App">
              <header className="App-header">
                {this.buildAppIntro()}
                {this.buildAuthenticateButtons()}
                { shouldShowLoginForm ? this.buildLoginForm() : <></> }
                { shouldShowSignUpForm ? this.buildSignupForm() : <></> }
              </header>
            </div>
        )
    }

    buildAppIntro() {
        return (
            <>
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Welcome to <code>QALabeling</code> website!
                </p>
            </>
        );
    }

    buildAuthenticateButtons() {
        const handleLoginClicked = () => {
            this.setState({ showLoginForm: true });
        };

        const handleSignUpClicked = () => {
                this.setState({ showSignUpForm: true });
        };

        return (
            <div>
                <Button
                    variant="primary"
                    className="authenticateButton"
                    onClick={ handleLoginClicked }>LOGIN</Button>
                <Button
                    variant="secondary"
                    className="authenticateButton"
                    onClick={ handleSignUpClicked }>SIGNUP</Button>
            </div>
        );
    }

    buildLoginForm() {
        const handleLoginClicked = () => {
            // TODO get username & password to login
        }

        const handleCancelClicked = () => {
            this.setState({ showLoginForm: false })
        }

        return (
            <>
                <div className="overlayBackground"></div>
                <div className="loginForm">
                    <p>Login</p>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        <div>
                            <Button
                                variant="primary"
                                type="submit"
                                className="authenticateButton"
                                onClick={ handleLoginClicked }>Login</Button>
                            <Button
                                variant="secondary"
                                type="submit"
                                className="authenticateButton"
                                onClick={ handleCancelClicked }>Cancel</Button>
                        </div>
                    </Form>
                </div>
            </>
        );
    }

    buildSignupForm() {
        const handleSignUpClicked = () => {
            // TODO get username & password to sign up
        }

        const handleCancelClicked = () => {
            this.setState({ showSignUpForm: false })
        }

        return (
            <>
                <div className="overlayBackground"></div>
                <div className="signUpForm">
                    <p>Signup</p>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        <div>
                            <Button
                                variant="primary"
                                type="submit"
                                className="authenticateButton"
                                onClick={ handleSignUpClicked }>Sign up</Button>
                            <Button
                                variant="secondary"
                                type="submit"
                                className="authenticateButton"
                                onClick={ handleCancelClicked }>Cancel</Button>
                        </div>
                    </Form>
                </div>
            </>
        );
    }
}

export default MainPage;