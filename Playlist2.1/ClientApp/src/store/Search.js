import { autocomplete } from '../utils/SpotifyManager';

const inputChange = 'INPUT_CHANGE';
const receiveSuggestions = 'RECEIVE_SUGGESTIONS';
const clearSuggestions = 'CLEAR_SUGGESTIONS';
const makeSelection = 'MAKE_SELECTION';
const initialState = { value: '', suggestions: [], selection: null };

export const actionCreators = {
    handleChange: (value) => ({ type: inputChange, value: value }),

    makeSelection: (selection) => ({ type: makeSelection, selection: selection }),

    requestSuggestions: ({ value }) => async (dispatch, getState) => {
        let suggestions = await autocomplete(value, getState().auth.token);
        dispatch({ type: receiveSuggestions, suggestions: suggestions.tracks.items });
    },

    clearSuggestions: () => ({ type: clearSuggestions })
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === inputChange) {
        return {
            ...state,
            value: action.value
        };
    }

    if (action.type === receiveSuggestions) {
        return {
            ...state,
            suggestions: action.suggestions
        };
    }

    if (action.type === clearSuggestions) {
        return {
            ...state,
            suggestions: []
        }
    }

    if (action.type === makeSelection) {
        return {
            suggestions: [],
            selection: action.selection
        }
    }

    return state;
};