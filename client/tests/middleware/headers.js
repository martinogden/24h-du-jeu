import assert from 'assert';
import configureMockStore from 'redux-mock-store';
import { CALL_API } from 'redux-api-middleware';

import headers, { getAuthHeader } from 'middleware/headers.js';


const apiMiddlewareStub = store => next => action => {
	if (action[CALL_API])
		return next(action[CALL_API]);

	return next(action);
};


const middlewares = [ headers, apiMiddlewareStub ];
const mockStore = configureMockStore(middlewares);


const testActions = (state, action, expectedActions) => {
	const store = mockStore(state);
	store.dispatch(action);
	const actions = store.getActions();

	assert.deepEqual(actions, expectedActions);
};


describe('middlewares::headers', () => {

	describe('on API requests', () => {

		it('should set content-type header', () => {

			const ACTION_TYPE = 'TEST';
			const action = {
				[CALL_API]: { type: ACTION_TYPE }
			};

			const expectedActions = [
				{
					type: ACTION_TYPE,
					headers: {
						'content-type': 'application/json',
					},
				},
			];

			const state = { auth: {} };

			testActions(state, action, expectedActions);
		})

		it('should set authorization header when token is set', () => {

			const TOKEN = 'TEST';
			const ACTION_TYPE = 'TEST';
			const action = {
				[CALL_API]: { type: ACTION_TYPE }
			};

			const expectedActions = [
				{
					type: ACTION_TYPE,
					headers: {
						'content-type': 'application/json',
						'Authorization': getAuthHeader(TOKEN),
					},
				},
			];

			const state = {
				auth: { token: TOKEN },
			};

			testActions(state, action, expectedActions);
		})

	})

	it('should not set auth header when token is not set', () => {

			const ACTION_TYPE = 'TEST';
			const action = {
				[CALL_API]: { type: ACTION_TYPE }
			};

			const expectedActions = [
				{
					type: ACTION_TYPE,
					headers: {
						'content-type': 'application/json',
					},
				},
			];

			const state = { auth: {} };

			testActions(state, action, expectedActions);
	})

	it('should not set headers when action is not an API action', () => {

			const ACTION_TYPE = 'TEST';
			const action = { type: ACTION_TYPE };

			const expectedActions = [
				{ type: ACTION_TYPE },
			];

			const state = { auth: {} };

			testActions(state, action, expectedActions);
	})
})