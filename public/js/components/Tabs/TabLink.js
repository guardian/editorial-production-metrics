import React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

<<<<<<< HEAD
const TabLink = ({ children, to, location }) => (
=======
const TabLink = ({ children, to, location }) => console.log(location) || (
>>>>>>> Add in routing
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
