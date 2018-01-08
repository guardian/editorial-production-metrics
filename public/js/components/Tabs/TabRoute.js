import React from "react";
import { Route } from "react-router";
import { connect } from "react-redux";
import { updateFilterStatuses } from "../../actions";

class _Handler extends React.Component {
    componentDidMount() {
        const { dispatch, disabledFilters } = this.props;

        const filterStatuses = disabledFilters.reduce((out, filter) => ({
            ...out,
            [filter]: "disabled",
        }), {})

        dispatch(updateFilterStatuses(filterStatuses));
    }

    render() {
        return this.props.children;
    }
}

const Handler = connect()(_Handler);

const TabRoute = ({ path, children, disabledFilters = [] }) => (
    <Route
        exact
        path={path}
        render={() => (
            <Handler disabledFilters={disabledFilters}>{children}</Handler>
        )}
    />
);

export default TabRoute;
