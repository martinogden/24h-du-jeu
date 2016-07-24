import { combineReducers } from 'redux';
import { fetchGames } from '../actions';
import { ActionTypes } from '../constants';


const gamesByID = (state={}, action) => {
	// TODO: will work only whilst games are
	// only the objects returned from API
	if (action.payload) {
		return {
			...state,
			...action.payload.entities.games
		}
	}

	return state;
}


const gameList = (state=[], action) => {
	switch(action.type) {
		case ActionTypes.FETCH_GAMES_SUCCESS:
			// append ids
			return [
				...state,
				...action.payload.result
			];

		default:
			return state;
	}
}


const nextGamePageURL = (state=null, action) => {
	switch(action.type) {
		case ActionTypes.FETCH_GAMES_SUCCESS:
			return action.meta.nextPageURL;

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


const RootReducer = combineReducers({
	gamesByID,
	gameList,
	isFetching,
	nextGamePageURL
});

export default RootReducer;


// Selectors

export const getGames = (state) => (
	state.gameList.map(id => state.gamesByID[id])
);

export const getIsFetching = (state) => state.isFetching;