import React from "react";
import { WithContext as ReactTags } from 'react-tag-input';
import { getAllDocumentInCollection } from "../../../../services/firestoreHandler";
import { config } from "../../../viewConfig";

const KeyCodes = {
    comma: 188,
    enter: [10, 13],
  };

const delimiters = [...KeyCodes.enter, KeyCodes.comma];

class QuestionTags extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tags: ( this.props.questionTags == null ) ? [] : this.props.questionTags,
            suggestions: []
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }

    componentDidMount() {
        this.getSuggestionList();
    }

    getSuggestionList() {
        getAllDocumentInCollection( config.referenceToQuestionTagSuggestionList )
            .then( ( suggestionList ) => {
                suggestionList.forEach( ( suggestionItem ) => {
                    this.setState( state => ({ suggestions: [ ...state.suggestions, suggestionItem.data ] }) )
                } )
            } )
    }

    handleDelete( i ) {
        const { tags } = this.state;
        this.setState(
            { tags: tags.filter( ( tag, index ) => index !== i ) },
            this.sendUpdatedTags
        );

    }

    handleAddition( tag ) {
        this.setState(
            state => ({ tags: [ ...state.tags, tag ] }),
            this.sendUpdatedTags
        );
    }

    handleDrag( tag, currPos, newPos ) {
        const tags = [ ...this.state.tags ];
        const newTags = tags.slice();

        newTags.splice( currPos, 1 );
        newTags.splice( newPos, 0, tag );

        // re-render
        this.setState(
            { tags: newTags },
            this.sendUpdatedTags
        );
    }

    sendUpdatedTags() {
        this.props.tagsChangedCallback( this.state.tags );
    }

    render() {
        const { tags, suggestions } = this.state;
        return (
            <div>
                <ReactTags
                    tags={ tags }
                    suggestions={ suggestions }
                    handleDelete={ this.handleDelete }
                    handleAddition={ this.handleAddition }
                    handleDrag={ this.handleDrag }
                    delimiters={ delimiters }
                    autocomplete={ true } />
            </div>
        )
    }
}

export default QuestionTags;