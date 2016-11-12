import { combineReducers } from 'redux';
import { ActionTypes, PER_PAGE } from '../constants';

const currentUser = (state={}, action) => {
	switch(action.type) {
		case ActionTypes.AUTH_USER_SUCCESS:
			return action.payload;

		default:
			return state;
	}
}

export default combineReducers({
	currentUser,
});

/* Selectors */
export const getLoggedInUser = (state) => (
	state.currentUser
);