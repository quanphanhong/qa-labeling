import React from 'react';
import "./answerList.css";

import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import 'bootstrap/dist/css/bootstrap.min.css';

import { getAllDocumentInCollection } from "../../../../services/firestoreHandler";
import { config } from "../../../viewConfig";

class AnswerList extends React.Component
{
    constructor( props ) {
        super( props );

        this.state = {
            answers: []
        };
    }

    componentDidMount() {
        const answerItemIsValid = () => {
            return ( ( this.props.qaItemId !== null | undefined)  &&
                this.props.questionId !== null | undefined );
        }

        if ( answerItemIsValid ) {
            this.fetchAnswerList();
        }
    }

    /**
     * Get all answers from a question
     */
     async fetchAnswerList() {
        const answerList = await getAllDocumentInCollection(
            config.referenceToAnswerList
                .replace( "{qaItemId}", this.props.qaItemId )
                .replace( "{questionId}", this.props.questionId )
        );

        this.setState({
            answers: answerList,
            dataIsLoaded: true
        });
    }

    render() {
        return (
            <>
                { this.buildAnswerList() }
                { this.buildAnswerEntry() }
            </>
        );
    }

    buildAnswerList() {
        const answerList = this.state.answers;
        const renderingAnswerList = [];

        for ( let i = 0; i < answerList.length; i++ ) {
            const renderingAnswerItem = (
                <ListGroup.Item key={ config.answerItemKeyPrefix + i }>
                    { answerList[i].data.answer }
                </ListGroup.Item>
            );

            renderingAnswerList.push( renderingAnswerItem );
        }

        return renderingAnswerList;
    }

    buildAnswerEntry() {
        return (
            <Form.Control
                className="answerEntry"
                size="sm"
                type="text"
                placeholder="Enter new answer (Press Enter to add)"
                onKeyUp={this.onKeyUp}/>
        );
    }
}

export default AnswerList;