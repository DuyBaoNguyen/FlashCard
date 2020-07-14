import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Icon } from '@iconify/react';
import cardIcon from '@iconify/icons-mdi/credit-card-outline';
import createdDateIcon from '@iconify/icons-uil/calendar-alt';
import ownerIcon from '@iconify/icons-uil/user';
import { connect } from 'react-redux';
import { Collapse } from 'react-collapse';

import Button from '../../Shared/Button/Button';
import Confirm from '../../Shared/Confirm/Confirm';
import * as actions from '../../../store/actions';
import './UserDeckInfo.css';

class UserDeckInfo extends Component {
  state = {
    deletingConfirmOpen: false
  };

  handleDeleteDeck = () => {
    const { onDeleteDeck, match } = this.props;
    onDeleteDeck(match.params.userId, match.params.deckId);
    this.setState({ deletingConfirmOpen: false });
  }

  handleOpenDeletingConfirm = () => {
    this.setState({ deletingConfirmOpen: true });
  }

  handleCloseDeletingConfirm = () => {
    this.setState({ deletingConfirmOpen: false });
  }

  render() {
    const { deck, showLess } = this.props;
    const { deletingConfirmOpen } = this.state;

    return (
      <div className="user-deck-info-wrapper">
        <div className="user-deck-info-header">
          {deck?.name}
        </div>
        <Collapse
          isOpened={!showLess}
          theme={{
            collapse: 'ReactCollapse--collapse deck-info',
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
        <Button
          type="button"
          className="delete-btn"
          onClick={this.handleOpenDeletingConfirm}>
          Delete this deck
        </Button>
        <Confirm
          isOpen={deletingConfirmOpen}
          header="Delete"
          message="Are you sure you want to delete this deck?"
          confirmColor="#fe656d"
          onCancel={this.handleCloseDeletingConfirm}
          onConfirm={this.handleDeleteDeck}>
        </Confirm>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onDeleteDeck: (userId, deckId) => dispatch(actions.deleteUserDeck(userId, deckId))
  };
};

export default withRouter(connect(null, mapDispatchToProps)(UserDeckInfo));