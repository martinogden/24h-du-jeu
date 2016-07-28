import { CALL_API } from 'redux-api-middleware'

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
		action[CALL_API].headers['Authorization'] = `JWT ${auth.token}`;

	next(action);
}