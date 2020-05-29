import React from 'react';

import Navigation from '../Navigation/Navigation';
import Container from '../Container/Container';

const layout = props => (
  <div>
    <Navigation />
    <Container>
      {props.children}
    </Container>
  </div>
);

export default layout;
