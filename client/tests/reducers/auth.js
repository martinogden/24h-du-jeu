import assert from 'assert';

import { ActionTypes } from 'constants';
import auth from 'reducers/auth';


const ACCESS_TOKEN = 'TEST';
const action = {
	type: ActionTypes.AUTH_USER_SUCCESS,
	payload: { access_token: ACCESS_TOKEN },
};


describe('reducers::auth::isLoggedIn', () => {

	describe('on AUTH_USER_SUCCESS', () => {
		it('should return true', () => {
			const state = auth({}, action);
			assert.deepEqual(state['isLoggedIn'], true);
		})
	})

	it('should return false as default state', () => {
		const state = auth({}, {});
		assert.deepEqual(state['isLoggedIn'], false);
	})

})


describe('reducers::auth::token', () => {

	describe('on AUTH_USER_SUCCESS', () => {
		it('should return provided access_token', () => {
			const state = auth({}, action);
			assert.deepEqual(state['token'], ACCESS_TOKEN);
		})
	})

	it('should return null as default state', () => {
		const state = auth({}, {});
		assert.deepEqual(state['token'], null);
	})

})