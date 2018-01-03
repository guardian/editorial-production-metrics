import React, { Component, Children } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';

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
                <Row between="xs">
                {this.props.labels.map((label, index) => 
                    <Col xs key={label}>
                        <button key={label} onClick={event => this.onChange(event, index)}>{label}</button>
                    </Col>
                )}
                </Row>
                {selectedTab}
            </Grid>
        );
    }
}

Tabs.defaultProps = {labels: []};
