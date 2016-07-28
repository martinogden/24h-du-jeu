import { CALL_API } from 'redux-api-middleware';
import { ActionTypes, API_ENDPOINT_URL } from '../constants';


export const authWithFacebook = (payload) => ({
	[CALL_API]: {
		endpoint: '/auth',
		method: 'POST',
		body: JSON.stringify({
			id: payload.id,
			signedRequest: payload.signedRequest,
		}),
		types: [
			ActionTypes.AUTH_USER_REQUEST,
			ActionTypes.AUTH_USER_SUCCESS,
			ActionTypes.AUTH_USER_FAILURE,
		],
	}
});