import React from "react";
import "./qaItemTable.css";

import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

import { getAllDocumentInCollection, deleteDocument, getDocument } from "../../../../services/firestoreHandler";
import { config } from "../../../viewConfig"
import { timestampToString } from "./timestampHandler";
import { downloadJSONFile } from "../../../../services/downloadHandler";

class QAItemTable extends React.Component
{
    constructor( props ) {
        super( props );

        this.state = {
            tableDataIsLoaded: false,
            tableData: [],
            showDeletePrompt: false,
            onDeleteItemId: ""
        }
    }

    componentDidMount() {
        this.loadTableContent();
    }

    async loadTableContent() {
        const tableItemList = await getAllDocumentInCollection( config.referenceToAllQAItem );

        this.setState({
            tableDataIsLoaded: true,
            tableData: tableItemList
        });
    }

    render() {
        return (
            <>
                { this.showLoadingDataAlert() }
                <Table className="itemTable">
                    { this.buildTableTitleRow() }
                    <tbody>
                        { this.buildTableBody() }
                    </tbody>
                </Table>
                { this.buildDeletePrompt() }
            </>
        );
    }

    showLoadingDataAlert() {
        if ( this.state.tableDataIsLoaded ) return;

        return (
            <Alert variant="info">
                Loading data...
            </Alert>
        );
    }

    buildTableTitleRow() {
        return (
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Image name</th>
                    <th>Preview</th>
                    <th>Created at</th>
                    <th>Actions</th>
                </tr>
            </thead>
        );
    }

    buildTableBody() {
        const tableDataRow = this.state.tableData;

        return (
            tableDataRow.map( tableCell => (
                <tr key={ tableCell.id }>
                    <td>{ tableCell.id }</td>
                    <td>{ tableCell.data.imageName }</td>
                    <td><img src={ tableCell.data.imgUrl } alt="" className="itemImg"/></td>
                    <td>{ timestampToString(tableCell.data.createdAt.seconds) }</td>
                    <td className="actionsCell">
                        <div className="actions">
                            <Button
                                variant="warning"
                                onClick={ () => this.props.loadQAItemEvent( tableCell.id ) }>Modify</Button>
                            <Button
                                variant="info"
                                onClick={ () => this.handleDownloadQAItem( tableCell.id ) }>Download</Button>
                            <Button
                                variant="danger"
                                onClick={ () => this.handleDeleteQAItem( tableCell.id ) }>Delete</Button>
                        </div>
                    </td>
                </tr>
            ))
        );
    }

    buildDeletePrompt() {
        return (
            <Modal show={ this.state.showDeletePrompt }>
                <Modal.Header closeButton>
                    <Modal.Title>Delete QA Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={ () => this.deleteQAItem() }>Yes</Button>
                    <Button variant="primary" onClick={ this.handleNotDeleteQAItem }>No</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    deleteQAItem() {
        deleteDocument( config.referenceToQAItem.replace( "{qaItemId}", this.state.onDeleteItemId ) );
        this.setState({
            showDeletePrompt: false,
            onDeleteItemId: ""
        });
        this.props.onReloadRequested();
    }

    handleNotDeleteQAItem = () => this.setState({ showDeletePrompt: false, onDeleteItemId: "" });

    async handleDownloadQAItem( qaItemId ) {
        var downloadedData = {};
        var jsonFileName = "";

        await this.getQAItemInfo( qaItemId )
            .then( ( qaItem ) => {
                downloadedData.image = {
                    imageName: qaItem.imageName,
                    imageURL: qaItem.imgUrl
                };

                jsonFileName = qaItem.imageName;
            } )
            .catch( ( error ) => {
                console.log( error );
            } );

        await this.getQuestionList( qaItemId )
            .then( ( questionList ) => {
                downloadedData.questionList = questionList;
                questionList.forEach( async ( question, index ) => {
                    await this.getAnswers( qaItemId, question.id )
                        .then( ( answerList ) => {
                             downloadedData.questionList[ index ].data.answers = answerList;
                        } )
                        .catch( ( error ) => {
                            console.log( error );
                        } )
                } );
            } )
            .catch( ( error ) => {
                console.log( error );
            } );

        await this.downloadData( downloadedData, jsonFileName );
    }

    async getQAItemInfo( qaItemId ) {
        const qaItemRef = config.referenceToQAItem.replace( "{qaItemId}", qaItemId );
        return await getDocument( qaItemRef );
    }

    async getQuestionList( qaItemId ) {
        const questionListRef = config.referenceToQuestionList.replace( "{qaItemId}", qaItemId );
        return await getAllDocumentInCollection( questionListRef );
    }

    async getAnswers( qaItemId, questionId ) {
        const answerListRef = config.referenceToAnswerList
            .replace( "{qaItemId}", qaItemId )
            .replace( "{questionId}", questionId );

        return await getAllDocumentInCollection( answerListRef );
    }

    async downloadData( data, fileName ) {
        setTimeout( async () => downloadJSONFile( JSON.stringify( data ), fileName ), 1000 );
    }

    handleDeleteQAItem( qaItemId ) {
        this.setState({
            showDeletePrompt: true,
            onDeleteItemId: qaItemId
        })
    }
}

export default QAItemTable;