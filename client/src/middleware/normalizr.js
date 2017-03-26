import { normalize } from 'normalizr';
import { Schemas } from '../constants';


const ERROR_MSG = 'If action.meta.schema is set, you must provide action.payload.';

/**
 * Filter actions that have meta.schema set and
 * normalize payload using the provided meta.schema
 */
export default store => next => action => {

	if (!action.meta || !action.meta.schema)
		return next(action);

	if (!action.payload)
		return next({
			...action,
			error: true,
			payload: new Error(ERROR_MSG),
		});

	next({
		...action,
		payload: normalize(action.payload, action.meta.schema),
	});
}