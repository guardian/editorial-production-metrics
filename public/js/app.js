import React from 'react';
import {render} from 'react-dom';

import Page from './components/Page';

import '../styles/main.scss';

render(
    <Page>
        <h1>Met-Tricks</h1>
    </Page>,
    document.getElementById('react-mount')
);
