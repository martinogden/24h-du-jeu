import { combineReducers } from 'redux';
import { fetchGames } from '../actions';
import { ActionTypes } from '../constants';


const gamesByID = (state={}, action) => {
	switch(action.type) {
		case ActionTypes.FETCH_GAMES_SUCCESS:
			const response = action.payload.response;
			return response.entities.game;

		default:
			return state;
	}
}


const gameList = (state=[], action) => {
	switch(action.type) {
		case ActionTypes.FETCH_GAMES_SUCCESS:
			const response = action.payload.response;
			return response.result;

		default:
			return state;
	}
}


const isFetching = (state=false, action) => {
	switch(action.type) {
		case ActionTypes.FETCH_GAMES_SUCCESS:
		case ActionTypes.FETCH_GAMES_FAILURE:
			return false;

		case ActionTypes.FETCH_GAMES_REQUEST:
			return true;

		default:
			return state;
	}
}


const RootReducer = combineReducers({ gamesByID, gameList, isFetching });
export default RootReducer;


// Selectors

export const getGames = (state) => (
	state.gameList.map(id => state.gamesByID[id])
);

export const getIsFetching = (state) => state.isFetching;