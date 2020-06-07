import React, { Component } from 'react';
import { Icon } from '@iconify/react';
import optionIcon from '@iconify/icons-uil/ellipsis-h';
import editIcon from '@iconify/icons-uil/edit';
import deleteIcon from '@iconify/icons-uil/trash-alt';
import publicIcon from '@iconify/icons-uil/share';
import { connect } from 'react-redux';

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
    const { deck, updateDeckPublicStatusError } = this.props;
    return (
      <div className="deck-information">
        <div className="deck-info-header">
          <div className="deck-info-options">
            <DropDown
              right
              postfix={<Icon icon={optionIcon} color="#979797" style={{ fontSize: 20 }} />}
              className="deck-info-dropdown">
              <DropDownItem
                type="link"
                path={`/decks/${this.props.deck?.id}/edit`}
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
          <p>{deck?.name}</p>
        </div>
        <div className="deck-description">
          <i>{deck?.description}</i>
        </div>
        <div className="deck-field">
          <span className="deck-field-label">Number of cards</span>
          <span className="deck-field-value">{deck?.totalCards}</span>
        </div>
        <div className="deck-field">
          <span className="deck-field-label">Created date</span>
          <span className="deck-field-value">
            {new Date(deck?.createdDate).toDateString()}
          </span>
        </div>
        <div className="deck-features">
          <Button type="link" path={`/testing/${deck?.id}`}>Test</Button>
          <Button type="link" path={`/matchgame/${deck?.id}`}>Match game</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
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