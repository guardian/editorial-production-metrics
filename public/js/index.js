import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

import App from './containers/App';
import configureStore from './util/configureStore';

import '../styles/main.scss';

const store = configureStore();

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('react-mount')
);
