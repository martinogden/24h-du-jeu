import assert from 'assert';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { ActionTypes } from '../../constants';
import { fetchNextGames, __RewireAPI__ } from '../../actions/games';


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


const action = {
	type: ActionTypes.AUTH_USER_SUCCESS
};


describe('actions::games::fetchNextGames', () => {

	it('should dispatch FETCH_GAMES_REQUEST when called', () => {
		const expectedActions = [
			{ type: ActionTypes.FETCH_GAMES_REQUEST },
		];

		const store = mockStore({ games: {} });
		const action = fetchNextGames();
		store.dispatch(action);

		const actions = store.getActions();
		assert.deepEqual(actions, expectedActions);
	})

	it('should dispatch FETCH_GAMES_SUCCESS', () => {

		__RewireAPI__.__Rewire__('fetchGames', () => {
			// n.b. fetchGames returns a function
			return (nextPageURL) => Promise.resolve();
		});

		const store = mockStore({ games: {} });
		const action = fetchNextGames();

		const expectedActions = [
			{ type: ActionTypes.FETCH_GAMES_REQUEST },
			{ type: ActionTypes.FETCH_GAMES_SUCCESS },
		];

		return store.dispatch(action).then(() => {
			const actions = store.getActions();
			assert.deepEqual(actions, expectedActions);

			__RewireAPI__.__ResetDependency__('fetchGames');
		})
	})
})