import { combineReducers } from 'redux';
import games, * as fromGames from './games';
import auth from './auth';


/**
 * Utility to to find games that user knows or owns
 *
 * @param {String} by - (own|know)
 * @param {Array} state
 * @returns {Array} of game IDs
 */
const filterGameIDs = (by, state) => {
	const userID = state.auth.userID;

	if (!userID)
		return [];

	const isUserInList = (users, id) => (
		users.filter(uid => uid === id).length > 0
	);

	return getGames(state)
		.filter(game => isUserInList(game[by], userID))
		.map(game => game.id);
}


export default combineReducers({
	games,
	auth,
});


// Selectors
export const getGames = (state) => fromGames.getGames(state.games);
export const getOwnedGameIDs = (state) => filterGameIDs('owners', state);
export const getKnownGameIDs = (state) => filterGameIDs('knowers', state);