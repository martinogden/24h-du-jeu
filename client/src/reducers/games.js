import { combineReducers } from 'redux';
import { ActionTypes, PER_PAGE } from '../constants';


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
			return action.payload.result;

		default:
			return state;
	}
}


const page = (state=0, action) => {
	switch(action.type) {
		case ActionTypes.PAGINATE_GAMES:
			return state + 1;

		case ActionTypes.FILTER_GAMES:
			return 1;

		default:
			return state;
	}
}


const query = (state=null, action) => {
	switch(action.type) {
		case ActionTypes.FILTER_GAMES:
			return action.payload;

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
	page,
	query,
	isFetching,
});


/* Selectors */

export const getGames = (state) => {
	const n = state.page * PER_PAGE;

	const matchesFilter = (game) => {
		if (!state.query)
			return true;

		const q = new RegExp(state.query, 'i');
		return game.name.search(q) > -1;
	};

	return state.list
		.slice(0, n)  // pagination
		.map(id => state.byID[id])
		.filter(matchesFilter);  // search
};