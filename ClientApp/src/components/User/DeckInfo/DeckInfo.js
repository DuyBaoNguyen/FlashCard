import React, { Component } from 'react';
import { Icon } from '@iconify/react';
import optionIcon from '@iconify/icons-uil/ellipsis-h';
import editIcon from '@iconify/icons-uil/edit';
import deleteIcon from '@iconify/icons-uil/trash-alt';
import publicIcon from '@iconify/icons-uil/share';
import cardIcon from '@iconify/icons-mdi/credit-card-outline';
import succeededCardIcon from '@iconify/icons-mdi/credit-card-check-outline';
import failedCardIcon from '@iconify/icons-mdi/credit-card-remove-outline';
import createdDateIcon from '@iconify/icons-uil/calendar-alt';
import { connect } from 'react-redux';
import { Collapse } from 'react-collapse';

import DropDown from '../../Shared/DropDown/DropDown';
import DropDownItem from '../../Shared/DropDownItem/DropDownItem';
import Button from '../../Shared/Button/Button';
import Switch from '../../Shared/Switch/Switch';
import Confirm from '../../Shared/Confirm/Confirm';
import { Roles } from '../../../applicationConstants';
import * as actions from '../../../store/actions';
import './DeckInfo.css';

class DeckInfo extends Component {
  state = {
    deletingConfirmOpen: false
  };

  handleDeleteDeck = () => {
    this.props.onDeleteDeck(this.props.deck.id);
    this.setState({ deletingConfirmOpen: false });
  }

  handleChangePublic = (event) => {
    this.props.onUpdateDeckPublicStatus(this.props.deck.id, event.target.checked);
  }

  handleClickPractice = () => {
    this.props.onSetPracticeOptionsOpen(true);
  }

  handleOpenDeletingConfirm = () => {
    this.setState({ deletingConfirmOpen: true });
  }

  handleCloseDeletingConfirm = () => {
    this.setState({ deletingConfirmOpen: false });
  }

  render() {
    const { deck, updateDeckPublicStatusError, showLess, profile } = this.props;
    const { deletingConfirmOpen } = this.state;

    return (
      <div className="deck-info-wrapper">
        <div className="deck-info-header">
          <div className="deck-info-options">
            <DropDown
              right
              changeable={deck?.public}
              postfix={<Icon icon={optionIcon} style={{ fontSize: 20 }} />}
              className="deck-info-dropdown">
              <DropDownItem
                type="link"
                path={{
                  pathname: `/decks/${deck?.id}/edit`,
                  backUrl: `/decks/${deck?.id}`
                }}
                icon={<Icon icon={editIcon} color="#646464" />}
                label="Edit deck" />
              <DropDownItem
                className="delete-deck-btn"
                type="button"
                icon={<Icon icon={deleteIcon} color="red" />}
                label="Delete this deck"
                onClick={this.handleOpenDeletingConfirm} />
              <DropDownItem type="line" />
              <DropDownItem
                className="public-deck"
                icon={<Icon icon={publicIcon} color="#646464" />}
                label={(
                  <>
                    Public
                    {deck?.public === true && deck?.approved === false && (
                      <i className="pending-notification">( pending )</i>
                    )}
                  </>
                )}>
                <div className="switch-wrapper">
                  <Switch
                    checked={deck?.public && !updateDeckPublicStatusError}
                    onChange={(event) => this.handleChangePublic(event)} />
                </div>
              </DropDownItem>
            </DropDown>
          </div>
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
          {profile?.role === Roles.User && (
            <>
              <div className="deck-field">
                <span className="deck-field-label">
                  <span className="deck-field-icon">
                    <Icon icon={succeededCardIcon} color="#aaa" style={{ fontSize: 18 }} />
                  </span>
                    Remembered cards
                  </span>
                <span className="deck-field-value">{deck?.totalSucceededCards}</span>
              </div>
              <div className="deck-field">
                <span className="deck-field-label">
                  <span className="deck-field-icon">
                    <Icon icon={failedCardIcon} color="#aaa" style={{ fontSize: 18 }} />
                  </span>
                    Not remembered cards
                  </span>
                <span className="deck-field-value">{deck?.totalFailedCards}</span>
              </div>
            </>
          )}
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
        </Collapse>
        {profile?.role === 'user' && (
          <div className="deck-features">
            <Button type="button" onClick={this.handleClickPractice}>Practice</Button>
            <Button type="link" path={`/decks/match/${deck?.id}`}>Match game</Button>
          </div>
        )}
        <Confirm
          isOpen={deletingConfirmOpen}
          header="Delete"
          message="Are you sure you want to delete this deck?"
          confirmLabel="Delete"
          confirmColor="#fe656d"
          onCancel={this.handleCloseDeletingConfirm}
          onConfirm={this.handleDeleteDeck}>
        </Confirm>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    profile: state.home.profile,
    updateDeckPublicStatusError: state.deckDetail.updateDeckPublicStatusError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onDeleteDeck: (id) => dispatch(actions.deleteDeck(id)),
    onUpdateDeckPublicStatus: (id, value) => dispatch(actions.updateDeckPublicStatus(id, value)),
    onSetPracticeOptionsOpen: (value) => dispatch(actions.setPracticeOptionsOpen(value))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeckInfo);