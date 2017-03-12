import { combineReducers } from 'redux';
import games, * as fromGames from './games';
import auth from './auth';
import users, * as fromUsers from './users';


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
		users.filter(user => user.id === id).length > 0
	);

	return getGames(state)
		.filter(game => isUserInList(game[by], userID))
		.map(game => game.id);
}


export default combineReducers({
	games,
	auth,
	users,
});


// Selectors
export const getGames = (state) => fromGames.getGames(state.games);
export const getOwnedGameIDs = (state) => filterGameIDs('owners', state);
export const getKnownGameIDs = (state) => filterGameIDs('knowers', state);
export const getBggGames = (state) => fromGames.getBggGames(state.games);
export const getBggGameDetailed = (state, id) => fromGames.getBggGameDetailed(state, id);
export const getLoggedInUser = (state) => fromUsers.getLoggedInUser(state.users);
