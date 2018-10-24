// see https://docs.google.com/document/d/1LdCwxJHTf-QCwhZYH-lzgyN4s7w2W8WDWklK74NZaM4/edit#heading=h.qzqah5xmsb1x for the purpose of this file
import React from 'react';
import { Row, Col } from 'react-flexbox-grid';

// suggested format is Forename Surname, Team/Department
const devs = [
    'Akash Askoolum, Editorial Tools/Digital',
    'Jonathon Herbert, Editorial Tools/Digital',
    'Michael Barton, Editorial Tools/Digital',
    'Richard Beddington, Editorial Tools/Digital',
    'Reetta Vaahtoranta, Editorial Tools/Digital',
    'Maria Livia Chiorean, Editorial Tools/Digital'
];
const shadowers = [
    'Lawrence Wakefield, Central Production',
    'Huw Prior, Strategy & delivery',
    'Aisha Riaz, The Guide',
    'Elli Narewska, NewsWise',
    'Dugald Baird, Business',
    'Max Walker, Features',
    'Ellie Broughton, Guardian Labs',
    'Joel Tennant, Marketing',
    'Michael Campbell, Marketing',
    'Chris Cowley, Marketing',
    'Nick Dastoor, Audience',
    'Kirstine Foge Jensen, The Guardian Foundation',
    'Nick Mead, Guardian Cities',
    'Karen Plews, International News'
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
