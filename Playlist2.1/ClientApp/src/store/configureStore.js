import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import * as Tracks from './Tracks';
import * as Playlists from './Playlists';
import * as Search from './Search';
import * as Player from './Player';
import * as Modal from './Modal';
import * as Auth from './Auth';

export default function configureStore(history, initialState) {
  const reducers = {
    tracks: Tracks.reducer,
    playlists: Playlists.reducer,
    search: Search.reducer,
    player: Player.reducer,
    modal: Modal.reducer,
    auth: Auth.reducer
  };

  const middleware = [
    thunk,
    routerMiddleware(history)
  ];

  // In development, use the browser's Redux dev tools extension if installed
  const enhancers = [];
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment && typeof window !== 'undefined' && window.devToolsExtension) {
    enhancers.push(window.devToolsExtension());
  }

  const rootReducer = combineReducers({
    ...reducers,
    routing: routerReducer
  });

  return createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );
}
