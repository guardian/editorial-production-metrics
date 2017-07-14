import React from 'react';

class Page extends React.Component {
    render() {
        return (
            <div>
                <h1>Guardian Tools Metrics</h1>
                {this.props.children}
            </div>
        );
    }
}

export default Page;
