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
        // TODO bring {qaItemId} to config!
        const questionList = await getAllDocumentInCollection(
            config.referenceToQuestionList.replace( "{qaItemId}", this.props.qaItemId ) )

        this.setState({ questions: questionList });
    }

    render() {
        return (
            <>
                { this.buildQuestionAndAnswerList() }
            </>
        );
    }

    buildQuestionAndAnswerList() {
        const questionList = this.state.questions;
        const renderingQuestionList = [];

        for ( let i = 0; i < questionList.length; i++ ) {
            const renderingQuestionItem = (
                <div key={ config.questionKeyPrefix + i }>
                    { this.buildQuestionBox( i + 1 ) }
                </div>
            );

            renderingQuestionList.push( renderingQuestionItem );
        }

        return renderingQuestionList;
    }

    buildQuestionBox( questionIndex ) {
        return (
            <Form.Group className="mb-3">
                <Form.Label>Question { questionIndex }</Form.Label>
                <Form.Control
                    id={ config.questionBoxKeyPrefix + questionIndex }
                    type="text"
                    placeholder="What is your question?"
                    defaultValue={ this.getQuestionBoxDefaultValue( questionIndex - 1 ) }
                />
            </Form.Group>
        );
    }

    getQuestionBoxDefaultValue( questionIndex ) {
        if ( this.state.questions.length > questionIndex ) {
            return this.state.questions[ questionIndex ].data.question;
        } else {
            return "";
        }
    }
}

export default QuestionList;