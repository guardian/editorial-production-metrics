import React from 'react';
import { Row, Col } from 'react-flexbox-grid';

const devs = [
    'Akash Askoolum'
];
const shadowers = [
    'Lawrence Wakefield'
];

const VerticalPadding = ({ children }) => (
  <div style={{ padding: '20px 0' }}>{children}</div>
);

const Heading = ({ children }) => (
  <div>
    <h2 style={{ display: 'inline-block', borderBottom: '1px solid #ffbc01' }}>
      {children}
    </h2>
  </div>
);

const List = ({ items }) => <ul>{items.map(item => <li>{item}</li>)}</ul>;

const NameList = ({ title, names }) => (
  <VerticalPadding>
    <Heading>{title}</Heading>
    {names.length ? <List items={names} /> : 'No people here :('}
  </VerticalPadding>
);

const EditorialShadowing = () => {
  return (
    <Row around="xs">
      <Col xs={12} md={8}>
        <VerticalPadding>
          This is a list of the names (or pseudonyms if you're not comfortable
          adding your name!) of the people who have shadowed the editorial tools
          team and the developers that worked with them. Part of the shadowing
          process will be adding your name to this list.
          <NameList title="People" names={shadowers} />
          <NameList title="Developers" names={devs} />
        </VerticalPadding>
      </Col>
    </Row>
  );
};

export default EditorialShadowing;
