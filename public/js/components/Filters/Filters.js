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
    state = {
      focusedInput: null,
      startDate: this.props.filterVals.startDate,
      endDate: this.props.filterVals.endDate
    };

    render() {
        const { filterVals, filterStatuses, isUpdating, desks, newspaperBooks, runFilter } = this.props;
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
                                disabled={isUpdating || filterStatuses.desk === "disabled"}
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
                                disabled={isUpdating || filterStatuses.productionOffice === "disabled"}
                            />
                        </Col>
                        <Col xs={12} md={4}>
                            <SelectFilter
                                label="Filter by Newspaper:"
                                options={tagsToOptions(newspaperBooks)}
                                onChange={({ target }) => runFilter({ newspaperBook: target.value })}
                                value={filterVals.newspaperBook}
                                disabled={isUpdating || filterStatuses.newspaperBook === "disabled"}
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
                                            minimumNights={0}
                                            disabled={isUpdating || filterStatuses.startDate === "disabled" && filterStatuses.endDate === "disabled"}
                                            startDate={this.state.startDate}
                                            endDate={this.state.endDate}
                                            onDatesChange={ ({ startDate, endDate }) => {
                                                this.setState({ startDate, endDate });
                                                if (startDate && endDate) {
                                                    runFilter({
                                                        startDate: startDate.utc().startOf('day').format(),
                                                        endDate: endDate.utc().endOf('day').format()
                                                    });
                                                }
                                            }}
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
