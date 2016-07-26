import { combineReducers } from 'redux';
import games, * as fromGames from './games';
import auth from './auth';


export default combineReducers({
	games,
	auth,
});


// Selectors
export const getGames = (state) => fromGames.getGames(state.games);
