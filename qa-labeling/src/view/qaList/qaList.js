import React from "react";
import "./qaList.css"

import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import "bootstrap/dist/css/bootstrap.min.css";

import QAForm from "./components/qaForm/qaForm";
import QAItemTable from "./components/qaItemTable/qaItemTable";
import { NavDropdown } from "react-bootstrap";
import { logOut, registerAuthChangedEvent } from "../../services/auth";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

class QAList extends React.Component
{
    constructor( props ) {
        super( props );

        this.state = {
          showQAForm: false,
          currentQAItemId: null,
          reload: false,
          shouldRedirectToLoginPage: false
        };
    }

    componentDidMount() {
      registerAuthChangedEvent( this.authChanged );
    }

    authChanged = ( userAvailable ) => !userAvailable ? this.setState({ shouldRedirectToLoginPage: true }) : "";

    render() {
      if ( this.state.shouldRedirectToLoginPage === true )
        return (<Redirect to='/login'/>);

      if ( this.state.reload === true ) {
        this.setState({ reload: false });
        return (<></>);
      }

      return (
          <>
            <div className="listContainer">
              { this.buildHeader() }
              { this.buildQAItemList() }
            </div>
            { this.state.showQAForm ?
                <QAForm
                  qaItemId={ this.state.currentQAItemId }
                  onReloadRequested={ this.reload }
                  onClose={ this.closeForm }
                /> : <></>
            }
          </>
      );
  }

  buildHeader() {
    return (
      <Navbar bg="dark" variant="dark" className="listNav">
        <Container>
        <Navbar.Brand href="#home">Document Visual Question Answering Labeling</Navbar.Brand>
        <Nav className="me-auto">
          <NavDropdown title="Account">
            <NavDropdown.Item onClick={ logOut }>Sign out</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        </Container>
      </Navbar>
    );
  }

  buildQAItemList() {
    return (
      <div className="itemList">
        <h3>List of imported items</h3>
        <Button
          className="insertButton"
          variant="outline-primary"
          onClick={ () => this.loadQAItemHandler() }>Insert</Button>
        <QAItemTable loadQAItemEvent={ this.loadQAItemHandler } onReloadRequested={ this.reload } />
      </div>
    )
  }

  loadQAItemHandler = ( qaItemId ) => this.setState({ currentQAItemId: qaItemId, showQAForm: true });

  reload = () => this.setState({ reload: true });

  closeForm = () => {
    this.setState({ showQAForm: false });
  }
}

export default QAList;