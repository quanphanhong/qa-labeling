import React from 'react';

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';

import { getAllDocumentInCollection } from "../../../../services/firestoreHandler";
import { config } from "../../../viewConfig";

class QuestionList extends React.Component {
    constructor( props ) {
        super( props );

        this.state = {
            questions: []
        };
    }

    componentDidMount() {
        if ( !( this.props.qaItemId === null | undefined ) ) {
            this.fetchQuestionList();
        }
    }

    /**
     * Get all questions from a QA item
     */
    async fetchQuestionList() {
        const questionList = await getAllDocumentInCollection(
            config.referenceToQuestionList.replace( "{qaItemId}", this.props.qaItemId ) )

        this.setState({ questions: questionList });
    }

    render() {
        return (
            <p>Okay</p>
        );
    }
}

export default QuestionList;