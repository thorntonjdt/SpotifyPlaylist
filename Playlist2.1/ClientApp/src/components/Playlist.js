import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import qs from 'qs';
import { Parallax } from 'react-parallax';
import { actionCreators } from '../store/Tracks';

import SearchBox from './SearchBox';
import Track from './Track';

import loader from '../images/loading.svg';

class Playlist extends React.Component {
    componentWillMount() {
        let parsed = qs.parse(this.props.location.search.slice(1));
        if (parsed.make) {
            this.props.makePlaylist(parsed.make);
        }
        if (parsed.id) {
            this.props.getPlaylist(parsed.id)
        }
    }
    render() {
        const { isLoading, tracks, mainTrack, userPlaylist } = this.props;

        if (isLoading) {
            return (
                <div className='Playlist-loader row'>
                    <img src={loader} />
                </div>
            )
        }

        return (
            <div>
                <div className='Playlist-info'>
                    {!tracks.length &&
                        <div>Hey! The track doesn't exist! :(</div>
                    }
                    {mainTrack &&
                        <Parallax
                            bgImage={mainTrack.image}
                            strength={500}
                        >
                            <div className='Playlist-header'>
                                <Link to="/" className='Playlist-closeBtn'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" height="30" viewBox="0 0 24 24" width="30">
                                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                        <path d="M0 0h24v24H0z" fill="none" />
                                    </svg>
                                </Link>
                                {!userPlaylist && <span className='Playlist-saveBtn' onClick={this.props.savePlaylist}>SAVE</span>}
                                <div className='Playlist-title'>
                                    {mainTrack.title}
                                </div>
                                <div className='Playlist-gradient'></div>
                            </div>
                        </Parallax>
                    }
                </div>
                <div className='Playlist-playlist'>
                    {!userPlaylist &&
                        <div className='Playlist-controls row'>
                            <SearchBox
                                placeholder="Add a new song to the playlist"
                                theme={{ suggestionsContainer: 'Playlist-suggestionsContainer', input: 'Playlist-input' }}
                                handleSubmit={() => { this.props.addTrack() }}
                            />
                        </div>
                    }
                    <ul>
                        {tracks.length &&
                            tracks.map((track, i) =>
                                <Track
                                    track={track}
                                    key={'track_' + track.id}
                                    index={i}
                                    handleRemove={this.props.removeTrack}
                                    handleReSearch={this.props.handleReSearch}
                                    userPlaylist={userPlaylist}
                                />
                            )
                        }
                    </ul>
                </div>
            </div>
        )
    }
}

Playlist.displayName = "Playlist";

export default connect(
    state => state.tracks,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Playlist);