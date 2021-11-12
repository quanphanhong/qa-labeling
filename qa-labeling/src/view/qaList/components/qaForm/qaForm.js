import React from 'react';

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal"
import 'bootstrap/dist/css/bootstrap.min.css';

class QAForm extends React.Component
{
    constructor( props ) {
        super( props );

        this.state = {
            _closeFormCallback: () => props.onClose
        }
        console.log(props);
    }

    render() {
        return (
            <Modal fullscreen="xxl-down">
              <Modal.Header closeButton onAbort={() => this.state._closeFormCallback}>
                <Modal.Title>Add/Modify QA item</Modal.Title>
              </Modal.Header>
              <Modal.Body>

              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => this.state._closeFormCallback}>Close</Button>
                <Button variant="primary">Download (In progress)</Button>
              </Modal.Footer>
            </Modal>
        );
    }
}

export default QAForm;