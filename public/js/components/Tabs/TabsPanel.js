import React from "react";
import { Row, Col, Grid } from "react-flexbox-grid";

const TabsPanel = ({ children }) => (
    <Row between="xs">
        <Col xs>
            <div className="tabs__tab">
                <Grid fluid>
                    <Row between="xs">
                        <Col xs>{children}</Col>
                    </Row>
                </Grid>
            </div>
        </Col>
    </Row>
);

export default TabsPanel
