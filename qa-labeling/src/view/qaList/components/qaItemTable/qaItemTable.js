import React from "react";
import "./qaItemTable.css";

import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

import { getAllDocumentInCollection } from "../../../../services/firestoreHandler";
import { config } from "../../../viewConfig"

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
                    <td>{ tableCell.data.createdAt.seconds }</td>
                    <td>
                        <div className="actions">
                        <Button
                            variant="warning"
                            onClick={ () => this.props.loadQAItemEvent( tableCell.id ) }>Modify</Button>
                        <Button variant="info">Download file</Button>
                        <Button variant="danger">Delete</Button>
                        </div>
                    </td>
                </tr>
            ))
        );
    }

    async loadTableContent() {
        const tableItemList = await getAllDocumentInCollection( config.referenceToAllQAItem );

        this.setState({
            tableDataIsLoaded: true,
            tableData: tableItemList
        });
    }
}

export default QAItemTable;