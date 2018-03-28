const loadTrack = "LOAD_TRACK";
const togglePlay = "TOGGLE_PLAY";
const setProgressMode = 'SET_PROGRESS_MODE';
const updateTrackProgress = 'UPDATE_TRACK_PROGRESS';

const initialState = { loadedTrack: null, isPlaying: false, progress: 0, settingProgress: false };

export const actionCreators = {
    loadTrack: (index) => (dispatch, getState) => {
        let track = getState().tracks.tracks[index];
        dispatch({ type: loadTrack, loadedTrack: { index: index, track: track } });
    },

    togglePlay: () => ({ type: togglePlay }),

    playNext: () => (dispatch, getState) => {
        let { tracks } = getState().tracks;
        let { index } = getState().player.loadedTrack;
        for (let i = index + 1; i < tracks.length; i++) {
            if (tracks[i].preview_url) {
                dispatch({ type: loadTrack, loadedTrack: { index: i, track: tracks[i] } })
                return;
            }
        }
    },
    playPrevious: () => (dispatch, getState) => {
        let { tracks } = getState().tracks;
        let { index } = getState().player.loadedTrack;
        for (let i = index - 1; i >= 0; i--) {
            if (tracks[i].preview_url) {
                dispatch({ type: loadTrack, loadedTrack: { index: i, track: tracks[i] } })
                return;
            }
        }
    },
    setProgressMode: (settingProgress) => ({ type: setProgressMode, settingProgress: settingProgress }),

    updateProgress: (progress) => ({ type: updateTrackProgress, progress: progress })
};


export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === loadTrack) {
        return {
            loadedTrack: action.loadedTrack,
            isPlaying: true,
            progress: 0
        };
    }

    if (action.type === togglePlay) {
        return {
            ...state,
            isPlaying: !state.isPlaying
        };
    }

    if (action.type === setProgressMode) {
        return {
            ...state,
            settingProgress: action.settingProgress
        };
    }

    if (action.type === updateTrackProgress) {
        return {
            ...state,
            progress: action.progress
        };
    }

    return state;
};
