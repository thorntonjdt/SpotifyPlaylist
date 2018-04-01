import { savePlaylist, login, getUser } from '../utils/SpotifyManager';

const setModal = "SET_MODAL";
const spotifyError = "SHOW_ERROR";
const initialState = { isOpen: false, error: false };

export const actionCreators = {
    openModal: (modal) => ({ type: setModal, isOpen: modal }),

    closeModal: () => ({ type: setModal, isOpen: false }),

    savePlaylist: (name, privacy) => async (dispatch, getState) => {
        dispatch({ type: setModal, isOpen: "loading" });
        let { user, token, expiration } = getState().auth;
        let { tracks } = getState().tracks;
        let isPublic = privacy === "public" ? true : false;

        try {
            if (user && expiration > Date.now()) {
                let playlist = await savePlaylist(token, user.id, name, isPublic, tracks);
                dispatch({ type: setModal, isOpen: false });
            } else {
                let token = await login();
                dispatch({ type: 'RECEIVE_TOKEN', token: token });

                let user = await getUser(token);
                dispatch({ type: 'RECEIVE_USER_DATA', user: user });

                let playlist = await savePlaylist(token, user.id, name, isPublic, tracks);
                dispatch({ type: setModal, isOpen: false });
            }
 
        } catch (e) {
            console.log(e);
            dispatch({ type: spotifyError, error: "Unable to save playlist" });
        }
    },
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === setModal) {
        return {
            isOpen: action.isOpen
        };
    }
    if (action.type === spotifyError) {
        return {
            isOpen: true,
            error: action.error
        };
    }

    return state;
};
