import React, { Component, Children } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import cx from "classnames";

export default class Tabs extends Component {
    state = {selectedIndex: 0};

    componentDidMount() {
        // fire the initial tab index to the listener
        this.props.onChange(this.state.selectedIndex);
    }

    onChange(event, index) {
        event.preventDefault();
        this.setState({selectedIndex: index}, this.props.onChange(index));
    }

    render() {
        const selectedTab = Children.toArray(this.props.children)[this.state.selectedIndex];

        return (
            <Grid fluid>
                <Row between="xs">
                    {this.props.labels.map((label, index) => 
                        <Col xs key={label}>
                            <button
                                className={cx({
                                    "tabs__button": true,
                                    "tabs__button--selected": this.state.selectedIndex === index,
                                })}
                                key={label}
                                onClick={event => this.onChange(event, index)}
                            >
                                {label}
                            </button>
                        </Col>
                    )}
                </Row>
                <Row between="xs">
                    <Col xs>
                        <div className="tabs__tab">
                            <Grid fluid>
                                <Row between="xs">
                                    <Col xs>
                                        {selectedTab}
                                    </Col>
                                </Row>
                            </Grid>
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

Tabs.defaultProps = {
    labels: [],
    onChange: () => {}
};
