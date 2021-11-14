import logo from '../../resources/main-logo.svg';
import './main.css';
import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { registerAuthChangedEvent, signInWithEmail, signUpWithEmail } from '../../services/auth';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

class MainPage extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            showLoginForm: false,
            showSignUpForm: false,
            shouldRedirectToDataPage: false
        };
    }

    componentDidMount() {
        registerAuthChangedEvent( this.authChanged );
    }

    authChanged = ( userAvailable ) => userAvailable ? this.setState({ shouldRedirectToDataPage: true }) : "";

    render() {
        if ( this.state.shouldRedirectToDataPage === true )
            return (<Redirect to='/data' />)

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
            const emailElement = document.getElementById( "lg-email" );
            const passwordElement = document.getElementById( "lg-password" );

            signInWithEmail( emailElement.value, passwordElement.value );
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
                        <Form.Group className="mb-3">
                            <Form.Control id="lg-email" type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control id="lg-password" type="password" placeholder="Password" />
                        </Form.Group>
                        <div>
                            <Button
                                variant="primary"
                                className="authenticateButton"
                                onClick={ handleLoginClicked }>Login</Button>
                            <Button
                                variant="secondary"
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
            const emailElement = document.getElementById( "su-email" );
            const passwordElement = document.getElementById( "su-password" );

            signUpWithEmail( emailElement.value, passwordElement.value );
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
                            <Form.Control id="su-email" type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control id="su-password" type="password" placeholder="Password" />
                        </Form.Group>
                        <div>
                            <Button
                                variant="primary"
                                className="authenticateButton"
                                onClick={ handleSignUpClicked }>Sign up</Button>
                            <Button
                                variant="secondary"
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