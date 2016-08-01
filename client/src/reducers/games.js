import { combineReducers } from 'redux';
import { ActionTypes, PER_PAGE } from '../constants';


const byID = (state={}, action) => {
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

const normalize = (str) => {
	if (!str)
		return '';

	const [ a, e, i, o, u, c ] = 'aeiouc';
	const dict = {
		'â': a, 'à': a, 'ä': a,
		'é': e, 'è': e, 'ê': e, 'ë': e,
		'î': i, 'ï': i,
		'ô': o, 'œ': o + e,
		'û': u, 'ü': u,
		'ç': c,
	};

	return str
		.split('')
		.map(c => dict[c] ? dict[c] : c)
		.join('');
}


export const getGames = (state) => {
	const n = state.page * PER_PAGE;
	const query = normalize(state.query)
	const pattern = new RegExp(query, 'i');

	const matchesFilter = (game) => {
		if (!query)
			return true;

		return game.sort_name.search(pattern) > -1;
	};

	return state.list
		.slice(0, n)  // pagination
		.map(id => state.byID[id])
		.filter(matchesFilter);  // search
};