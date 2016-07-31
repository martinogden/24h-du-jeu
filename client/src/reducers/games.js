import { combineReducers } from 'redux';
import { ActionTypes } from '../constants';


const byID = (state={}, action) => {
	// TODO: will work only whilst games are
	// only the objects returned from API
	switch(action.type) {
		case ActionTypes.FETCH_GAMES_SUCCESS:
		case ActionTypes.TOGGLE_GAME_OWNERSHIP_SUCCESS:
		case ActionTypes.TOGGLE_GAME_KNOWLEDGE_SUCCESS:
			if (action.payload)
				return {
					...state,
					...action.payload.entities.games
				}
			break;

		default:
			return state;
	}
}


const list = (state=[], action) => {
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


const nextPageURL = (state=null, action) => {
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


export default combineReducers({
	byID,
	list,
	nextPageURL,
	isFetching,
});


// Selectors

export const getGames = (state) => (
	state.list.map(id => state.byID[id])
);