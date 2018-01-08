import React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

const TabLink = ({ children, to, location }) => console.log(location) || (
    <NavLink
        exact
        className="tabs__link"
        activeClassName="tabs__link--selected"
        to={{ pathname: to, search: location.search }}
    >
        {children}
    </NavLink>
);

const mapStateToProps = ({ routing: { location } }) => ({
    location
});

export default connect(mapStateToProps)(TabLink);
