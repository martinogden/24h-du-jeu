import assert from 'assert';
import deepFreeze from 'deep-freeze';
import deepcopy from 'deepcopy';

import { ActionTypes } from 'constants';
import reducer from 'reducers/games';


// example object returned by normalizr
const payload = {
	entities: { games: {
		2: {id: 2},
		3: {id: 3},
	}},
	result: [2, 3],
};


const nextPageURL = 'http://google.com/'

const fetch_success_action = {
	type: ActionTypes.FETCH_GAMES_SUCCESS,
	meta: { nextPageURL },
	payload,
};

const fetch_failure_action = {
	type: ActionTypes.FETCH_GAMES_FAILURE
};


const fetch_request_action = {
	type: ActionTypes.FETCH_GAMES_REQUEST
};


describe('reducers::games::list', () => {

	describe('on FETCH_GAMES_SUCCESS', () => {
		it('should append game id\'s to state', () => {
			const stateBefore = [1];
			const stateAfter = [1, 2, 3];

			deepFreeze(stateBefore);

			const state = reducer(
				{ list: stateBefore },
				fetch_success_action
			);

			assert.deepEqual(state['list'], stateAfter);
		})
	})

	it('should return an empty list as default state', () => {
		const state = reducer({}, {});
		assert.deepEqual(state['list'], []);
	})

})


describe('reducers::games::byID', () => {

	describe('on FETCH_GAMES_SUCCESS', () => {
		it('should add games to state lookup table', () => {
			const stateBefore = {
				1: {id: 1},
			};

			const stateAfter = {
				1: {id: 1},
				2: {id: 2},
				3: {id: 3},
			};

			deepFreeze(stateBefore);

			const state = reducer(
				{ byID: stateBefore },
				fetch_success_action
			);

			assert.deepEqual(state['byID'], stateAfter);
		})
	})

	it('should return an empty object as default state', () => {
		const state = reducer({}, {});
		assert.deepEqual(state['byID'], {});
	})

})


describe('reducers::games::isFetching', () => {

	describe('on FETCH_GAMES_SUCCESS', () => {
		it('should return false', () => {
			const state = reducer({}, fetch_success_action);
			assert.deepEqual(state['isFetching'], false);
		})
	})

	describe('on FETCH_GAMES_FAILURE', () => {
		it('should return false', () => {
			const state = reducer({}, fetch_failure_action);
			assert.deepEqual(state['isFetching'], false);
		})
	})

	describe('on FETCH_GAMES_REQUEST', () => {
		it('should return true', () => {
			const state = reducer({}, fetch_request_action);
			assert.deepEqual(state['isFetching'], true);
		})
	})

	it('should return false as default state', () => {
		const state = reducer({}, {});
		assert.deepEqual(state['isFetching'], false);
	})

})


describe('reducers::games::nextPageURL', () => {

	it('should set next url from payload if present', () => {
		const stateBefore = 'some text';
		const stateAfter = nextPageURL;

		const state = reducer(
			{ nextPageURL: stateBefore },
			fetch_success_action
		);

		assert.deepEqual(state['nextPageURL'], stateAfter);
	})

	it('should reset next page url if not present in payload', () => {
		const stateBefore = 'some text';
		const stateAfter = null;

		const action = deepcopy(fetch_success_action);
		action.meta.nextPageURL = null;

		const state = reducer(
			{ nextPageURL: stateBefore },
			action
		);

		assert.deepEqual(state['nextPageURL'], stateAfter);
	})

	it('should return null as default state', () => {
		const state = reducer({}, {});
		assert.deepEqual(state['nextPageURL'], null);
	})
})
