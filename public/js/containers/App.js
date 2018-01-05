import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from 'actions';
import Page from 'components/Page';
import Filters from 'components/Filters/Filters';
import { getFilters } from "../selectors";
import Tabs from 'components/Tabs/Tabs';
import Origin from 'components/Tabs/Origin';
import CommissionedLength from '../components/Tabs/CommissionedLength';
import ForkTime from '../components/Tabs/ForkTime';

// Tabs will be enabled by the reducer each time unless specified
const tabFilters = [
    {
        newspaperBook: "disabled",
    }, {
        desk: "disabled",
        productionOffice: "disabled"
    }, {

    }
];

class App extends Component {
    componentDidMount() {
        this.props.actions.fetchCommissioningDesks();
        this.props.actions.fetchNewspaperBooks();
    }

    render() {
        const { filterVals, filterStatuses, isUpdating, charts, commissioningDesks, newspaperBooks, actions } = this.props;
        return (
            <Page>
                <div className='top-section'>
                    <h1>Guardian Tools Metrics</h1>
                </div>
                <Filters
                    filterVals={filterVals}
                    filterStatuses={filterStatuses}
                    isUpdating={isUpdating}
                    desks={commissioningDesks.desksList}
                    newspaperBooks={newspaperBooks.booksList}
                    runFilter={actions.runFilter}
                />
                <Tabs
                    labels={["Origin","Fork Time","Commissioned Length"]}
                    onChange={i => actions.updateFilterStatuses(tabFilters[i])}
                >
                    <Origin
                        filterVals={filterVals}
                        isUpdating={isUpdating}
                        charts={charts}
                        toggleStackChart={actions.toggleStackChart}
                    />
                    <ForkTime
                        filterVals={filterVals}
                        isUpdating={isUpdating}
                        charts={charts}
                    />
                    <CommissionedLength />
                </Tabs>
            </Page>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

const mapStateToProps = (state) => {
    const { charts, isUpdating, commissioningDesks, newspaperBooks } = state;

    const filters = getFilters(state);
    
    return {
        filterVals: filters.values,
        filterStatuses: filters.statuses,
        charts,
        isUpdating,
        commissioningDesks,
        newspaperBooks
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
