import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Icon } from '@iconify/react';
import cardIcon from '@iconify/icons-mdi/credit-card-outline';
import createdDateIcon from '@iconify/icons-uil/calendar-alt';
import ownerIcon from '@iconify/icons-uil/user';
import { connect } from 'react-redux';
import { Collapse } from 'react-collapse';

import Button from '../../Shared/Button/Button';
import * as actions from '../../../store/actions';
import './ProposedPublicDeckInfo.css';

class ProposedPublicDeckInfo extends Component {
  handleApproveDeck = () => {
    this.props.onApproveDeck(this.props.match.params.deckId, true);
  }

  handleDeclineDeck = () => {
    this.props.onApproveDeck(this.props.match.params.deckId, false);
  }
  
  render() {
    const { deck, showLess } = this.props;

    return (
      <div className="proposed-public-deck-info-wrapper">
        <div className="proposed-public-deck-info-header">{deck?.name}</div>
        <Collapse
          isOpened={!showLess}
          theme={{
            collapse: 'ReactCollapse--collapse proposed-public-deck-info',
            content: 'ReactCollapse--content content'
          }}>
          {deck?.description && (
            <div className="deck-description" title={deck.description}>
              {deck.description}
            </div>
          )}
          <div className="deck-field">
            <span className="deck-field-label">
              <span className="deck-field-icon">
                <Icon icon={cardIcon} color="#aaa" style={{ fontSize: 18 }} />
              </span>
              Number of cards
            </span>
            <span className="deck-field-value">{deck?.totalCards}</span>
          </div>
          <div className="deck-field">
            <span className="deck-field-label">
              <span className="deck-field-icon">
                <Icon icon={createdDateIcon} color="#aaa" style={{ fontSize: 18 }} />
              </span>
              Created date
            </span>
            <span className="deck-field-value">
              {deck?.createdDate && new Date(deck.createdDate).toDateString()}
            </span>
          </div>
          <div className="deck-field">
            <span className="deck-field-label">
              <span className="deck-field-icon">
                <Icon icon={ownerIcon} color="#aaa" style={{ fontSize: 18 }} />
              </span>
              Owner
            </span>
            <span className="deck-field-value">
              {deck?.owner.name}
              <span className="deck-field-extra-value">{deck?.owner.email}</span>
            </span>
          </div>
        </Collapse>
        <div className="deck-features">
          <Button
            type="button"
            className="approve-btn"
            onClick={this.handleApproveDeck}>
            Approve
          </Button>
          <Button
            type="button"
            className="decline-btn"
            onClick={this.handleDeclineDeck}>
            Decline
          </Button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onApproveDeck: (deckId, value) => dispatch(actions.approveProposedPublicDeck(deckId, value))
  };
};

export default withRouter(connect(null, mapDispatchToProps)(ProposedPublicDeckInfo));