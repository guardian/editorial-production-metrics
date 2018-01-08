import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import history from './utils/history';
import { ConnectedRouter } from 'react-router-redux';
import App from './containers/App';
import setupStore from './redux/index';

import '../styles/main.scss';

const store = setupStore();

render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('react-mount')
);
