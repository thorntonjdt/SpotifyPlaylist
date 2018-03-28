import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/Player';

const Track = (props) => {
    const handleRemove = () => {
        props.handleRemove(props.index);
    }

    const handleReSearch = () => {
        props.handleReSearch(props.track)
    }
    const handlePlay = () => {
        if (props.isSelected) {
            props.togglePlay();
        }
        else if (props.track.preview_url) {
            props.loadTrack(props.index);
        }
    }
    return (
        <li className='Track-container row'>
            <ul className='Track-tools row' style={{ visibility: props.isSelected ? 'visible' : 'hidden' }}>
                <li onClick={handlePlay}>
                    {props.isPlaying
                        ? <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 24 24" width="28">
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            <path d="M0 0h24v24H0z" fill="none" />
                        </svg>

                        : <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 24 24" width="28">
                            <path d="M8 5v14l11-7z" />
                            <path d="M0 0h24v24H0z" fill="none" />
                        </svg>
                    }
                </li>
                <li
                    onClick={handleReSearch}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="26" viewBox="0 0 24 24" width="26">
                        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                        <path d="M0 0h24v24H0z" fill="none" />
                    </svg>
                </li>
                {!props.userPlaylist &&
                    <li
                        onClick={handleRemove}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" height="26" viewBox="0 0 24 24" width="26">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                            <path d="M0 0h24v24H0z" fill="none" />
                        </svg>
                    </li>
                }
            </ul>
            <div className='Track-name'>
                {props.track.name}, {props.track.artists[0].name}
            </div>
        </li>
    );
}

export default connect(
    ({ player }, { track }) => ({ isPlaying: player.loadedTrack && (player.loadedTrack.track.id === track.id) && player.isPlaying, isSelected: player.loadedTrack && (player.loadedTrack.track.id === track.id) }),
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Track);