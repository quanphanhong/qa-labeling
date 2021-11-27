import React from "react";
import "./qaList.css"

import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import ProgressBar from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css";

import QAForm from "./components/qaForm/qaForm";
import QAItemTable from "./components/qaItemTable/qaItemTable";
import { NavDropdown } from "react-bootstrap";
import { logOut, registerAuthChangedEvent } from "../../services/auth";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { downloadJSONFile } from "../../services/downloadHandler";
import { buildQAItemList } from "../../services/dataBuilder";
import TagSuggestions from "./components/tagSuggestions/tagSuggestions";

class QAList extends React.Component
{
    constructor( props ) {
        super( props );

        this.state = {
          showQAForm: false,
          currentQAItemId: null,
          reload: false,
          shouldRedirectToLoginPage: false,
          downloadState: null,
          tagSuggestionsOn: false
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
    const downloadState = this.state.downloadState;

    return (
      <div className="itemList">
        <h3>List of imported items</h3>
        <ProgressBar striped variant="success" now={40} />
        <div>
          <Button
            className="insertButton"
            variant="outline-primary"
            onClick={ () => this.loadQAItemHandler() }>Insert New Item</Button>
          <Button
            className="insertButton"
            variant="outline-primary"
            onClick={ () => this.updateTagSuggestions( true ) }>Update Question Tag Suggestions</Button>
        </div>
        <Button
          className="insertButton"
          variant="outline-secondary"
          onClick={ async () => await this.downloadAllQAItems() }>
            { downloadState == null ? "Download All" : downloadState }
        </Button>

        { this.state.tagSuggestionsOn === true ? <TagSuggestions hideCallback={() => this.setState({ tagSuggestionsOn: false })} /> : <></> }
        <QAItemTable loadQAItemEvent={ this.loadQAItemHandler } onReloadRequested={ this.reload } />
      </div>
    )
  }

  loadQAItemHandler = ( qaItemId ) => this.setState({ currentQAItemId: qaItemId, showQAForm: true });

  updateTagSuggestions( on ) {
    this.setState({ tagSuggestionsOn: on });
  }

  async downloadAllQAItems() {
    await buildQAItemList( this.loadQAItemsCallback );
  }

  loadQAItemsCallback = ( qaItemData, current, max ) => {
    this.setState({ downloadState: current + "/" + max });
    downloadJSONFile( JSON.stringify( qaItemData ), qaItemData.image.imageName );
  }

  reload = () => this.setState({ reload: true });

  closeForm = () => {
    this.setState({ showQAForm: false });
  }
}

export default QAList;