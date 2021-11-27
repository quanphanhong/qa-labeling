import React from "react";

import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import 'bootstrap/dist/css/bootstrap.min.css';

import { getAllDocumentInCollection } from "../../../../services/firestoreHandler";
import { config } from "../../../viewConfig";

class TagSuggestions extends React.Component {
    constructor() {
        super();

        this.state = {
            suggestions: []
        };
    }

    componentDidMount() {
        this.getQuestionSuggestions();
    }

    getQuestionSuggestions() {
        getAllDocumentInCollection( config.referenceToQuestionTagSuggestionList )
            .then( ( suggestionList ) => {
                suggestionList.forEach( ( suggestionItem ) => {
                    this.setState( state => ({ suggestions: [ ...state.suggestions, suggestionItem ] }) );
                } );
            } );
    }

    render() {
        const handleClose = () => this.props.hideCallback();
        return (
            <Modal
                show={ true }
                onHide={ handleClose }
                backdrop="static"
                keyboard={ false }
            >
                <Modal.Header closeButton>
                <Modal.Title>Update Question Suggestions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    { this.buildSuggestionList() }
                </Modal.Body>
            </Modal>
        );
    }

    buildSuggestionList() {
        return (
            <ListGroup variant="flush">
                { this.buildSuggestionItems() }
            </ListGroup>
        );
    }

    buildSuggestionItems() {
        const suggestionRenderers = [];
        const suggestionDataList = this.state.suggestions;

        for ( const suggestionData of suggestionDataList ) {
            suggestionRenderers.push(
                <ListGroup.Item key={ suggestionData.id }>{ suggestionData.data.text }</ListGroup.Item>
            )
        }

        return suggestionRenderers;
    }
}

export default TagSuggestions;