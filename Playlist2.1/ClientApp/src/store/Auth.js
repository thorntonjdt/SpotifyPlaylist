import { login, getUser } from '../utils/SpotifyManager';

const receiveToken = 'RECEIVE_TOKEN';
const receiveUser = 'RECEIVE_USER_DATA';
const logout = "LOGOUT";

const initialState = { token: '', user: null };

export const actionCreators = {

    login: () => async (dispatch, getState) => {

        let token = await login();
        dispatch({ type: receiveToken, token: token });

        let user = await getUser(token);
        dispatch({ type: receiveUser, user: user });
        
    },
    logout: () => (dispatch, getState) => {
        dispatch({ type: logout });
    }
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === receiveToken) {
        return {
            token: action.token,
            expiration: Date.now() + 3600 * 1000
        };
    }

    if (action.type === receiveUser) {
        return {
            ...state,
            user: action.user
        };
    }

    if (action.type === logout) {
        return {
            ...state,
            user: null
        }
    }

    return state;
};
