import * as api from '../services/api';
import { ActionTypes } from '../constants';


const apiActionCoordinator = (dispatch, apiMethod, actionTypes) => {
	const [ request, success, failure ] = actionTypes;

	dispatch({ type: request });

	const successHandler = (response) => dispatch({
		type: success,
		...response
	});

	const errorHandler = (error) => dispatch({
		type: failure,
		error: true,
		payload: new Error(error.message || "Something went wrong.")
	});

	apiMethod().then(successHandler, errorHandler);
}


export const fetchNextGames = () => (dispatch, getState) => {

	const state = getState();
	const nextPageURL = state.nextGamePageURL;
	const apiMethod = api.fetchGames(nextPageURL);

	const actionTypes = [
		ActionTypes.FETCH_GAMES_REQUEST,
		ActionTypes.FETCH_GAMES_SUCCESS,
		ActionTypes.FETCH_GAMES_FAILURE
	];

	return apiActionCoordinator(dispatch, apiMethod, actionTypes);
};


export const toggleGameOwnership = (id) => (dispatch, getState) => {

	const apiMethod = () => api.toggleOwnership(id);

	const actionTypes = [
		ActionTypes.TOGGLE_GAME_OWNERSHIP_REQUEST,
		ActionTypes.TOGGLE_GAME_OWNERSHIP_SUCCESS,
		ActionTypes.TOGGLE_GAME_OWNERSHIP_FAILURE
	];

	return apiActionCoordinator(dispatch, apiMethod, actionTypes);
};


export const toggleGameKnowledge = (id) => (dispatch, getState) => {
	const apiMethod = () => api.toggleKnowledge(id);

	const actionTypes = [
		ActionTypes.TOGGLE_GAME_KNOWLEDGE_REQUEST,
		ActionTypes.TOGGLE_GAME_KNOWLEDGE_SUCCESS,
		ActionTypes.TOGGLE_GAME_KNOWLEDGE_FAILURE
	];

	return apiActionCoordinator(dispatch, apiMethod, actionTypes);
};


export const authWithFacebook = (payload) => (dispatch, getState) => {
	const apiMethod = () => api.loginUser(payload);

	const actionTypes = [
		ActionTypes.AUTH_USER_REQUEST,
		ActionTypes.AUTH_USER_SUCCESS,
		ActionTypes.AUTH_USER_FAILURE
	];

	return apiActionCoordinator(dispatch, apiMethod, actionTypes);
};