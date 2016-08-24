import assert from 'assert';
import deepFreeze from 'deep-freeze';

import { getOwnedGameIDs, getKnownGameIDs } from 'reducers';
import { getGames } from 'reducers/games';


describe('selectors::getGames', () => {

	it('should compose array of games using keys from gameList and gamesByID reducers', () => {
		const state = {
			list: [1, 2],
			byID: {
				1: {id: 1},
				2: {id: 2},
				3: {id: 3},
			},
			page: 1,
		};

		const expectedGames = [
			{ id: 1, knowers: [], owners: [] },
			{ id: 2, knowers: [], owners: [] },
		];

		deepFreeze(state);

		const games = getGames(state);

		assert.deepEqual(games, expectedGames);
	})

})


describe('selectors::getOwnedGameIDs', () => {

	it('should return list of games owned by user', () => {
		const USER_ID = 1;

		const state = {
			games: {
				list: [1, 2],
				byID: {
					1: { id: 1, owners: [], knowers: [] },
					2: { id: 2, owners: [USER_ID], knowers: [] },
					3: { id: 3, owners: [USER_ID], knowers: [] },
				},
				usersByID: {
					[USER_ID]: { id: USER_ID },
				},
				page: 1,
			},
			auth: { userID: USER_ID },
		};

		const expectedGameIDs = [2];
		const gameIDs = getOwnedGameIDs(state);

		assert.deepEqual(gameIDs, expectedGameIDs);
	})

})


describe('selectors::getKnownGameIDs', () => {

	it('should return list of games known by user', () => {
		const USER_ID = 1;

		const state = {
			games: {
				list: [1, 2],
				byID: {
					1: { id: 1, owners: [], knowers: [] },
					2: { id: 2, owners: [], knowers: [USER_ID] },
					3: { id: 3, owners: [], knowers: [USER_ID] },
				},
				usersByID: {
					[USER_ID]: { id: USER_ID },
				},
				page: 1,
			},
			auth: { userID: USER_ID },
		};

		const expectedGameIDs = [2];
		const gameIDs = getKnownGameIDs(state);

		assert.deepEqual(gameIDs, expectedGameIDs);
	})

})