import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/Auth';

import spotifyLogo from '../images/spotify.png';

const SpotifyAuth = ({ user, login, logout }) => {
    if (user) {
        return (
            <div className='Auth-position row'>
                <span onClick={logout} style={{ cursor: 'pointer' }}>Logout</span>
                <img src={user.images[0].url} height="45" width="45" className='Auth-user' />
            </div>
        );
    }
    return (
        <span className='Auth-loginBtn Auth-position' onClick={login}><img src={spotifyLogo} /></span>
    )
}

SpotifyAuth.displayName = "SpotifyAuth";

export default connect(
    ({ auth }) => ({ user: auth.user }),
    dispatch => bindActionCreators(actionCreators, dispatch)
)(SpotifyAuth);