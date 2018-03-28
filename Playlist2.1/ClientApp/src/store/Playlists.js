import { push } from 'react-router-redux';
import { getPlaylists, getCategories, getToken, getPlaylistsByCategory } from '../utils/SpotifyManager';

const requestPlaylists = 'REQUEST_PLAYLISTS';
const receivePlaylists = 'RECEIVE_PLAYLISTS';
const initialState = { playlists: [], categories: null, categoryName: "Featured", isLoading: false };

export const actionCreators = {
    requestFeaturedPlaylists: () => async (dispatch, getState) => {
        if (getState().playlists.categories) {
            return;
        }

        dispatch({ type: requestPlaylists });

        var token = getState().auth.token;
        var expires = getState().auth.expiration;

        if (token && expires > Date.now()) {
            //If we have access get playlists and categories
            let [{ playlists }, categories] = await Promise.all([getPlaylists(token), getCategories(token)])

            dispatch({ type: receivePlaylists, playlists: playlists.items, categories: categories, categoryName: "Featured" })
            
        } else {
            //Else get token
            let token = await getToken();
            dispatch({ type: 'RECEIVE_TOKEN', token: token });

            let [{ playlists }, categories] = await Promise.all([getPlaylists(token), getCategories(token)])

            dispatch({ type: receivePlaylists, playlists: playlists.items, categories: categories, categoryName: "Featured" })
        }
    },
    requestPlaylistsByCategory: (categoryName, id) => async (dispatch, getState) => {
        dispatch({ type: requestPlaylists });

        var token = getState().auth.token;
        let { playlists } = await getPlaylistsByCategory(id, token);

        dispatch({ type: receivePlaylists, playlists: playlists.items, categoryName: categoryName })
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
            categories: action.categories || state.categories,
            categoryName: action.categoryName,
            isLoading: false
        };
    }

    return state;
};