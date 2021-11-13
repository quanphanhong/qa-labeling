import React from 'react';
import "./qaForm.css";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import 'bootstrap/dist/css/bootstrap.min.css';

import { getAllDocumentInCollection } from "../../../../services/firestoreHandler";
import { config } from "../../../viewConfig";

class QuestionList extends React.Component {
    constructor( props ) {
        super( props );

        this.state = {
            dataIsLoaded: false,
            questions: []
        };
    }

    componentDidMount() {
        if ( !( this.props.qaItemId === null | undefined ) ) {
            this.fetchQuestionList()
                .then( () => this.initializeComponents() )
        }
    }

    initializeComponents() {
        const questionCountElement = document.getElementById( "questionCount" );
        questionCountElement.defaultValue = this.state.questions.length;
    }

    /**
     * Get all questions from a QA item
     */
    async fetchQuestionList() {
        // TODO bring {qaItemId} to config!
        const questionList = await getAllDocumentInCollection(
            config.referenceToQuestionList.replace( "{qaItemId}", this.props.qaItemId ) )

        this.setState({
            questions: questionList,
            dataIsLoaded: true
        });
    }

    render() {
        return (
            <>
                { this.buildQuestionCount() }
                { this.buildQuestionAndAnswerList() }
            </>
        );
    }

    buildQuestionCount() {
        return (
            <Form.Group as={Col} className="formItem">
                <Form.Label>Number of questions</Form.Label>
                <Form.Control
                    id="questionCount"
                    type="number"
                    placeholder="Enter number of questions" />
            </Form.Group>
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
            <Form.Group className="formItem">
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