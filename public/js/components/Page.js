import React, { Component } from 'react';

export default class Page extends Component {
    render() {
        return (
            <div>
                <h1>Guardian Tools Metrics</h1>
                {this.props.children}
            </div>
        );
    }
}