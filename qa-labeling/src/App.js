import './App.css';
import React from "react";

import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import 'bootstrap/dist/css/bootstrap.min.css';

const axios = require ("axios");

class App extends React.Component
{
  constructor(props) {
    super(props);

    this.state = {
      cases: [],
      dataIsLoaded: false,
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

  loadCaseTable = (cases, dataIsLoaded) => {
    if (!dataIsLoaded)
      return;

    return (
        cases.map(caseItem => (
            <tr>
              <td>{caseItem.itemId}</td>
              <td><img src={caseItem.imgUrl} alt="" className="itemImg"/></td>
              <td>{caseItem.createdAt._seconds}</td>
              <td>
                <div className="actions">
                  <Button variant="warning">Modify</Button>
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
    return (
      <div className="App">
        <div className="listNav">
          <h1>Document Visual Question Answering Labeling</h1>
          <Button variant="outline-primary">Import</Button>
        </div>
        <div className="itemList">
          <h2>List of imported items</h2>
          {this.showTable(cases, dataIsLoaded)}
        </div>
      </div>
    );
  }
}

export default App;
