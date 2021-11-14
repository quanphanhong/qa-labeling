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

        this.onKeyUp = this.onKeyUp.bind(this);
    }

    componentDidMount() {
        this.fetchAnswerList();
    }

    /**
     * Get all answers from a question
     */
     async fetchAnswerList() {
        if ( ( this.props.qaItemId == null ) ||
            ( this.props.questionId == null ) )
            return;

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
                id="answerEntry"
                className="answerEntry"
                size="sm"
                type="text"
                placeholder="Enter new answer (Press Enter to add)"
                onKeyUp={this.onKeyUp}/>
        );
    }

    onKeyUp = (event) => {
        const answerList = this.state.answers;
        const answer = event.target.value;

        if (event.key === "Enter") {
            answerList.push({
                id: null,
                data: { answer: answer }
            });
            this.setState({ answers: answerList });
            this.sendAnswerUpdate();

            // Clear answer box
            const answerBox = document.getElementById(event.target.id);
            answerBox.value = "";
        }
    }

    sendAnswerUpdate() {
        this.props.onAnswerUpdated( this.state.answers );
    }
}

export default AnswerList;