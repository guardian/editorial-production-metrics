import { createStore, compose, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import { updateUrlFromStateChangeMiddleware, updateStateFromUrlChangeMiddleware } from 'services/routingMiddleware';

// creates the store
export default (rootReducer) => {
    /* ------------- Redux Configuration ------------- */
    const middleware = [];
    const enhancers = [];

    /* ------------- fate Middleware ------------- */

    middleware.push(thunkMiddleware);

    /* ------------- Logger Middleware ------------- */

    // TODO: configure logger to only run in dev mode

    middleware.push(logger);

    /* ------------- Router Middleware ------------- */
    const history = createHistory();
    const router = routerMiddleware(history);
    middleware.push(router);
    middleware.push(updateUrlFromStateChangeMiddleware);
    middleware.push(updateStateFromUrlChangeMiddleware);
    
    /* ------------- Assemble Middleware ------------- */
    enhancers.push(applyMiddleware(...middleware));
    const store = createStore(
        rootReducer,
        compose(...enhancers, window.devToolsExtension ? window.devToolsExtension() : f => f)
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers').default;
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
};