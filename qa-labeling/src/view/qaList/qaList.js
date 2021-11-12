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
          showQAForm: true
        };
    }

    render() {
        return (
            <>
              <div className="listContainer">
                { this.buildHeader() }
                { this.buildQAItemList() }
              </div>
              { this.state.showQAForm ? <QAForm onClose={ this.closeForm } /> : <></> }
            </>
        );
    }

    buildHeader() {
      return (
        <div className="listNav">
          <h1>Document Visual Question Answering Labeling</h1>
          <Button variant="outline-primary">Import</Button>
        </div>
      );
    }

    buildQAItemList() {
      return (
        <div className="itemList">
          <h2>List of imported items</h2>
          <QAItemTable />
        </div>
      )
    }

    closeForm = () => {
      this.setState({ showQAForm: false });
    }
}

export default QAList;