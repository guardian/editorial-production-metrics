import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';
import { tagToName } from 'helpers/chartsHelpers';
import SelectFilter from "./SelectFilter";

const tagsToOptions = tags =>
  tags.sort().reduce(
    (options, tag) => ({
      ...options,
      [tag]: tagToName(tag)
    }),
    {}
  );

export default class Filters extends Component {
    state = { focusedInput: null };

    render() {
        const { filterVals, isUpdating, desks, newspaperBooks, runFilter } = this.props;
        return (
            <form className="form">
                <Grid fluid>
                    <Row>
                        <Col xs={12} md={2}>
                            <SelectFilter
                                label="Filter by Desk:"
                                options={tagsToOptions(desks)}
                                onChange={({ target }) => runFilter({ desk: target.value })}
                                value={filterVals.desk}
                                disabled={isUpdating}
                            />
                        </Col>
                        <Col xs={12} md={2}>
                            <SelectFilter
                                label="Filter by Office:"
                                options={{
                                    all: "All",
                                    uk: "UK",
                                    us: "US",
                                    aus: "Australia"
                                }}
                                onChange={({ target }) => runFilter({ productionOffice: target.value })}
                                value={filterVals.productionOffice}
                                disabled={isUpdating}
                            />
                        </Col>
                        <Col xs={12} md={4}>
                            <SelectFilter
                                label="Filter by Newspaper:"
                                options={tagsToOptions(newspaperBooks)}
                                onChange={({ target }) => runFilter({ newspaperBook: target.value })}
                                value={filterVals.newspaperBook}
                                disabled={isUpdating}
                            />
                        </Col>
                        <Col xs={12} md={4}>
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
                                            onDatesChange={
                                                ({ startDate, endDate }) =>
                                                    endDate > startDate ?
                                                        runFilter({
                                                            startDate: startDate.utc().startOf('day').format(),
                                                            endDate: endDate.utc().endOf('day').format()
                                                        }) :
                                                        false
                                            }
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