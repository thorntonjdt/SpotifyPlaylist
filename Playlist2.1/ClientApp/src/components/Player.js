import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/Player';

class Player extends React.Component {

    componentDidUpdate(prevProps) {
        if (this.props.loadedTrack) {
            if (this.props.loadedTrack !== prevProps.loadedTrack) {
                this.audio.load();
                this.audio.play();
                setInterval(this.onUpdate, 150);
                this.audio.addEventListener('ended', this.props.playNext);
            }
            if (this.props.isPlaying !== prevProps.isPlaying) {
                if (prevProps.isPlaying) {
                    this.audio.pause();
                } else {
                    this.audio.play();
                }
            }
        }
    }

    is_progress_dirty = false;

    onUpdate =() => {
        if (this.audio && !this.is_progress_dirty) {
            let progress = this.audio.currentTime / this.audio.duration;
            this.props.updateProgress(progress);
        }
    }
    startSettingProgress = (evt) => {
        this.props.setProgressMode(true);
        this.setProgress(evt);
    }
    stopSettingProgress = (evt) => {
        this.props.setProgressMode(false);
        this.setProgress(evt);
    }
    setProgress = (evt) => {
        if (this.props.settingProgress) {
            var progress = (evt.clientX - offsetLeft(this.progress_bar)) / this.progress_bar.clientWidth;
            this.props.updateProgress(progress);
            this.is_progress_dirty = true;
        }
    }
    render() {
        const { loadedTrack, progress, isPlaying } = this.props;
        if (!loadedTrack) {
            return null;
        }

        var currentTime = 0;
        var totalTime = 0;
        if (this.audio) {
            if (this.is_progress_dirty) {
                this.is_progress_dirty = false;

                this.audio.currentTime = this.audio.duration * progress;
            }

            currentTime = this.audio.currentTime;
            totalTime = this.audio.duration;
        }

        return (
            <div className='Player-buffer'>
                <div className='Player-popup row'>
                    <div className='Player-info row'>
                        <img width="60" height="60" src={loadedTrack.track.album.images[1].url} />
                        <span>
                            <div>{loadedTrack.track.name}</div>
                            <div className='Player-artistName'>{loadedTrack.track.artists[0].name}</div>
                        </span>
                    </div>
                    <div className='Player-controls'>
                        <div className='Player-buttons row'>
                            <svg onClick={this.props.playPrevious} height="28" viewBox="0 0 24 24" width="28" >
                                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                                <path d="M0 0h24v24H0z" fill="none" />
                            </svg>
                            {isPlaying
                                ? <svg onClick={this.props.togglePlay} height="28" viewBox="0 0 24 24" width="28" >
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                    <path d="M0 0h24v24H0z" fill="none" />
                                </svg>

                                : <svg onClick={this.props.togglePlay} xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 24 24" width="28">
                                    <path d="M8 5v14l11-7z" />
                                    <path d="M0 0h24v24H0z" fill="none" />
                                </svg>
                            }
                            <svg onClick={this.props.playNext} height="28" viewBox="0 0 24 24" width="28">
                                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                                <path d="M0 0h24v24H0z" fill="none" />
                            </svg>
                        </div>
                        <div
                            onMouseDown={this.startSettingProgress}
                            onMouseMove={this.setProgress}
                            onMouseLeave={this.stopSettingProgress}
                            onMouseUp={this.stopSettingProgress}
                            className='Player-progress'
                        >
                            <div ref={(ref) => this.progress_bar = ref} className='Player-bar'>
                                <div style={{ width: (this.props.progress * 100) + '%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
                <audio ref={audio => { this.audio = audio; }} src={loadedTrack.track.preview_url} preload='none' />
            </div>
        );
    }
}

function offsetLeft(el) {
    var left = 0;
    while (el && el !== document) {
        left += el.offsetLeft;
        el = el.offsetParent;
    }
    return left;
}

Player.displayName = "Player";

export default connect(
    state => state.player,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Player);