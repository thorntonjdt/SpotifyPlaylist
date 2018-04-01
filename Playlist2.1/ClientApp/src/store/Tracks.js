import { getTrack, getTracks, getPlaylistTracks, getPlaylist, getToken, savePlaylist } from '../utils/SpotifyManager';

const receivePlaylist = "RECEIVE_PLAYLIST";
const requestPlaylist = "REQUEST_PLAYLIST";
const addTrack = "ADD_TRACK";
const removeTrack = "REMOVE_TRACK";

const initialState = { mainTrack: {}, tracks: [], isLoading: false, userPlaylist: null };

export const actionCreators = {
    makePlaylist: (id) => async (dispatch, getState) => {
        dispatch({ type: requestPlaylist });
        try {
            var { token, expiration } = getState().auth;
            var { selection } = getState().search;
            if (token && expiration > Date.now()) {
                if (selection) {
                    let { tracks, mainTrack } = await getTracks(selection, token);

                    dispatch({ type: receivePlaylist, tracks: tracks, mainTrack: mainTrack, userPlaylist: false })

                } else {

                    let track = await getTrack(id, token);
                    let { tracks, mainTrack } = await getTracks(selection, token);

                    dispatch({ type: receivePlaylist, tracks: tracks, mainTrack: mainTrack, userPlaylist: false })
                    dispatch({ type: 'MAKE_SELECTION', selection: track });
                }
            } else {

                let token = getToken();
                dispatch({ type: "RECEIVED_TOKEN", token: token })
                if (selection) {

                    let { tracks, mainTrack } = await getTracks(selection, token)

                    dispatch({ type: receivePlaylist, tracks: tracks, mainTrack: mainTrack, userPlaylist: false })

                } else {
                    let token = await getToken();
                    dispatch({ type: "RECEIVED_TOKEN", token: token })

                    let track = await getTrack(id, token);
                    let { tracks, mainTrack } = await getTracks(track, token);

                    dispatch({ type: receivePlaylist, tracks: tracks, mainTrack: mainTrack, userPlaylist: false })
                    dispatch({ type: 'MAKE_SELECTION', selection: track });
                }
            }
        } catch(e) {
            console.log(e)
            dispatch({ type: "SHOW_ERROR", error: "Error" });
        }
        
    },
    getPlaylist: (id) => async (dispatch, getState) => {
        dispatch({ type: requestPlaylist })

        try {
            var { token, expiration } = getState().auth;
            var { selection } = getState().search;
            if (token && expiration > Date.now()) {

                let tracks = await getPlaylistTracks(id, token);
                dispatch({ type: receivePlaylist, tracks: tracks, mainTrack: { image: selection.images[0].url, title: selection.name }, userPlaylist: true })

            } else {
                let token = await getToken();
                dispatch({ type: "RECEIVED_TOKEN", token: token })

                let playlist = await getPlaylist(id, token);
                let tracks = await getPlaylistTracks(id, token);
                dispatch({ type: receivePlaylist, tracks: tracks, mainTrack: { image: playlist.images[0].url, title: playlist.name }, userPlaylist: true })
                dispatch({ type: 'MAKE_SELECTION', selection: playlist })
            }
        } catch (e) {
            console.log(e)
            dispatch({ type: "SHOW_ERROR", error: "Error" });
        }
        
    },

    handleReSearch: (track) => async (dispatch, getState) => {
        var { token, expiration } = getState().auth;
        var { selection } = getState().search;
        try {
            if (token && expiration > Date.now()) {

                let { tracks, mainTrack } = await getTracks(selection, token);
                dispatch({ type: receivePlaylist, tracks: tracks, mainTrack: mainTrack, userPlaylist: false })

            } else {
                let token = await getToken();
                dispatch({ type: "RECEIVED_TOKEN", token: token })

                let { tracks, mainTrack } = await getTracks(track, token);
                dispatch({ type: receivePlaylist, tracks: tracks, mainTrack: mainTrack, userPlaylist: false })
            }
        } catch (e) {
            console.log(e)
            dispatch({ type: "SHOW_ERROR", error: "Error" });
        }
        
    },
    savePlaylist: () => ({ type: "SET_MODAL", isOpen: "playlist" }),

    addTrack: () => (dispatch, getState) =>
        dispatch({ type: addTrack, track: getState().search.selection }),

    removeTrack: (index) => ({ type: removeTrack, index: index })
};


export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === requestPlaylist) {
        return {
            isLoading: true
        };
    }

    if (action.type === receivePlaylist) {
        return {
            tracks: action.tracks,
            mainTrack: action.mainTrack,
            userPlaylist: action.userPlaylist
        };
    }

    if (action.type === addTrack) {
        return {
            ...state,
            tracks: [action.track, ...state.tracks]
        };
    }

    if (action.type === removeTrack) {
        return {
            ...state,
            tracks: [...state.tracks.slice(0, action.index), ...state.tracks.slice(action.index + 1)]
        };
    }
    

    return state;
};
