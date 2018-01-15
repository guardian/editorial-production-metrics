import React from "react";
import { Row, Col } from "react-flexbox-grid";

const TabsPanel = ({ children }) => (
    <Row between="xs">
        {React.Children.map(children, child => <Col xs>{child}</Col>)}
    </Row>
);

export default TabsPanel;
