import { fetchGames, toggleOwnership, toggleKnowledge } from '../services/api';
import { ActionTypes } from '../constants';
import { apiActionCoordinator } from './utils';


export const fetchNextGames = () => (dispatch, getState) => {

	const state = getState();
	const nextPageURL = state.games.nextPageURL;
	const apiMethod = fetchGames(nextPageURL);

	const actionTypes = [
		ActionTypes.FETCH_GAMES_REQUEST,
		ActionTypes.FETCH_GAMES_SUCCESS,
		ActionTypes.FETCH_GAMES_FAILURE
	];

	return apiActionCoordinator(dispatch, apiMethod, actionTypes);
};


export const toggleGameOwnership = (id) => (dispatch, getState) => {

	const apiMethod = () => toggleOwnership(id);

	const actionTypes = [
		ActionTypes.TOGGLE_GAME_OWNERSHIP_REQUEST,
		ActionTypes.TOGGLE_GAME_OWNERSHIP_SUCCESS,
		ActionTypes.TOGGLE_GAME_OWNERSHIP_FAILURE
	];

	return apiActionCoordinator(dispatch, apiMethod, actionTypes);
};


export const toggleGameKnowledge = (id) => (dispatch, getState) => {
	const apiMethod = () => toggleKnowledge(id);

	const actionTypes = [
		ActionTypes.TOGGLE_GAME_KNOWLEDGE_REQUEST,
		ActionTypes.TOGGLE_GAME_KNOWLEDGE_SUCCESS,
		ActionTypes.TOGGLE_GAME_KNOWLEDGE_FAILURE
	];

	return apiActionCoordinator(dispatch, apiMethod, actionTypes);
};
