import React from 'react';
import {connect} from 'react-redux';

import Page from 'components/Page';
import Charts from 'components/Charts/Charts';

class App extends React.Component {
    render() {
        return (
            <Page>
                <Charts
                    startedInComposer={this.props.startedInComposer}
                    neverInWorkflow={this.props.neverInWorkflow}
                />
            </Page>
        );
    }
}

function mapStateToProps(state) {
    console.log(state);
    return {
        startedInComposer: state.startedInComposer,
        neverInWorkflow: state.neverInWorkflow
    };
}

export default connect(mapStateToProps)(App);
