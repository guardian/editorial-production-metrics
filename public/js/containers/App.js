import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import actions from "actions";
import Page from "components/Page";
import Filters from "components/Filters/Filters";
import { getFilters } from "../selectors";
import Origin from "components/Tabs/Origin";
import CommissionedLengthData from "./CommissionedLengthData";
import ForkTime from "../components/Tabs/ForkTime";
import {
    TabLink,
    TabRoute,
    TabsPanel,
    TabsNav,
    TabsContainer
} from "../components/Tabs";
import { Route } from "react-router-dom";
import { Redirect } from "react-router-dom";

class App extends Component {
    componentDidMount() {
        this.props.actions.fetchCommissioningDesks();
        this.props.actions.fetchNewspaperBooks();
    }

    render() {
        const {
            filterVals,
            filterStatuses,
            isUpdating,
            charts,
            commissioningDesks,
            newspaperBooks,
            actions
        } = this.props;
        return (
            <Page>
                <div className="top-section">
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
                <TabsContainer>
                    <TabsNav>
                        <TabLink to="/origin">Origin</TabLink>
                        <TabLink to="/fork-time">Fork Time</TabLink>
                        <TabLink to="/commissioned-length">
                            Commissioned Length
                        </TabLink>
                    </TabsNav>
                    <TabsPanel>
                        <Route exact path="/" render={() => <Redirect to="/origin"/>}/>
                        <TabRoute
                            path="/origin"
                            disabledFilters={[ "newspaperBook" ]}
                        >
                            <Origin
                                filterVals={filterVals}
                                isUpdating={isUpdating}
                                charts={charts}
                                toggleStackChart={actions.toggleStackChart}
                            />
                        </TabRoute>
                        <TabRoute
                            path="/fork-time"
                            disabledFilters={[ "desk", "productionOffice" ]}
                        >
                            <ForkTime
                                filterVals={filterVals}
                                isUpdating={isUpdating}
                                charts={charts}
                            />
                        </TabRoute>
                        <TabRoute path="/commissioned-length">
                            <CommissionedLengthData />
                        </TabRoute>
                    </TabsPanel>
                </TabsContainer>
            </Page>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

const mapStateToProps = state => {
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
