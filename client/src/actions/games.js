import { CALL_API } from 'redux-api-middleware';

import { ActionTypes, API_ENDPOINT_URL, Schemas } from '../constants';


export const fetchGames = () => ({
	[CALL_API]: {
		endpoint: `${API_ENDPOINT_URL}/games/`,
		method: 'GET',
		credentials: 'include',
		types: [
			ActionTypes.FETCH_GAMES_REQUEST,
			{
				type: ActionTypes.FETCH_GAMES_SUCCESS,
				meta: { schema: Schemas.GAMES },
			},
			ActionTypes.FETCH_GAMES_FAILURE,
		],
	}
});

export const fetchGamesIKnow = () => ({
	[CALL_API]: {
		endpoint: `${API_ENDPOINT_URL}/games/iknow/`,
		method: 'GET',
		credentials: 'include',
		types: [
			ActionTypes.FETCH_GAMES_I_KNOW_REQUEST,
			{
				type: ActionTypes.FETCH_GAMES_I_KNOW_SUCCESS,
				meta: { schema: Schemas.GAMES },
			},
			ActionTypes.FETCH_GAMES_I_KNOW_FAILURE,
		],
	}
});

export const fetchGamesIOwn = () => ({
	[CALL_API]: {
		endpoint: `${API_ENDPOINT_URL}/games/iown/`,
		method: 'GET',
		credentials: 'include',
		types: [
			ActionTypes.FETCH_GAMES_I_OWN_REQUEST,
			{
				type: ActionTypes.FETCH_GAMES_I_OWN_SUCCESS,
				meta: { schema: Schemas.GAMES },
			},
			ActionTypes.FETCH_GAMES_I_OWN_FAILURE,
		],
	}
});

export const paginateGames = () => ({
	type: ActionTypes.PAGINATE_GAMES,
});


export const filterGames = (query) => ({
	type: ActionTypes.FILTER_GAMES,
	payload: query,
});


export const toggleGameOwnership = (id) => ({
	[CALL_API]: {
		endpoint: `${API_ENDPOINT_URL}/games/${id}/owners/`,
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
		endpoint: `${API_ENDPOINT_URL}/games/${id}/knowers/`,
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

export const fetchBGGGames = (query) => ({
	[CALL_API]: {
		endpoint: `${API_ENDPOINT_URL}/games/bgg/?q=${encodeURIComponent(query)}`,
		method: 'GET',
		credentials: 'include',
		types: [
			ActionTypes.FETCH_BGG_GAMES_REQUEST,
			{
				type: ActionTypes.FETCH_BGG_GAMES_SUCCESS,
				meta: { schema: Schemas.BGG_GAMES },
			},
			ActionTypes.FETCH_BGG_GAMES_FAILURE,
		],
	}
});

export const fetchBGGGame = (bgg_id) => ({
	[CALL_API]: {
		endpoint: `${API_ENDPOINT_URL}/games/bgg/${bgg_id}/`,
		method: 'GET',
		credentials: 'include',
		types: [
			ActionTypes.FETCH_BGG_GAME_REQUEST,
			{
				type: ActionTypes.FETCH_BGG_GAME_SUCCESS,
				meta: { schema: Schemas.BGG_GAME },
			},
			ActionTypes.FETCH_BGG_GAME_FAILURE,
		],
	}
});