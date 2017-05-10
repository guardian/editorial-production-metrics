import React from 'react';

class Filter extends React.Component {
    onSelectChange(deskName) {
        this.props.onSelectChange(deskName);
    }

    render() {
        return (
            <form>
                <label>
                    Filter by Desk:
                    <select
                        onChange={event =>
                            this.onSelectChange(event.target.value)}
                    >
                        <option value="news">News</option>
                        <option value="opinion">Opinion</option>
                        <option value="sport">Sport</option>
                    </select>
                </label>
            </form>
        );
    }
}

export default Filter;
