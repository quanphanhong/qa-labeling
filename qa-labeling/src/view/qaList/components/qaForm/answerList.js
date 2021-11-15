import React from 'react';
import "./answerList.css";

import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import 'bootstrap/dist/css/bootstrap.min.css';

import { getAllDocumentInCollection } from "../../../../services/firestoreHandler";
import { config } from "../../../viewConfig";

class AnswerList extends React.Component
{
    constructor( props ) {
        super( props );

        this.state = {
            answers: [],
            deletedAnswers: [],
            editMode: false,
            editingIndex: -1,
            onDelete: false
        };

        this.onKeyUp = this.onKeyUp.bind(this);
    }

    componentDidMount() {
        this.fetchAnswerList()
            .then( () => this.sendAnswerUpdate() );
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
                { ( this.state.editMode === true ) ?
                    this.buildEditEntry() :
                    this.buildAnswerEntry() }
            </>
        );
    }

    buildAnswerList() {
        const answerList = this.state.answers;
        const editingIndex = this.state.editingIndex;
        const renderingAnswerList = [];

        for ( let i = 0; i < answerList.length; i++ ) {
            const renderingAnswerItem = (
                <div className="answerItemGroup" key={ config.answerItemKeyPrefix + i }>
                    <ListGroup.Item
                        id={ config.answerItemKeyPrefix + i }
                        className="answerItem"
                        variant={ editingIndex === i ? "primary" : "" }>
                        { answerList[i].data.answer }
                    </ListGroup.Item>
                    { this.buildActionButtons( i ) }
                </div>
            );

            renderingAnswerList.push( renderingAnswerItem );
        }

        return renderingAnswerList;
    }

    buildActionButtons( index ) {
        return (
            <DropdownButton title="Action" id="bg-nested-dropdown" variant="outline-dark">
                <Dropdown.Item
                    eventKey="1"
                    onClick={ () => this.handleAnswerSelected( index ) }>Modify</Dropdown.Item>
                <Dropdown.Item
                    eventKey="2"
                    onClick={ () => this.deleteAnswer( index ) }>Delete</Dropdown.Item>
            </DropdownButton>
        );
    }

    handleAnswerSelected = ( answerIndex ) => {
        if ( this.state.editingIndex === answerIndex ) {
            this.setEditingState( -1, false );
        } else {
            this.setEditingState( answerIndex, true );
        }
    }

    setEditingState( editingIndex, editMode ) {
        this.setState({ editingIndex: editingIndex, editMode: editMode });
    }

    buildEditEntry() {
        return (
            <Form.Control
                id={ "editEntry" + this.props.questionId }
                className="answerEntry"
                size="sm"
                type="text"
                placeholder="Edit answer (Press ENTER to add, ESC to exit Edit Mode)"
                onKeyUp={ this.onKeyUp }/>
        );
    }

    setEditEntryDefaultValue() {
        const editEntry = document.getElementById( "editEntry" + this.props.questionId );
        if ( editEntry != null || this.state.editingIndex >= 0 ) {
            editEntry.defaultValue = this.state.answers[ this.state.editingIndex ].data.answer;
        }
    }

    buildAnswerEntry() {
        return (
            <Form.Control
                id={ "answerEntry" + this.props.questionId }
                className="answerEntry"
                size="sm"
                type="text"
                placeholder="Enter new answer (Press ENTER to add)"
                onKeyUp={ this.onKeyUp }/>
        );
    }

    onKeyUp = ( event ) => {
        const answerList = this.state.answers;
        const editMode = this.state.editMode;

        const answer = event.target.value;

        if (event.key === "Enter") {
            if ( editMode === true ) {
                const editingIndex = this.state.editingIndex;

                answerList[ editingIndex ].data.answer = answer;

                this.setState({
                    answers: answerList,
                    editMode: false,
                    editingIndex: -1
                });
            } else {
                answerList.push({
                    id: null,
                    data: { answer: answer }
                });
                this.setState({ answers: answerList });
            }

            this.sendAnswerUpdate( answerList, this.state.deletedAnswers );

            // Clear answer box
            const answerBox = document.getElementById(event.target.id);
            answerBox.value = "";
        } else if ( event.key === "Escape" ) {
            if ( editMode === true ) {
                this.setState({
                    editMode: false,
                    editingIndex: -1
                });
            }
        }
    }

    deleteAnswer( index ) {
        const answers = this.state.answers;
        const deletedAnswers = this.state.deletedAnswers;

        deletedAnswers.push( answers.splice( index, 1 ) );

        this.setState({
            answers: answers,
            deletedAnswers: deletedAnswers
        });

        this.sendAnswerUpdate( answers, deletedAnswers )
    }

    sendAnswerUpdate( answerList, deletedAnswers ) {
        this.props.onAnswerUpdated( answerList, deletedAnswers );
    }
}

export default AnswerList;