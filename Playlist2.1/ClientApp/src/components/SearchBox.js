import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/Search';
import Autosuggest from 'react-autosuggest';

class SearchBox extends React.Component {
    onChange = (event, { newValue, method }) => {
        let { value } = this.props;
        if (method === 'enter' && value.length > 3) {
            let selection = this.props.suggestion[0];
            this.props.makeSelection(selection);
            this.props.handleSubmit(selection.id);
        } else {
            this.props.handleChange(newValue);
        }
    }
    handleSelection = (event, { suggestion }) => {
        this.props.makeSelection(suggestion);
        this.props.handleSubmit(suggestion.id);
    }
    renderSuggestion(track) {
        return <span className='SearchBox-suggestionItem'>{track.name}, {track.artists[0].name}</span>;
    }
    getSuggestionValue(track) {
        return `${track.name}, ${track.artists[0].name}`;
    }
    shouldRenderSuggestions(input) {
        return input.length > 3;
    }
    render() {
        const { value, suggestions, requestSuggestions, clearSuggestions, theme, placeholder } = this.props;

        const inputProps = {
            type: 'text',
            placeholder: placeholder,
            onChange: this.onChange,
            value: value || ''
        };
        return (
            <Autosuggest
                suggestions={suggestions}
                onSuggestionSelected={this.handleSelection}
                onSuggestionsFetchRequested={requestSuggestions}
                onSuggestionsClearRequested={clearSuggestions}
                inputProps={inputProps}
                renderSuggestion={this.renderSuggestion}
                getSuggestionValue={this.getSuggestionValue}
                shouldRenderSuggestions={this.shouldRenderSuggestions}
                theme={Object.assign({ container: 'SearchBox-container', suggestion: 'SearchBox-suggestion' }, theme)}
            />
        )
    }
}

SearchBox.displayName = "SearchBox";

export default connect(
    state => state.search,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(SearchBox);