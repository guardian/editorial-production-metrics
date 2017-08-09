import { createStore, compose, applyMiddleware } from 'redux';
import { CreateJumpstateMiddleware } from 'jumpstate';
import logger from 'redux-logger';

// creates the store
export default (rootReducer) => {
    /* ------------- Redux Configuration ------------- */
    const middleware = [];
    const enhancers = [];

    /* ------------- Jumpstate Middleware ------------- */

    middleware.push(CreateJumpstateMiddleware());

    /* ------------- Logger Middleware ------------- */

    // TODO: configure logger to only run in dev mode

    middleware.push(logger);

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