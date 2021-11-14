import React from 'react';
import "./qaForm.css";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal"
import 'bootstrap/dist/css/bootstrap.min.css';

import QuestionList from './questionList';
import ImagePreview from './imagePreview';
import { createDocument, deleteDocument, getServerTimestamp, updateDocument } from "../../../../services/firestoreHandler";
import { config } from "../../../viewConfig";
import { downloadJSONFile } from '../../../../services/downloadHandler';

class QAForm extends React.Component
{
    constructor( props ) {
        super( props );

        this.state = {
            qaItemId: props.qaItemId,
            imageURL: "",
            imageName: "",
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

    updateImageURL = ( imageURL, imageName ) => {
      this.setState({ imageURL: imageURL, imageName: imageName });
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
          <Button variant="primary" onClick={ () => this.saveQAItem() }>Download</Button>
          <Button variant="success" onClick={ () => this.handleSaving() }>Save</Button>
        </Modal.Footer>
      );
    }

    async saveQAItem() {
      const imageURL = this.state.imageURL;
      const imageName = this.state.imageName;
      const questionList = this.state.questionList;

      const downloadedData = {
        image: {
          imageName: imageName,
          imageURL: imageURL
        },
        questionList: questionList
      };

      const jsonString = JSON.stringify( downloadedData );

      await downloadJSONFile( jsonString, this.state.imageName );
  }

    async handleSaving() {
      if ( this.state.qaItemId == null ) {
        const qaItemId = await createDocument( config.referenceToAllQAItem,
          { createdAt: getServerTimestamp(), imgUrl: "", imageName: "" } );

        this.setState({ qaItemId: qaItemId });
        this.saveInfoToQAItem();
      } else {
        this.saveInfoToQAItem();
      }
    }

    saveInfoToQAItem() {
      const questionList = this.state.questionList;
      const deletedQuestions = this.state.deletedQuestions;

      this.updateImage();

      // No modifications
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
      deletedQuestions.forEach( ( question ) => {
        if ( question.id != null ) this.deleteQuestion( question.id );
      } );

      this.reloadForm();
    }

    async addQuestionAndAnswers( questionContent, answers ) {
      const collectionRef = config.referenceToQuestionList.replace( "{qaItemId}", this.state.qaItemId );
      const questionId = await createDocument( collectionRef, { question: questionContent } );

      this.updateAnswers( questionId, answers );
    }

    updateImage() {
      if ( this.state.imageURL === "" ) return;

      updateDocument(
        config.referenceToQAItem.replace( "{qaItemId}", this.state.qaItemId ),
        { imgUrl: this.state.imageURL, imageName: this.state.imageName }
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

    deleteQuestion( questionId ) {
      const questionRef = config.referenceToQuestion
        .replace( "{qaItemId}", this.state.qaItemId )
        .replace( "{questionId}", questionId );

      deleteDocument( questionRef );
    }

    reloadForm() {
      this.setState({
        questionList: [],
        deletedQuestions: [],
        reload: true
      });

      this.props.onReloadRequested();
    }
}

export default QAForm;