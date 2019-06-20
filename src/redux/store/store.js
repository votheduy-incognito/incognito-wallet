/* eslint-disable import/no-extraneous-dependencies */
import rootReducer from '@src/redux/reducers';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

export default function configureStore(preloadedState) {
  const middlewares = [thunkMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  const composedEnhancers = composeWithDevTools(...enhancers);

  const store = createStore(rootReducer, preloadedState, composedEnhancers);

  if (__DEV__ && module.hot) {
    module.hot.accept('@src/redux/reducers', () =>
      store.replaceReducer(rootReducer)
    );
  }

  return store;
}
