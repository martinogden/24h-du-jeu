import { createStore, applyMiddleware } from 'redux';

import RootReducer from './reducers';


const configureStore = () => {
  const middlewares = [];

  return createStore(
    RootReducer,
    applyMiddleware(...middlewares)
  );
};

export default configureStore;