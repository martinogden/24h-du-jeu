import assert from 'assert';
import configureMockStore from 'redux-mock-store';
import { normalize, Schema, arrayOf } from 'normalizr';

import normalizr from 'middleware/normalizr.js';


const middlewares = [normalizr];
const mockStore = configureMockStore(middlewares);


describe('middlewares::normalizr', () => {

	it('should normalize payload if action.meta.schema is set', () => {

		const payload = [ {id: 1}, {id: 2} ];
		const schema = arrayOf(new Schema('test_obj'));

		const action = {
			type: 'TEST',
			meta: { schema },
			payload,
		};

		const expectedActions = [
			{
				...action,
				payload: normalize(payload, schema),
			},
		];

		const store = mockStore({});
		store.dispatch(action);
		const actions = store.getActions();

		assert.deepEqual(actions, expectedActions);
	})

	it('should leave action untouched if action.meta.schema is not set', () => {

		const action_1 = {
			type: 'TEST',
			meta: {},
		};

		const store = mockStore();
		store.dispatch(action_1);

		assert.deepEqual(store.getActions(), [action_1]);

		const action_2 = {
			type: 'TEST',
		};

		store.dispatch(action_2);

		assert.deepEqual(store.getActions(), [ action_1, action_2 ]);
	})
})