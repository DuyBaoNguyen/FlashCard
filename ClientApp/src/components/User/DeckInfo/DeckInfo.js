import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import optionIcon from '@iconify/icons-uil/ellipsis-h';
import editIcon from '@iconify/icons-uil/edit';
import deleteIcon from '@iconify/icons-uil/trash-alt';
import { connect } from 'react-redux';

import DropDown from '../../Shared/DropDown/DropDown';
import DropDownItem from '../../Shared/DropDownItem/DropDownItem';
import Button from '../../Shared/Button/Button';
import * as actions from '../../../store/actions';
import './DeckInfo.css';

class DeckInfo extends Component {
  handleDeleteDeck = () => {
    this.props.onDeleteDeck(this.props.deck.id);
  }

  render() {
    console.log(this.props);
    const { deck } = this.props;
    return (
      <div className="deck-information">
        <div className="deck-info-header">
          <div className="deck-info-options">
            <DropDown
              right
              postfix={<Icon icon={optionIcon} color="#979797" style={{ fontSize: 20 }} />}
              className="deck-info-dropdown">
              <Link to="/">
              <DropDownItem
                type="link"
                path={`/decks/${this.props.deck !== null ? this.props.deck.id : null}/edit/`}
                icon={<Icon icon={editIcon} color="#535353" />}
                label="Edit deck" /></Link>
              <DropDownItem
                className="delete-deck-btn"
                type="button"
                icon={<Icon icon={deleteIcon} color="red" />}
                label="Delete this deck"
                onClick={this.handleDeleteDeck} />
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

const mapDispatchToProps = dispatch => {
  return {
    onDeleteDeck: (id) => dispatch(actions.deleteDeck(id))
  };
};

export default connect(null, mapDispatchToProps)(DeckInfo);