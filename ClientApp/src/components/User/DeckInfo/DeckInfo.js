import React, { Component } from 'react';
import { Icon } from '@iconify/react';
import optionIcon from '@iconify/icons-uil/ellipsis-h';
import editIcon from '@iconify/icons-uil/edit';
import deleteIcon from '@iconify/icons-uil/trash-alt';
import publicIcon from '@iconify/icons-uil/share';
import { connect } from 'react-redux';
import { Collapse } from 'react-collapse';

import DropDown from '../../Shared/DropDown/DropDown';
import DropDownItem from '../../Shared/DropDownItem/DropDownItem';
import Button from '../../Shared/Button/Button';
import Switch from '../../Shared/Switch/Switch';
import * as actions from '../../../store/actions';
import './DeckInfo.css';

class DeckInfo extends Component {
  handleDeleteDeck = () => {
    this.props.onDeleteDeck(this.props.deck.id);
  }

  handleChangePublic = (event) => {
    this.props.onUpdateDeckPublicStatus(this.props.deck.id, event.target.checked);
  }

  render() {
    const { deck, updateDeckPublicStatusError, showLess, profile } = this.props;

    return (
      <div className="deck-info-wrapper">
        <div className="deck-info-header">
          <div className="deck-info-options">
            <DropDown
              right
              changeable={deck?.public}
              postfix={<Icon icon={optionIcon} color="#979797" style={{ fontSize: 20 }} />}
              className="deck-info-dropdown">
              <DropDownItem
                type="link"
                path={{
                  pathname: `/decks/${deck?.id}/edit`,
                  backUrl: `/decks/${deck?.id}`
                }}
                icon={<Icon icon={editIcon} color="#535353" />}
                label="Edit deck" />
              <DropDownItem
                className="delete-deck-btn"
                type="button"
                icon={<Icon icon={deleteIcon} color="red" />}
                label="Delete this deck"
                onClick={this.handleDeleteDeck} />
              <DropDownItem type="line" />
              <DropDownItem
                className="public-deck"
                icon={<Icon icon={publicIcon} color="#535353" />}
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
            <div className="deck-description">
              <i>{deck.description}</i>
            </div>
          )}
          <div className="deck-field">
            <span className="deck-field-label">Number of cards</span>
            <span className="deck-field-value">{deck?.totalCards}</span>
          </div>
          <div className="deck-field">
            <span className="deck-field-label">Created date</span>
            <span className="deck-field-value">
              {deck?.createdDate && new Date(deck.createdDate).toDateString()}
            </span>
          </div>
        </Collapse>
        {profile?.role === 'user' && (
          <div className="deck-features">
            <Button type="link" path={`/decks/testing/${deck?.id}`}>Practice</Button>
            <Button type="link" path={`/decks/match/${deck?.id}`}>Match game</Button>
          </div>
        )}
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
    onUpdateDeckPublicStatus: (id, value) => dispatch(actions.updateDeckPublicStatus(id, value))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeckInfo);