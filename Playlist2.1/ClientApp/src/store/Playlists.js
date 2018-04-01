import { push } from 'react-router-redux';
import { getPlaylists, getToken, getPlaylistsByCategory } from '../utils/SpotifyManager';

const requestPlaylists = 'REQUEST_PLAYLISTS';
const receivePlaylists = 'RECEIVE_PLAYLISTS';
const initialState = { playlists: [], categoryName: "Featured", isLoading: false };

export const actionCreators = {
    requestFeaturedPlaylists: () => async (dispatch, getState) => {
        if (getState().playlists.playlists.length > 0) {
            return;
        }

        dispatch({ type: requestPlaylists });

        try {
            var token = getState().auth.token;
            var expires = getState().auth.expiration;

            if (token && expires > Date.now()) {
                //If we have access get playlists and categories
                let { playlists } = await getPlaylists(token);
                dispatch({ type: receivePlaylists, playlists: playlists.items, categoryName: "Featured" })

            } else {
                //Else get token
                let token = await getToken();
                dispatch({ type: 'RECEIVE_TOKEN', token: token });

                let { playlists } = await getPlaylists(token);
                dispatch({ type: receivePlaylists, playlists: playlists.items, categoryName: "Featured" })
            }
        } catch (e) {
            console.log(e);
            dispatch({ type: "SHOW_ERROR", error: "Error" });
        }
        
    },
    requestPlaylistsByCategory: (categoryName, id) => async (dispatch, getState) => {
        dispatch({ type: requestPlaylists });

        try {
            var token = getState().auth.token;
            let { playlists } = await getPlaylistsByCategory(id, token);

            dispatch({ type: receivePlaylists, playlists: playlists.items, categoryName: categoryName })
        } catch (e) {
            console.log(e);
            dispatch({ type: "SHOW_ERROR", error: "Error" });
        }
    },
    viewTracks: (playlist) => (dispatch, getState) => {
        dispatch({ type: 'MAKE_SELECTION', selection: playlist });
        dispatch(push('/playlist?id=' + playlist.id));
    }
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === requestPlaylists) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === receivePlaylists) {
        return {
            playlists: action.playlists,
            categoryName: action.categoryName,
            isLoading: false
        };
    }

    return state;
};