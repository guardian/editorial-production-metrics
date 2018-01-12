import React from "react";
import Table from "./Table";
import cx from "classnames";
import TablePagination from "./TablePagination";

class PaginatedTable extends React.Component {
    state = {
        pageIndex: 0
    };

    get rowCount() {
        return React.Children.count(this.props.children);
    }

    get pageCount() {
        return Math.ceil(this.rowCount / this.props.pageSize);
    }

    get prevDisabled() {
        return this.state.pageIndex < 1;
    }

    get nextDisabled() {
        return this.state.pageIndex > this.pageCount - 2;
    }

    get visiblePageIndices() {
        const { pagesAround } = this.props;
        const min = Math.max(this.state.pageIndex - pagesAround, 0);
        const max = Math.min(
            this.state.pageIndex + pagesAround,
            this.pageCount - 1
        );

        const pageIndices = [];

        for (let i = min; i <= max; i += 1) {
            pageIndices.push(i);
        }

        return pageIndices;
    }

    onNext = () => {
        this.setState({
            pageIndex: Math.min(this.state.pageIndex + 1, this.pageCount - 1)
        });
    };

    onPrev = () => {
        this.setState({
            pageIndex: Math.max(this.state.pageIndex - 1, 0)
        });
    };

    goToPage = pageIndex => {
        this.setState({
            pageIndex
        });
    };

    renderPagination() {
        return (
            <TablePagination
                onPrev={this.onPrev}
                onNext={this.onNext}
                onPage={this.goToPage}
                prevDisabled={this.prevDisabled}
                nextDisabled={this.nextDisabled}
                pageIndex={this.state.pageIndex}
                visiblePageIndices={this.visiblePageIndices}
                pageCount={this.pageCount}
            />
        );
    }

    render() {
        const { pageIndex } = this.state;
        const { children, pageSize, ...rest } = this.props;

        const startIndex = pageIndex * pageSize;
        const endIndex = (pageIndex + 1) * pageSize;

        return (
            <div>
                {this.renderPagination()}
                <Table {...rest}>
                    {React.Children.toArray(children).slice(
                        startIndex,
                        endIndex
                    )}
                </Table>
                {this.renderPagination()}
            </div>
        );
    }
}

PaginatedTable.defaultProps = {
    pageSize: 10,
    pagesAround: 3
};

export default PaginatedTable;
