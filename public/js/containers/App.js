import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from 'actions';

import Page from 'components/Page';
import Filters from 'components/Filters/Filters';
import Charts from 'components/Charts/Charts';

class App extends React.Component {
    componentDidMount() {
        this.props.actions.filterDesk();
    }

    render() {
        return (
            <Page>
                <Filters
                    onSelectChange={this.props.actions.filterDesk}
                    filterVals={this.props.filterVals}
                    updating={this.props.updating}
                />
                <Charts
                    charts={this.props.charts}
                    time={this.props.filterVals.time}
                    updating={this.props.updating}
                />
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {
        filterVals: state.filterVals,
        charts: state.charts,
        updating: state.updatingBool
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
