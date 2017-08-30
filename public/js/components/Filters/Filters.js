import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';
import  { Actions } from 'jumpstate';

// Remove the 'tracking/commissioningdesk/' bit from the desk identifier string, replace dashes with spaces and capitalize each word
const formatDeskName = deskName => deskName.substr(27).replace(/-/g, ' ').replace(/\b\w/g, x => x.toUpperCase());
const renderDesks = (desks) => desks.sort().map((desk, key) => <option value={desk} key={`desk-filter-key-${key}`}>{formatDeskName(desk)}</option>);

export default class Filters extends Component {
    state = { focusedInput: null };

    render() {
        const { filterVals, isUpdating, desks } = this.props;
        return (
            <form className="form">
                <Grid fluid>
                    <Row>
                        <Col xs={9} md={4}>
                            <div className="form__row">
                                <label>
                                    Filter by Desk:
                                    <select
                                        className="form__field form__field--select"
                                        onChange={event => Actions.filterDesk({ ...filterVals, desk: event.target.value })}
                                        value={filterVals.desk}
                                        disabled={isUpdating}
                                    >
                                        {renderDesks(desks)}
                                    </select>
                                </label>
                            </div>
                        </Col>
                        <Col xs={9} md={4}>
                            <div className="form__row">
                                <label>
                                    Time Range:
                                    <DateRangePicker
                                        hideKeyboardShortcutsPanel
                                        initialVisibleMonth={() => moment().subtract(1, 'months')}
                                        orientation={window.innerWidth > 640 ? 'horizontal' : 'vertical'}
                                        displayFormat='DD/MM/YYYY'
                                        disabled={isUpdating}
                                        startDate={filterVals.startDate}
                                        endDate={filterVals.endDate}
                                        onDatesChange={({ startDate, endDate }) => endDate > startDate ? Actions.filterDesk({ ...filterVals, startDate: startDate.utc().startOf('day'), endDate: endDate.utc().startOf('day') }) : false }
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