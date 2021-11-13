import React from 'react';
import "./qaForm.css";
import "./questionList.css";

import Form from "react-bootstrap/Form";
import 'bootstrap/dist/css/bootstrap.min.css';

import { getAllDocumentInCollection } from "../../../../services/firestoreHandler";
import { config } from "../../../viewConfig";
import AnswerList from './answerList';

class QuestionList extends React.Component {
    constructor( props ) {
        super( props );

        this.state = {
            dataIsLoaded: false,
            questions: [],
            reservedQuestions: [],
            questionCount: null
        };
    }

    componentDidMount() {
        const questionIsValid = () => this.props.qaItemId !== null | undefined;

        if ( questionIsValid ) {
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
            questionCount: questionList.length,
            dataIsLoaded: true
        });
    }

    render() {
        return (
            <div>
                { this.buildQuestionCount() }
                { this.buildQuestionAndAnswerList() }
            </div>
        );
    }

    buildQuestionCount() {
        const handleQuestionCountChanged = ( event ) => {
            const lastQuestionCount = this.state.questionCount;
            const currentQuestionCount = event.target.value;

            const questions = this.state.questions;
            const reservedQuestions = this.state.reservedQuestions;

            // TODO Add more strict check to this!
            if ( lastQuestionCount === null || currentQuestionCount < 0 ) return;

            if ( lastQuestionCount < currentQuestionCount ) {
                if ( reservedQuestions.length > 0 ) {
                    const poppedReservedQuestion = reservedQuestions.pop();

                    questions.push( poppedReservedQuestion );
                    this.setState({ reservedQuestions: reservedQuestions })
                } else {
                    questions.push({
                        id: null,
                        data: {
                            question: "",
                            answers: []
                        }
                    });
                }
            } else {
                const removedQuestion = questions.pop();

                // TODO replace data field with empty field

                reservedQuestions.push( removedQuestion );
                this.setState({ reservedQuestions: reservedQuestions });
            }

            this.setState({
                questions: questions,
                questionCount: questions.length
            })
        }

        return (
            <Form.Group className="formItem">
                <Form.Label>Number of questions</Form.Label>
                <Form.Control
                    id="questionCount"
                    type="number"
                    placeholder="Enter number of questions"
                    onChange={ handleQuestionCountChanged } />
            </Form.Group>
        );
    }

    buildQuestionAndAnswerList() {
        const questionList = this.state.questions;
        const renderingQuestionList = [];

        for ( let i = 0; i < questionList.length; i++ ) {
            const renderingQuestionItem = (
                <div className="questionFormGroup" key={ config.questionKeyPrefix + i }>
                    { this.buildQuestionBox( i + 1 ) }

                    <AnswerList qaItemId={ this.props.qaItemId } questionId={ questionList[ i ].id }/>
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