import React from 'react';
import "./qaForm.css";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal"
import 'bootstrap/dist/css/bootstrap.min.css';

import QuestionList from './questionList';
import ImagePreview from './imagePreview';
import { createDocument, updateDocument } from "../../../../services/firestoreHandler";
import { config } from "../../../viewConfig";

class QAForm extends React.Component
{
    constructor( props ) {
        super( props );

        this.state = {
            qaItemId: props.qaItemId,
            imageURL: "",
            questionList: [],
            deletedQuestions: [],
            reload: false
        }
    }

    render() {
      if ( this.state.reload === true ) {
        this.setState({ reload: false });
        return <div></div>;
      }

      return (
        <Modal show={ true } fullscreen="xxl-down">
          { this.buildFormHeader() }
          { this.buildFormBody() }
          { this.buildFormFooter() }
        </Modal>
      );
    }

    buildFormHeader() {
      return (
        <Modal.Header closeButton onAbort={ () => this.props.onClose() }>
          <Modal.Title>Add/Modify QA item</Modal.Title>
        </Modal.Header>
      );
    }

    buildFormBody() {
      return (
        <Modal.Body>
          <div className="modalBodyContainer">
            <ImagePreview
              className="imagePreview"
              onURLUpdated={ this.updateImageURL }
              qaItemId={ this.state.qaItemId }
            />
            <QuestionList
              className="questionForm"
              onQuestionUpdated={ this.updateQuestionList }
              qaItemId={ this.state.qaItemId } />
          </div>
        </Modal.Body>
      );
    }

    updateImageURL = ( imageURL ) => {
      this.setState({ imageURL: imageURL });
    }

    updateQuestionList = ( questionList, reservedQuestions ) => {
      this.setState({
        questionList: questionList,
        deletedQuestions: reservedQuestions
      });
    }

    buildFormFooter() {
      return (
        <Modal.Footer>
          <Button variant="secondary" onClick={ () => this.props.onClose() }>Close</Button>
          <Button variant="primary">Download (In progress)</Button>
          <Button variant="primary" onClick={ () => this.handleSaving() }>Save</Button>
        </Modal.Footer>
      );
    }

    handleSaving() {
      const questionList = this.state.questionList;
      const deletedQuestions = this.state.deletedQuestions;

      this.updateImage();

      // There's no modifications
      if ( questionList === [] && deletedQuestions === [] ) return;

      // Add/Update questions
      questionList.forEach( ( question ) => {
        if ( question.id == null ) {
          this.addQuestionAndAnswers( question.data.question, question.data.answers );
        } else {
          this.updateQuestion( question.id, question.data.question );
          this.updateAnswers( question.id, question.data.answers );
        }
      } );

      // Delete questions

      this.reloadForm();
    }

    async addQuestionAndAnswers( questionContent, answers ) {
      const collectionRef = config.referenceToQuestionList.replace( "{qaItemId}", this.state.qaItemId );
      const questionId = await createDocument( collectionRef, { question: questionContent } );

      this.updateAnswers( questionId, answers );
    }

    updateImage() {
      console.log(config.referenceToQAItem.replace( "{qaItemId}", this.state.qaItemId));
      updateDocument(
        config.referenceToQAItem.replace( "{qaItemId}", this.state.qaItemId ),
        { imgUrl: this.state.imageURL }
      );
    }

    updateQuestion( questionId, questionContent ) {
      updateDocument(
        config.referenceToQuestionList.replace( "{qaItemId}", this.state.qaItemId ) + "/" + questionId,
        { question: questionContent }
      );
    }

    updateAnswers( questionId, answers ) {
      if ( answers != null ) {
        answers.forEach( ( answer ) => {
          if ( answer.id == null ) {
            const itemRef = config.referenceToAnswerList
              .replace( "{qaItemId}", this.state.qaItemId )
              .replace( "{questionId}", questionId );

            createDocument( itemRef, { answer: answer.data.answer } );
          }
        } );
      }
    }

    reloadForm() {
      this.setState({
        questionList: [],
        deletedQuestions: [],
        reload: true
      })
    }
}

export default QAForm;