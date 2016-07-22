import * as api from '../services/api';
import { ActionTypes } from '../constants';


export const fetchGames = () => (dispatch, getState) => {
	const state = getState();

	if (!state.isFetching)
		dispatch({ type: ActionTypes.FETCH_GAMES_REQUEST });

	const success = (response) => dispatch({
		type: ActionTypes.FETCH_GAMES_SUCCESS,
		payload: { response: response }
	});

	const error = (error) => dispatch({
		type: ActionTypes.FETCH_GAMES_FAILURE,
		error: true,
		payload: new Error(error.message || "Something went wrong.")
	});

	api.fetchGames().then(success, error);
};