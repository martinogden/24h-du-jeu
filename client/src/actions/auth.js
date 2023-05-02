import { CALL_API } from 'redux-api-middleware';
import { ActionTypes } from '../constants';


export const authWithFacebook = (payload) => ({
	[CALL_API]: {
		endpoint: '/api/games/facebook-login/',
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({
			signed_request: payload.signedRequest,
			access_token: payload.accessToken,
		}),
		types: [
			ActionTypes.AUTH_USER_REQUEST,
			ActionTypes.AUTH_USER_SUCCESS,
			ActionTypes.AUTH_USER_FAILURE,
		],
	}
});

export const logoutFromFacebook = () => ({
	type: ActionTypes.AUTH_USER_LOGOUT,
});

export const authWithDjango = (payload) => ({
	[CALL_API]: {
		endpoint: '/api/games/django-login/',
		method: 'POST',
		credentials: 'include',
		body: formData2JSON(payload),
		types: [
			ActionTypes.AUTH_USER_REQUEST,
			ActionTypes.AUTH_USER_SUCCESS,
			ActionTypes.AUTH_USER_FAILURE,
		],
	}
});

const formData2JSON = (formData) => {
	const data = {};
	for (const kv of formData.entries())
		data[ kv[0] ] = kv[1].trim();
	return JSON.stringify(data);
};
