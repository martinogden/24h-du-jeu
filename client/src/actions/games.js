import { CALL_API } from 'redux-api-middleware';
import parse from 'parse-link-header';

import { ActionTypes, API_ENDPOINT_URL, Schemas } from '../constants';


const getMeta = (action, state, response) => {
	const header = response.headers.get('link', '');
	const links = parse(header);

	if (links && links.next)
		return {
			schema: Schemas.GAMES,
			nextPageURL: links.next.url,
		};
};


export const fetchNextGames = () => (dispatch, getState) => dispatch({
	[CALL_API]: {
		endpoint: getState().games.nextPageURL || `${API_ENDPOINT_URL}/games`,
		method: 'GET',
		types: [
			ActionTypes.FETCH_GAMES_REQUEST,
			{ type: ActionTypes.FETCH_GAMES_SUCCESS, meta: getMeta },
			ActionTypes.FETCH_GAMES_FAILURE,
		],
	}
});


export const toggleGameOwnership = (id) => {};
export const toggleGameKnowledge = (id) => {};
