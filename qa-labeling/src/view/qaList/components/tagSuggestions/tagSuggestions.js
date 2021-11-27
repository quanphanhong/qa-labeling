import React from "react";

import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import 'bootstrap/dist/css/bootstrap.min.css';

import { createDocument, getAllDocumentInCollection } from "../../../../services/firestoreHandler";
import { config } from "../../../viewConfig";

class TagSuggestions extends React.Component {
    constructor() {
        super();

        this.state = {
            suggestions: []
        };

        this.onKeyUp = this.onKeyUp.bind( this );
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
                    { this.buildSuggestionTextBox() }
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
                <ListGroup.Item key={ suggestionData.data.id }>{ suggestionData.data.text }</ListGroup.Item>
            )
        }

        return suggestionRenderers;
    }

    buildSuggestionTextBox() {
        return (
            <Form.Control
                id={ "tagEntry" }
                className="tagEntry"
                size="sm"
                type="text"
                placeholder="Enter new tag suggestion (Press ENTER to add)"
                onKeyUp={ this.onKeyUp }/>
        );
    }

    onKeyUp = ( event ) => {
        const newTagSuggestion = event.target.value;

        if (event.key === "Enter") {
            const newTagObj =  { id: newTagSuggestion, text: newTagSuggestion };

            this.setState( state => ({ suggestions: [ ...state.suggestions, { data: newTagObj } ] }) )
            createDocument(
                config.referenceToQuestionTagSuggestionList,
                newTagObj
            );

            event.target.value = "";
        }
    }
}

export default TagSuggestions;