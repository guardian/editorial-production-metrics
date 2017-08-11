import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'jumpstate';
import Page from 'components/Page';
import Filters from 'components/Filters/Filters';
import Charts from 'components/Charts/Charts';

class App extends Component {
    componentDidMount() {
        Actions.fetchCommissioningDesksRedux();
        Actions.filterDesk(this.props.filterVals);
    }

    render() {
        const { filterVals, isUpdating, charts, commissioningDesks } = this.props;
        return (
            <Page>
                <Filters
                    filterVals={filterVals}
                    isUpdating={isUpdating}
                    desks={commissioningDesks.desksList}
                />
                <Charts
                    composerVsInCopy={charts.composerVsInCopy}
                    startDate={filterVals.startDate}
                    endDate={filterVals.endDate}
                    isUpdating={isUpdating}
                />
            </Page>
        );
    }
}

function mapStateToProps(state) {
    const { filterVals, charts, isUpdating, commissioningDesks } = state;
    return {
        filterVals,
        charts,
        isUpdating,
        commissioningDesks
    };
}

export default connect(mapStateToProps, null)(App);
