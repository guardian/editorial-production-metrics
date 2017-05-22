import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';

const Filters = ({onSelectChange, filterVals, updating}) => {
    return (
        <form className="form">
            <Grid fluid>
                <Row>
                    <Col xs={12} md={4}>
                        <div className="form__row">
                            <label>
                                Filter by Office:
                                <select
                                    className="form__field form__field--select"
                                    onChange={event => onSelectChange({
                                        office: event.target.value
                                    })}
                                    value={filterVals.office}
                                    disabled={updating}
                                >
                                    <option value="all">All</option>
                                    <option value="uk">UK</option>
                                    <option value="au">AU</option>
                                    <option value="us">US</option>
                                </select>
                            </label>
                        </div>
                    </Col>

                    <Col xs={12} md={4}>
                        <div className="form__row">
                            <label>
                                Filter by Desk:
                                <select
                                    className="form__field form__field--select"
                                    onChange={event => onSelectChange({
                                        desk: event.target.value
                                    })}
                                    value={filterVals.desk}
                                    disabled={updating}
                                >
                                    <option value="all">All</option>
                                    <option value="news">News</option>
                                    <option value="opinion">Opinion</option>
                                    <option value="sport">Sport</option>
                                </select>
                            </label>
                        </div>
                    </Col>
                    <Col xs={12} md={4}>
                        <div className="form__row">
                            <label>
                                Filter by Section:
                                <select
                                    className="form__field form__field--select"
                                    onChange={event => onSelectChange({
                                        section: event.target.value
                                    })}
                                    value={filterVals.section}
                                    disabled={updating}
                                >
                                    <option value="all">All</option>
                                    <option value="news">News</option>
                                    <option value="opinion">Opinion</option>
                                    <option value="sport">Sport</option>
                                </select>
                            </label>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col xs={12} md={4}>
                        <div className="form__row">
                            <label>
                                Time:
                                <select
                                    className="form__field form__field--select"
                                    onChange={event => onSelectChange({
                                        time: event.target.value
                                    })}
                                    value={filterVals.time}
                                    disabled={updating}
                                >
                                    <option value="7days">Last 7 days</option>
                                    <option value="30days">Last 30 days</option>
                                    <option value="6months">
                                        Last 6 months
                                    </option>
                                </select>
                            </label>
                        </div>
                    </Col>
                </Row>
            </Grid>
        </form>
    );
};

export default Filters;
