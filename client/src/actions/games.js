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


export const toggleGameOwnership = (id) => ({
	[CALL_API]: {
		endpoint: `${API_ENDPOINT_URL}/games/${id}/owners`,
		method: 'PATCH',
		credentials: 'include',
		types: [
			ActionTypes.TOGGLE_GAME_OWNERSHIP_REQUEST,
			{
				type: ActionTypes.TOGGLE_GAME_OWNERSHIP_SUCCESS,
				meta: { schema: Schemas.GAME },
			},
			ActionTypes.TOGGLE_GAME_OWNERSHIP_FAILURE,
		],
	}
});


export const toggleGameKnowledge = (id) => ({
	[CALL_API]: {
		endpoint: `${API_ENDPOINT_URL}/games/${id}/knowers`,
		method: 'PATCH',
		credentials: 'include',
		types: [
			ActionTypes.TOGGLE_GAME_KNOWLEDGE_REQUEST,
			{
				type: ActionTypes.TOGGLE_GAME_OWNERSHIP_SUCCESS,
				meta: { schema: Schemas.GAME },
			},
			ActionTypes.TOGGLE_GAME_KNOWLEDGE_FAILURE,
		],
	}
});