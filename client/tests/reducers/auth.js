import assert from 'assert';

import { ActionTypes } from 'constants';
import auth from 'reducers/auth';


const action = {
	type: ActionTypes.AUTH_USER_SUCCESS,
	payload: { access_token: 'TEST' },
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