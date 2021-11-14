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
            imageUrl: "",
            imageName: ""
        };
    }

    componentDidMount() {
        this.fetchQAItem()
            .then( () => {
                this.initializeComponents();
                this.props.onURLUpdated( this.state.imageUrl, this.state.imageName );
            } )
    }

    initializeComponents() {
        const imagePreviewControl = document.getElementById( "imagePreviewControl" );
        imagePreviewControl.defaultValue = this.state.imageUrl;

        const imageNameControl = document.getElementById( "imageNameControl" );
        imageNameControl.defaultValue = this.state.imageName;
    }

    /**
     * Get all questions from a QA item
     */
    async fetchQAItem() {
        if ( this.props.qaItemId == null ) return;

        const qaItem = await getDocument(
            config.referenceToQAItem.replace( "{qaItemId}", this.props.qaItemId ) )

        this.setState({
            imageUrl: qaItem.imgUrl,
            imageName: qaItem.imageName
        });
    }

    render() {
        return (
            <div>
                { this.buildImageNameUpdater() }
                { this.buildImageURLUpdater() }
                { this.buildImagePreview() }
            </div>
        );
    }

    buildImageNameUpdater() {
        return (
            <Form.Group className="formItem">
                <Form.Label>Image name</Form.Label>
                <Form.Control
                    id="imageNameControl"
                    type="text"
                    placeholder="Enter image name"
                    onChange={ () => this.updateImageName() }
                />
            </Form.Group>
        );
    }

    updateImageName = (event) => {
        const imageNameControl = document.getElementById( "imageNameControl" );

        this.setState({ imageName: imageNameControl.value });
        this.props.onURLUpdated( this.state.imageUrl, imageNameControl.value );
    };

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

    updateImageURL = ( event ) => {
        const imagePreviewControl = document.getElementById( "imagePreviewControl" );
        const imageNameControl = document.getElementById( "imageNameControl" );

        const imageName = this.getImageNameFromURL( imagePreviewControl.value );
        imageNameControl.value = imageName;

        this.setState({
            imageUrl: imagePreviewControl.value,
            imageName: imageName
        });
        this.props.onURLUpdated( imagePreviewControl.value, imageName );
    };

    getImageNameFromURL( imageURL ) {
        return imageURL.substring( imageURL.lastIndexOf('/') + 1 );
    }

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