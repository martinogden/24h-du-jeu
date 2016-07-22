import { combineReducers } from 'redux';
import { fetchGames } from '../actions';
import { ActionTypes } from '../constants';


const game = {
	id: 1,
	name: "Test Game",
	img: "http://dummyimage.com/100x100/000/fff&text=test+img"
};


const games = (state=[], action) => {
	switch(action.type) {
		case ActionTypes.FETCH_GAMES_SUCCESS:
			return action.payload.response;

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

const RootReducer = combineReducers({ games, isFetching });
export default RootReducer;