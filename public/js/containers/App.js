import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from 'actions';

import Page from 'components/Page';
import Filters from 'components/Filters/Filters';
import Charts from 'components/Charts/Charts';

class App extends React.Component {
    render() {
        return (
            <Page>
                <Filters onSelectChange={this.props.actions.filterDesk} />
                <Charts
                    startedInComposer={this.props.startedInComposer}
                    neverInWorkflow={this.props.neverInWorkflow}
                />
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {
        startedInComposer: state.startedInComposer,
        neverInWorkflow: state.neverInWorkflow
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
