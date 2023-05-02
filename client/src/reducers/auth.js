import { combineReducers } from 'redux';
import { ActionTypes } from '../constants';



const isLoggedIn = (state=false, action) => {
	switch(action.type) {
		case ActionTypes.AUTH_USER_SUCCESS:
			return true;

		case ActionTypes.AUTH_USER_LOGOUT:
			return false;

		default:
			return state;
	}
}

const failedLogIn = (state=false, action) => {
	switch(action.type) {
		case ActionTypes.AUTH_USER_FAILURE:
			return true;

		case ActionTypes.AUTH_USER_SUCCESS:
		case ActionTypes.AUTH_USER_LOGOUT:
			return false;

		default:
			return state;
	}
}

const csrf_token = (state=null, action) => {
	switch(action.type) {
		case ActionTypes.AUTH_USER_SUCCESS:
			return action.payload.csrf_token;

		default:
			return state;
	}
}

const userID = (state=null, action) => {
	switch(action.type) {
		case ActionTypes.AUTH_USER_SUCCESS:
			return action.payload.user_id;

		default:
			return state;
	}
}


export default combineReducers({
	isLoggedIn,
	failedLogIn,
	csrf_token,
	userID,
});
