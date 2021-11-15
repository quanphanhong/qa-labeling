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
            questionCount: null,
            deletedAnswers: []
        };
    }

    componentDidMount() {
        this.fetchQuestionList()
            .then( () => {
                this.initializeComponents();
                this.sendQuestionUpdate();
            } );
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
        if ( this.props.qaItemId == null ) return;

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
            if ( ( lastQuestionCount == null && this.props.qaItemId != null ) || currentQuestionCount < 0 ) return;

            if ( lastQuestionCount < currentQuestionCount ) {
                if ( reservedQuestions.length > 0 ) {
                    const poppedReservedQuestion = reservedQuestions.pop();

                    questions.push( poppedReservedQuestion );
                    this.setState({ reservedQuestions: reservedQuestions })
                } else {
                    const emptyQuestion = {
                        id: null,
                        data: {
                            question: ""
                        }
                    };

                    questions.push( emptyQuestion );
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
            });

            this.sendQuestionUpdate();
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
            const handleAnswerUpdated = ( answerList, removedAnswers ) => {
                const questions = this.state.questions;
                const deletedAnswers = this.state.deletedAnswers;

                if ( removedAnswers != null ) {
                    const questionId = questionList[ i ].id;

                    questions[ i ].data.answers = answerList;
                    deletedAnswers.push({
                        questionId: questionId,
                        answers: removedAnswers
                    });
                }

                this.setState({
                    questions: questions,
                    deletedAnswers: deletedAnswers
                });
                this.sendQuestionUpdate();
            }

            const renderingQuestionItem = (
                <div className="questionFormGroup" key={ config.questionKeyPrefix + i }>
                    { this.buildQuestionBox( i + 1 ) }

                    <AnswerList
                        qaItemId={ this.props.qaItemId }
                        onAnswerUpdated={ handleAnswerUpdated }
                        questionId={ questionList[ i ].id }/>
                </div>
            );

            renderingQuestionList.push( renderingQuestionItem );
        }

        return renderingQuestionList;
    }

    buildQuestionBox( questionIndex ) {
        const updateQuestionContent = ( event ) => {
            const questionList = this.state.questions;
            questionList[ questionIndex - 1 ].data.question = event.target.value;

            this.setState({ questions: questionList });
            this.sendQuestionUpdate();
        }

        return (
            <Form.Group className="formItem">
                <Form.Label>Question { questionIndex }</Form.Label>
                <Form.Control
                    id={ config.questionBoxKeyPrefix + questionIndex }
                    type="text"
                    placeholder="What is your question?"
                    defaultValue={ this.getQuestionBoxDefaultValue( questionIndex - 1 ) }
                    onChange={ updateQuestionContent }
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

    sendQuestionUpdate() {
        this.props.onQuestionUpdated( this.state.questions, this.state.reservedQuestions, this.state.deletedAnswers );
    }
}

export default QuestionList;