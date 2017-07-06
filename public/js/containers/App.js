import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from 'actions';

import Page from 'components/Page';
import Filters from 'components/Filters/Filters';
import Charts from 'components/Charts/Charts';

class App extends React.Component {
    componentDidMount() {
        this.props.actions.filterDesk();
    }

    render() {
        const { filterVals, updating, charts, actions } = this.props;
        return (
            <Page>
                <Filters
                    onSelectChange={actions.filterDesk}
                    filterVals={filterVals}
                    updating={updating}
                />
                <Charts
                    charts={charts}
                    time={filterVals.time}
                    updating={updating}
                />
            </Page>
        );
    }
}

function mapStateToProps(state) {
    const { filterVals, charts, updatingBool } = state;
    return {
        filterVals: filterVals,
        charts: charts,
        updating: updatingBool
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
