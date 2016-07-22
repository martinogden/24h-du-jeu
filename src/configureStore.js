import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import RootReducer from './reducers';


const configureStore = () => {
	const loggerMiddleware = createLogger();
  const middlewares = [thunkMiddleware, loggerMiddleware];

  return createStore(
    RootReducer,
    applyMiddleware(...middlewares)
  );
};

export default configureStore;