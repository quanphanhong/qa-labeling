import React from 'react';

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal"
import 'bootstrap/dist/css/bootstrap.min.css';
import QuestionList from './questionList';

class QAForm extends React.Component
{
    constructor( props ) {
        super( props );

        this.state = {
            qaItemId: props.qaItemId
        }
        console.log(props);
    }

    render() {
      return (
        <Modal show={ true } fullscreen="xxl-down">
          { this.buildFormHeader() }
          { this.buildFormBody() }
          { this.buildFormFooter() }
        </Modal>
      );
    }

    buildFormHeader() {
      return (
        <Modal.Header closeButton onAbort={ () => this.props.onClose() }>
          <Modal.Title>Add/Modify QA item</Modal.Title>
        </Modal.Header>
      );
    }

    buildFormBody() {
      return (
        <Modal.Body>
          <QuestionList qaItemId={ this.state.qaItemId } />
        </Modal.Body>
      );
    }

    buildFormFooter() {
      return (
        <Modal.Footer>
          <Button variant="secondary" onClick={ () => this.props.onClose() }>Close</Button>
          <Button variant="primary">Download (In progress)</Button>
        </Modal.Footer>
      );
    }
}

export default QAForm;