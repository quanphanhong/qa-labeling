import React from "react";
import "./qaList.css"

import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

import QAForm from "./components/qaForm/qaForm";
import QAItemTable from "./components/qaItemTable/qaItemTable";

class QAList extends React.Component
{
    constructor( props ) {
        super( props );

        this.state = {
          showQAForm: false,
          currentQAItemId: null,
          isInserting: false
        };
    }

    render() {
      return (
          <>
            <div className="listContainer">
              { this.buildHeader() }
              { this.buildQAItemList() }
            </div>
            { this.state.showQAForm ?
                <QAForm
                  qaItemId={ this.state.currentQAItemId }
                  onClose={ this.closeForm }
                /> : <></>
            }
          </>
      );
    }

    buildHeader() {
      return (
        <div className="listNav">
          <h1>Document Visual Question Answering Labeling</h1>
          <Button variant="outline-primary" onClick={ () => this.loadQAItemHandler() }>Insert</Button>
        </div>
      );
    }

    buildQAItemList() {
      return (
        <div className="itemList">
          <h2>List of imported items</h2>
          <QAItemTable loadQAItemEvent={ this.loadQAItemHandler } />
        </div>
      )
    }

    loadQAItemHandler = ( qaItemId ) => this.setState({ currentQAItemId: qaItemId, showQAForm: true });

    closeForm = () => {
      this.setState({ showQAForm: false });
    }
}

export default QAList;