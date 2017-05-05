import React from 'react';
import {Grid} from 'react-flexbox-grid';

class Page extends React.Component {
    render() {
        return (
            <Grid fluid>
                <h1>Met-Tricks</h1>
                {this.props.children}
            </Grid>
        );
    }
}

export default Page;
