import React, { Component, Children } from 'react';
import { Grid } from 'react-flexbox-grid';

export default class Tabs extends Component {
    state = {selectedIndex: 0};

    onChange(event, index) {
        event.preventDefault();
        this.setState({selectedIndex: index});
    }

    render() {
        const selectedTab = Children.toArray(this.props.children)[this.state.selectedIndex];
        return (
            <Grid fluid>
                {this.props.labels.map((label, index) => <button key={label} onClick={event => this.onChange(event, index)}>{label}</button>)}
                {selectedTab}
            </Grid>
        );
    }
}

Tabs.defaultProps = {labels: []};