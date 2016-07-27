import assert from 'assert';
import deepFreeze from 'deep-freeze';

import { getGames } from 'reducers/games';


describe('selectors::getGames', () => {

	it('should compose array of games using keys from gameList and gamesByID reducers', () => {
		const state = {
			list: [1, 2],
			byID: {
				1: {id: 1},
				2: {id: 2},
				3: {id: 3},
			}
		};

		const expectedGames = [
			{id: 1},
			{id: 2},
		];

		deepFreeze(state);

		const games = getGames(state);

		assert.deepEqual(games, expectedGames);
	})

})