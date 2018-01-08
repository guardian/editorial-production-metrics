<<<<<<< HEAD
import React from "react";
=======
import React, { Children } from "react";
>>>>>>> Add in routing
import { Row, Col } from "react-flexbox-grid";

const TabsPanel = ({ children }) => (
    <Row between="xs">
        {React.Children.map(children, child => <Col xs>{child}</Col>)}
    </Row>
);

export default TabsPanel;
