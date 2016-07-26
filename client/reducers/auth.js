import { combineReducers } from 'redux';
import { ActionTypes } from '../constants';



const isLoggedIn = (state=false, action) => {
	switch(action.type) {
		case ActionTypes.AUTH_USER_SUCCESS:
			return true;

		default:
			return state;
	}
}


export default combineReducers({
	isLoggedIn,
});
