import React, { Component } from 'react';

import ProposedPublicDecks from '../../../components/Admin/ProposedPublicDecks/ProposedPublicDecks';
import './PublicDecksManagement.css';

class PublicDecksManagement extends Component {
  render() {
    return (
      <div>
        <ProposedPublicDecks />
      </div>
    );
  }
}

export default PublicDecksManagement;