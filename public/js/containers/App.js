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
        const { filterVals, isUpdating, charts, actions } = this.props;
        return (
            <Page>
                <Filters
                    onSelectChange={actions.filterDesk}
                    filterVals={filterVals}
                    isUpdating={isUpdating}
                />
                <Charts
                    charts={charts}
                    startDate={filterVals.startDate}
                    endDate={filterVals.endDate}
                    isUpdating={isUpdating}
                />
            </Page>
        );
    }
}

function mapStateToProps(state) {
    const { filterVals, charts, isUpdating } = state;
    return {
        filterVals,
        charts,
        isUpdating
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
