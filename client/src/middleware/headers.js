import { CALL_API } from 'redux-api-middleware'
import { AUTH_HEADER_PREFIX } from '../constants';


export const getAuthHeader = (token) => `${AUTH_HEADER_PREFIX}${token}`;


/**
 * set headers on api requests
 */
export default store => next => action => {

	if (!action[CALL_API])
		return next(action);

	action[CALL_API].headers = {
		...action[CALL_API].headers,
		'content-type': 'application/json',
	};

	const auth = store.getState().auth;
	if (auth.token)
		action[CALL_API].headers['Authorization'] = getAuthHeader(auth.token);

	next(action);
}