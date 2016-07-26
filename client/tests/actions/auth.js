import assert from 'assert';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { ActionTypes } from '../../constants';
import { authWithFacebook, __RewireAPI__ } from '../../actions/auth';


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


describe('actions::auth::authWithFacebook', () => {

	it('should dispatch AUTH_USER_REQUEST when called', () => {
		const expectedActions = [
			{ type: ActionTypes.AUTH_USER_REQUEST },
		];

		const store = mockStore({});
		const action = authWithFacebook();
		store.dispatch(action);

		const actions = store.getActions();
		assert.deepEqual(actions, expectedActions);
	})

	it('should dispatch AUTH_USER_SUCCESS if login is successful', () => {

		__RewireAPI__.__Rewire__('loginUser', () => Promise.resolve());

		const store = mockStore({});
		const action = authWithFacebook();

		const expectedActions = [
			{ type: ActionTypes.AUTH_USER_REQUEST },
			{ type: ActionTypes.AUTH_USER_SUCCESS },
		];

		return store.dispatch(action).then(() => {
			const actions = store.getActions();
			assert.deepEqual(actions, expectedActions);

			__RewireAPI__.__ResetDependency__('loginUser');
		})
	})

	it('should dispatch AUTH_USER_FAILURE if login is unsuccessful', () => {

		__RewireAPI__.__Rewire__('loginUser', () => {
			return Promise.reject({message: ERROR_MSG})
		});

		const ERROR_MSG = "error msg";
		const store = mockStore({});
		const action = authWithFacebook();

		const expectedActions = [
			{ type: ActionTypes.AUTH_USER_REQUEST },
			{
				type: ActionTypes.AUTH_USER_FAILURE,
				error: true,
				payload: new Error(ERROR_MSG),
			},
		];

		return store.dispatch(action).then(() => {
			const actions = store.getActions();
			assert.deepEqual(actions, expectedActions);

			__RewireAPI__.__ResetDependency__('loginUser');
		})
	})
})