export const apiActionCoordinator = (dispatch, apiMethod, actionTypes) => {
	const [ request, success, failure ] = actionTypes;

	dispatch({ type: request });

	const successHandler = (response) => dispatch({
		type: success,
		...response
	});

	const errorHandler = (error) => dispatch({
		type: failure,
		error: true,
		payload: new Error(error.message || "Something went wrong.")
	});

	return apiMethod().then(successHandler, errorHandler);
}
