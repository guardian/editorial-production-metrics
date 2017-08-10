import React from 'react';
import { connect } from 'react-redux';
import { Actions } from 'jumpstate';
import Page from 'components/Page';
import Filters from 'components/Filters/Filters';
import Charts from 'components/Charts/Charts';

class App extends React.Component {
    componentDidMount() {
        Actions.filterDesk(this.props.filterVals);
    }

    render() {
        const { filterVals, isUpdating, charts } = this.props;
        return (
            <Page>
                <Filters
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

export default connect(mapStateToProps, null)(App);
