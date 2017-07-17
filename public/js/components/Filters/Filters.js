import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';

class Filters extends React.Component {
    constructor(props) {
        super(props);
        this.state = { focusedInput: null };
    }

    render() {
        const { onSelectChange, filterVals, updating } = this.props;
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
                                    Time Range:
                                    <DateRangePicker
                                        hideKeyboardShortcutsPanel
                                        initialVisibleMonth={() => moment().subtract(1, 'months')}
                                        orientation={window.innerWidth > 640 ? 'horizontal' : 'vertical'}
                                        displayFormat='DD/MM/YYYY'
                                        disabled={updating}
                                        startDate={filterVals.startDate}
                                        endDate={filterVals.endDate}
                                        onDatesChange={({ startDate, endDate }) => endDate > startDate ? onSelectChange({ startDate, endDate }) : false }
                                        focusedInput={this.state.focusedInput}
                                        onFocusChange={focusedInput => this.setState({ focusedInput })}
                                        isOutsideRange={(day) => day.isAfter(moment())}
                                    />
                                </label>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </form>
        );
    }
}

export default Filters;
