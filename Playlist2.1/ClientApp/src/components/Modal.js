import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/Modal';

import PlaylistSettings from './PlaylistSettings';

class Modal extends React.Component {
    constructor() {
        super();
        this.renderContent = this.renderContent.bind(this);
    }
    renderContent() {
        let { isLoading, error, success, isOpen } = this.props;
        if (isLoading) {
            return <div>Loading...</div>
        }
        else if (error) {
            return <div>Error</div>
        }
        else if (success) {
            return <div>Success</div>
        }
        else if (isOpen == "playlist") {
            return <PlaylistSettings close={this.props.closeModal} />
        }
    }
    render() {
        let { isOpen } = this.props;

        if (isOpen) {
            return (
                <div className='Modal-container row'>
                    <div className='Modal-content'>
                        {this.renderContent()}
                    </div>
                </div>
            )
        }

        return null;
    }
}

export default connect(
    state => state.modal,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Modal);