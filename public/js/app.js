import React from 'react';
import {render} from 'react-dom';

import Page from './components/Page';
import Charts from './components/Charts/Charts';

import '../styles/main.scss';

render(
    <Page>
        <Charts />
    </Page>,
    document.getElementById('react-mount')
);
