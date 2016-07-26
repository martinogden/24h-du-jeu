import { loginUser } from '../services/api';
import { ActionTypes } from '../constants';
import { apiActionCoordinator } from './utils';


export const authWithFacebook = (payload) => (dispatch, getState) => {
	const apiMethod = () => loginUser(payload);

	const actionTypes = [
		ActionTypes.AUTH_USER_REQUEST,
		ActionTypes.AUTH_USER_SUCCESS,
		ActionTypes.AUTH_USER_FAILURE
	];

	return apiActionCoordinator(dispatch, apiMethod, actionTypes);
};