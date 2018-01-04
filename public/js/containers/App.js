import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from 'actions';
import Page from 'components/Page';
import Filters from 'components/Filters/Filters';
import Charts from 'components/Charts/Charts';
import { getFilters } from "../selectors";

class App extends Component {
    componentDidMount() {
        this.props.actions.fetchCommissioningDesks();
        this.props.actions.fetchNewspaperBooks();
    }

    render() {
        const { filterVals, isUpdating, charts, commissioningDesks, newspaperBooks, actions } = this.props;
        return (
            <Page>
                <div className='top-section'>
                    <h1>Guardian Tools Metrics</h1>
                </div>
                <Filters
                    filterVals={filterVals}
                    isUpdating={isUpdating}
                    desks={commissioningDesks.desksList}
                    newspaperBooks={newspaperBooks.booksList}
                    runFilter={actions.runFilter}
                />
                <Charts
                    charts={charts}
                    filterVals={filterVals}
                    toggleStackChart={actions.toggleStackChart}
                    isUpdating={isUpdating}
                />
            </Page>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actions, dispatch)
});

const mapStateToProps = (state) => {
    const { charts, isUpdating, commissioningDesks, newspaperBooks } = state;
    
    return {
        filterVals: getFilters(state),
        charts,
        isUpdating,
        commissioningDesks,
        newspaperBooks
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
