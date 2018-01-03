import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';
import { tagToName } from 'helpers/chartsHelpers';

const renderName = desks =>
  desks.sort().map((desk, key) => (
    <option value={desk} key={`desk-filter-key-${key}`}>
      {tagToName(desk)}
    </option>
  ));

export default class Filters extends Component {
    state = { focusedInput: null };

    render() {
        const { filterVals, isUpdating, desks, newspaperBooks, runFilter } = this.props;
        return (
            <form className="form">
                <Grid fluid>
                    <Row>
                        <Col xs={12} md={3}>
                            <div className="form__row">
                                <label>
                                    <div>Filter by Desk:</div>
                                    <select
                                        className="form__field form__field--select"
                                        onChange={event => runFilter({ desk: event.target.value })}
                                        value={filterVals.desk}
                                        disabled={isUpdating}
                                    >
                                        {renderName(desks)}
                                    </select>
                                </label>
                            </div>
                        </Col>
                        <Col xs={12} md={3}>
                            <div className="form__row">
                                <label>
                                    <div>Filter by Newspaper book:</div>
                                    <select
                                        className="form__field form__field--select"
                                        onChange={event => runFilter({ newspaperBook: event.target.value })}
                                        value={filterVals.newspaperBook}
                                        disabled={isUpdating}
                                    >
                                        {renderName(newspaperBooks)}
                                    </select>
                                </label>
                            </div>
                        </Col>
                        <Col xs={12} md={3}>
                            <div className="form__row">
                                <label>
                                    <div>Filter by Office:</div>
                                    <select
                                        className="form__field form__field--select"
                                        onChange={event => runFilter({ productionOffice: event.target.value })}
                                        value={filterVals.productionOffice}
                                        disabled={isUpdating}
                                    >   
                                        <option value='all'>All</option>
                                        <option value='uk'>UK</option>
                                        <option value='us'>US</option>
                                        <option value='aus'>Australia</option>
                                    </select>
                                </label>
                            </div>
                        </Col>
                        <Col xs={12} md={3}>
                            <div className="form__row">
                                <label>
                                    <div>Time Range:</div>
                                    <div className='date-picker-container'>
                                        <DateRangePicker
                                            hideKeyboardShortcutsPanel
                                            initialVisibleMonth={() => moment().subtract(1, 'months')}
                                            orientation={window.innerWidth > 640 ? 'horizontal' : 'vertical'}
                                            displayFormat='DD/MM/YYYY'
                                            disabled={isUpdating}
                                            startDate={filterVals.startDate}
                                            endDate={filterVals.endDate}
                                            onDatesChange={({ startDate, endDate }) => endDate > startDate ? runFilter({ ...filterVals, startDate: startDate.utc().startOf('day'), endDate: endDate.utc().endOf('day') }) : false }
                                            focusedInput={this.state.focusedInput}
                                            onFocusChange={focusedInput => this.setState({ focusedInput })}
                                            isOutsideRange={(day) => day.isAfter(moment())}
                                        />
                                    </div>
                                </label>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </form>
        );
    }
}