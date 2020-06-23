import React, { Component } from 'react';
import { Link, Prompt } from 'react-router-dom';
import { connect } from 'react-redux';
import { Icon } from '@iconify/react';
import editIcon from '@iconify/icons-uil/edit';
import deleteIcon from '@iconify/icons-uil/trash-alt';
import optionIcon from '@iconify/icons-uil/ellipsis-v';

import CardFrontForm from '../../../components/User/CardFrontForm/CardFrontForm';
import withErrorHandler from '../../../hoc/withErrorHandler';
import Back from '../../../components/User/Back/Back';
import DropDown from '../../../components/Shared/DropDown/DropDown';
import DropDownItem from '../../../components/Shared/DropDownItem/DropDownItem';
import * as actions from '../../../store/actions';
import './EditCard.css';

class EditCard extends Component {
  UNSAFE_componentWillMount() {
    this.backUrl = this.props.location.state?.backUrl || '/';
  }

  componentDidMount() {
    this.cardId = this.props.match.params.cardId;
    this.props.onGetCard(this.cardId);
  }

  handleClickEditFront = () => {
    this.props.onToggleCardFrontForm(true);
  }

  handleCloseCardFrontForm = () => {
    this.props.onToggleCardFrontForm(false);
    this.props.onClearUpdateCardError();
  }

  handleDeleteCard = () => {

  };

  render() {
    const { card, cardFrontFormOpened } = this.props;

    return (
      <div className="edit-card">
        <Prompt
          when={card?.backs.length === 0}
          message="Card must have at least a back!" />
        <div className="back-feature">
          <Link to={this.backUrl || '/cards'}>
            Cancel
          </Link>
        </div>
        <div className="card-front">
          <div className="front-wrapper">
            <span className="front" onClick={this.handleClickEditFront}>
              {card?.front}
            </span>
            <span className="options">
              <DropDown
                right
                postfix={<Icon icon={optionIcon} color="#979797" style={{ fontSize: 18 }} />}
                className="dropdown-toggler">
                <DropDownItem
                  type="button"
                  icon={<Icon icon={editIcon} color="#535353" />}
                  label="Edit front"
                  onClick={this.handleClickEditFront} />
                <DropDownItem
                  className="delete-card-btn"
                  type="button"
                  icon={<Icon icon={deleteIcon} color="red" />}
                  label="Delete card"
                  onClick={this.handleDeleteCard} />
              </DropDown>
            </span>
          </div>
        </div>
        <div className="card-back">
          {card?.backs && card.backs.map(back => {
            return <Back key={back.id} back={back} />
          })}
        </div>
        <CardFrontForm
          card={card}
          isOpen={cardFrontFormOpened}
          onClose={this.handleCloseCardFrontForm} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    card: state.card.card,
    cardFrontFormOpened: state.card.cardFrontFormOpened
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetCard: (cardId) => dispatch(actions.getCard(cardId)),
    onToggleCardFrontForm: (opened) => dispatch(actions.toggleCardFrontForm(opened)),
    onClearUpdateCardError: () => dispatch(actions.clearUpdateCardError())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(EditCard));