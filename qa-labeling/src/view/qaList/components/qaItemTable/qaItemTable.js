import React from "react";
import "./qaItemTable.css";

import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

import { getAllDocumentInCollection, deleteDocument } from "../../../../services/firestoreHandler";
import { config } from "../../../viewConfig"
import { timestampToString } from "./timestampHandler";

class QAItemTable extends React.Component
{
    constructor( props ) {
        super( props );

        this.state = {
            tableDataIsLoaded: false,
            tableData: []
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
                    <td><img src={ tableCell.data.imgUrl } alt="" className="itemImg"/></td>
                    <td>{ timestampToString(tableCell.data.createdAt.seconds) }</td>
                    <td className="actionsCell">
                        <div className="actions">
                            <Button
                                variant="warning"
                                onClick={ () => this.props.loadQAItemEvent( tableCell.id ) }>Modify</Button>
                            <Button variant="info">Download</Button>
                            <Button
                                variant="danger"
                                onClick={ () => this.handleDeleteQAItem( tableCell.id ) }>Delete</Button>
                        </div>
                    </td>
                </tr>
            ))
        );
    }

    handleDeleteQAItem( qaItemId ) {
        deleteDocument( config.referenceToQAItem.replace( "{qaItemId}", qaItemId ) );
        this.props.onReloadRequested();
    }
}

export default QAItemTable;