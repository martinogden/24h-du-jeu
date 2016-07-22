import { normalize } from 'normalizr';

import * as api from '../services/api';
import { ActionTypes } from '../constants';
import * as schema from './schema';


const apiActionCoordinator = (dispatch, apiMethod, actionTypes, schema) => {
	const [ request, success, failure ] = actionTypes;

	dispatch({ type: request });

	const successHandler = (response) => dispatch({
		type: success,
		payload: { response: normalize(response, schema) }
	});

	const errorHandler = (error) => dispatch({
		type: failure,
		error: true,
		payload: new Error(error.message || "Something went wrong.")
	});

	apiMethod().then(successHandler, errorHandler);
}


export const fetchGames = () => (dispatch, getState) => {

	const actionTypes = [
		ActionTypes.FETCH_GAMES_REQUEST,
		ActionTypes.FETCH_GAMES_SUCCESS,
		ActionTypes.FETCH_GAMES_FAILURE
	];

	return apiActionCoordinator(
		dispatch,
		api.fetchGames,
		actionTypes,
		schema.arrayOfGames
	);
};


export const toggleGameOwnership = (id) => (dispatch, getState) => {

	const apiMethod = () => api.toggleOwnership(id);

	const actionTypes = [
		ActionTypes.TOGGLE_GAME_OWNERSHIP_REQUEST,
		ActionTypes.TOGGLE_GAME_OWNERSHIP_SUCCESS,
		ActionTypes.TOGGLE_GAME_OWNERSHIP_FAILURE
	];

	return apiActionCoordinator(dispatch, apiMethod, actionTypes, schema.game);
};


export const toggleGameKnowledge = (id) => (dispatch, getState) => {
	const apiMethod = () => api.toggleKnowledge(id);

	const actionTypes = [
		ActionTypes.TOGGLE_GAME_KNOWLEDGE_REQUEST,
		ActionTypes.TOGGLE_GAME_KNOWLEDGE_SUCCESS,
		ActionTypes.TOGGLE_GAME_KNOWLEDGE_FAILURE
	];

	return apiActionCoordinator(dispatch, apiMethod, actionTypes, schema.game);
};