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

	// special case to catch api errors
	if (action.payload.status === 400 && action.payload.response.__errors__)
		return next({
			...action,
			payload: action.payload.response.__errors__,
		});

	next({
		...action,
		payload: normalize(action.payload, action.meta.schema),
	});
}