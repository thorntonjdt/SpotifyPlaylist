import { savePlaylist } from '../utils/SpotifyManager';

const setModal = "SET_MODAL";
const initialState = { isOpen: false, isLoading: false, success: false, error: false };

export const actionCreators = {
    openModal: (modal) => ({ type: setModal, isOpen: modal }),

    closeModal: () => ({ type: setModal, isOpen: false }),

    savePlaylist: () => async (dispatch, getState) => {
        let { user, token } = getState().auth;
        let { tracks } = getState().tracks;

        let playlist = await savePlaylist(token, user.id, 'TEST', true, tracks);
        dispatch({ type: setModal, isOpen: false });
    }
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === setModal) {
        return {
            isOpen: action.isOpen
        };
    }

    return state;
};
