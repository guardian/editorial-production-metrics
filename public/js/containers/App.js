import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from 'actions';
import Page from 'components/Page';
import Filters from 'components/Filters/Filters';
import Charts from 'components/Charts/Charts';
import { getFilters } from "../selectors";
import Tabs from 'components/Tabs/Tabs';
import Origin from 'components/Tabs/Origin';
import CommissionedLength from '../components/Tabs/CommissionedLength';

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
                <Tabs labels={["Origin","Fork Time","Commissioned Length"]}>
                    <Origin
                        filterVals={filterVals}
                        isUpdating={isUpdating}
                        charts={charts}
                        toggleStackChart={actions.toggleStackChart}
                    />
                    <div>Fork Time</div>
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
    
    return {
        filterVals: getFilters(state),
        charts,
        isUpdating,
        commissioningDesks,
        newspaperBooks
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
