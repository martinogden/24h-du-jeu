import assert from 'assert';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';

import { apiMiddleware } from 'redux-api-middleware';

import { ActionTypes, Schemas, API_ENDPOINT_URL } from 'constants';
import { fetchGames } from 'actions/games';


const middlewares = [ apiMiddleware ];
const mockStore = configureMockStore(middlewares);


describe('actions::games::fetchGames', () => {

	describe('on FETCH_GAMES_SUCCESS', () => {
		it('should populate action.meta', () => {

			const payload = [ {id: 1}, {id: 2} ];

			nock(API_ENDPOINT_URL).get('/games').reply(200, payload);


			const expectedActions = [
				{ 
					type: ActionTypes.FETCH_GAMES_REQUEST,
					payload: undefined,
					meta: undefined,
				},
				{
					type: ActionTypes.FETCH_GAMES_SUCCESS,
					meta: { schema: Schemas.GAMES },
					payload,
				},
			];

			const store = mockStore({ games: {} });
			const action = fetchGames();

			return store.dispatch(action).then(() => {
				const actions = store.getActions();
				assert.deepEqual(actions, expectedActions);
			});
		})
	})

})