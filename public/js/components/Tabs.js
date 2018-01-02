import React, { Component, Children } from 'react';

export default class Tabs extends Component {
    state = {selectedIndex: 0};

    onChange(event, index) {
        event.preventDefault();
        console.log(index);
        this.setState({selectedIndex: index});
    }

    render() {
        const selectedTab = Children.toArray(this.props.children)[this.state.selectedIndex];
        return (
            <div>
                {this.props.labels.map((label, index) => <button key={label} onClick={event => this.onChange(event, index)}>{label}</button>)}
                {selectedTab}
            </div>
        );
    }
}

Tabs.defaultProps = {labels: []};