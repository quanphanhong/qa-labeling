import React from "react";
import "./qaForm.css";
import "./imagePreview.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import Form from "react-bootstrap/Form"
import 'bootstrap/dist/css/bootstrap.min.css';

import { getDocument } from "../../../../services/firestoreHandler";
import { config } from "../../../viewConfig";

class ImagePreview extends React.Component
{
    constructor( props ) {
        super( props );

        this.state = {
            imageUrl: ""
        };
    }

    componentDidMount() {
        this.fetchQAItem()
            .then( () => this.initializeComponents() )
    }

    initializeComponents() {
        const imagePreviewControl = document.getElementById( "imagePreviewControl" );
        imagePreviewControl.defaultValue = this.state.imageUrl;
    }

    /**
     * Get all questions from a QA item
     */
    async fetchQAItem() {
        if ( this.props.qaItemId == null ) return;

        const qaItem = await getDocument(
            config.referenceToQAItem.replace( "{qaItemId}", this.props.qaItemId ) )

        this.setState({ imageUrl: qaItem.imgUrl });
    }

    render() {
        return (
            <div>
                { this.buildImageURLUpdater() }
                { this.buildImagePreview() }
            </div>
        );
    }

    buildImageURLUpdater() {
        return (
            <Form.Group className="formItem">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                    id="imagePreviewControl"
                    type="url"
                    placeholder="Enter image URL"
                    onChange={ () => this.updateImageURL() }
                />
            </Form.Group>
        );
    }

    updateImageURL = (event) => {
        const imagePreviewControl = document.getElementById( "imagePreviewControl" );

        this.setState({ imageUrl: imagePreviewControl.value });
        this.props.onURLUpdated( imagePreviewControl.value );
    };

    buildImagePreview() {
        return (
            <TransformWrapper className="imagePreviewItem">
                <TransformComponent>
                    <img src={ this.state.imageUrl } width="100%" alt="PreviewImage"/>
                </TransformComponent>
            </TransformWrapper>
        );
    }
}

export default ImagePreview;