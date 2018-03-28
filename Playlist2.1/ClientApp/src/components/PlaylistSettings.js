import React from 'react';

class PlaylistSettings extends React.Component {
    constructor() {
        super();
        this.state = {
            value: '',
            selectedOption: null
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }
    handleChange(event) {
        this.setState({ value: event.target.value });
    }
    handleOptionChange(event) {
        this.setState({
            selectedOption: event.target.value
        });
    }
    render() {
        return (
            <div>
                <svg className='PlaylistSettings-close' onClick={this.props.close} xmlns="http://www.w3.org/2000/svg" fill="#999" height="30" viewBox="0 0 24 24" width="30">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    <path d="M0 0h24v24H0z" fill="none" />
                </svg>
                <div className='PlaylistSettings-header'>Playlist Information</div>
                <input className='PlaylistSettings-input' type="text" placeholder="Title" value={this.state.value} onChange={this.handleChange} />
                <div>
                    <label className='PlaylistSettings-radio'>
                        <input type="radio" name="privacy" value="public" checked={this.state.selectedOption === 'public'} onChange={this.handleOptionChange} />
                        <span> Public </span> 
                    </label>
                    <label className='PlaylistSettings-radio'>
                        <input type="radio" name="privacy" value="private" checked={this.state.selectedOption === 'private'} onChange={this.handleOptionChange} />
                        <span> Private </span> 
                    </label>
                </div>
                <div className='PlaylistSettings-submitBtn'>
                    Save Playlist
                </div>
            </div>    
        )
    }
}

export default PlaylistSettings;