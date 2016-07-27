import assert from 'assert';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';

import thunk from 'redux-thunk';
import { apiMiddleware } from 'redux-api-middleware';

import { ActionTypes, Schemas, API_ENDPOINT_URL } from 'constants';
import { fetchNextGames } from 'actions/games';


const middlewares = [ thunk, apiMiddleware ];
const mockStore = configureMockStore(middlewares);


describe('actions::games::fetchNextGames', () => {

	describe('on FETCH_GAMES_SUCCESS', () => {
		it('should populate action.meta', () => {

			const nextPageURL = 'https://example.com';
			const headers = { Link: `<${nextPageURL}>; rel="next"` };
			const payload = [ {id: 1}, {id: 2} ];

			nock(API_ENDPOINT_URL).get('/games').reply(200, payload, headers);


			const expectedActions = [
				{ 
					type: ActionTypes.FETCH_GAMES_REQUEST,
					payload: undefined,
					meta: undefined,
				},
				{
					type: ActionTypes.FETCH_GAMES_SUCCESS,
					meta: {
						schema: Schemas.GAMES,
						nextPageURL,
					},
					payload,
				},
			];

			const store = mockStore({ games: {} });
			const action = fetchNextGames();

			return store.dispatch(action).then(() => {
				const actions = store.getActions();
				assert.deepEqual(actions, expectedActions);
			});
		})
	})

})