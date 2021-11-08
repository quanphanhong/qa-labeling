import './qaList.css';
import React from "react";

import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal"
import 'bootstrap/dist/css/bootstrap.min.css';

import {QAForm} from "../qaForm/qaForm"

const axios = require ("axios");

class App extends React.Component
{
  constructor(props) {
    super(props);

    this.state = {
      cases: [],
      dataIsLoaded: false,
      showQAForm: false,
      openedQAItemId: null,
    }
  }

  async fetchAllCases() {
    await axios({
      method: "get",
      url: "http://us-central1-question-answering-labeling.cloudfunctions.net/api/imported-data",
      responseType: "stream",
    })
    .then((response) => {
      this.setState({
        cases: response.data,
        dataIsLoaded: true,
      });
    });
  }

  async componentDidMount() {
    await this.fetchAllCases();
  }

  loadQAFormDialog = (itemId) => {
    this.setState({
      showQAForm: true,
      openedQAItemId: itemId
    });
  }

  loadCaseTable = (cases, dataIsLoaded) => {
    if (!dataIsLoaded)
      return;

    return (
        cases.map(caseItem => (
            <tr key={caseItem.itemId}>
              <td>{caseItem.itemId}</td>
              <td><img src={caseItem.imgUrl} alt="" className="itemImg"/></td>
              <td>{caseItem.createdAt._seconds}</td>
              <td>
                <div className="actions">
                  <Button variant="warning" onClick={() => this.loadQAFormDialog(caseItem.itemId)}>Modify</Button>
                  <Button variant="danger">Delete</Button>
                </div>
              </td>
            </tr>
        ))
    );
  }

  showTable = (cases, dataIsLoaded) => {
    if (!dataIsLoaded) {
      return (
        <Alert variant="info">
          Data is being loaded...
        </Alert>
      );
    }
    else {
      return (
        <Table className="itemTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>ImageUrl</th>
                <th>Created at</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.loadCaseTable(cases, dataIsLoaded)}
            </tbody>
          </Table>
      );
    }
  }

  render() {
    const { cases, dataIsLoaded } = this.state;
    const handleFormOpened = (shouldOpen) => {
      this.setState({
        showQAForm: shouldOpen,
      });
    }

    return (
      <>
        <div className="App">
          <div className="listNav">
            <h1>Document Visual Question Answering Labeling</h1>
            <Button variant="outline-primary" onClick={() => {this.loadQAFormDialog(null)}}>Import</Button>
          </div>
          <div className="itemList">
            <h2>List of imported items</h2>
            {this.showTable(cases, dataIsLoaded)}
          </div>
        </div>
        <Modal fullscreen="xxl-down" show={this.state.showQAForm}>
          <Modal.Header closeButton onAbort={() => handleFormOpened(false)}>
            <Modal.Title>Add/Modify QA item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <QAForm qaItemId={this.state.openedQAItemId} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => handleFormOpened(false)}>Close</Button>
            <Button variant="primary">Save Changes</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default App;
