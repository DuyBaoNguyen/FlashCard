import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import arrowLeftIcon from '@iconify/icons-uil/angle-left';

import UserDeckInfo from '../../../components/Admin/UserDeckInfo/UserDeckInfo';
import UserDeckCards from '../../../components/Admin/UserDeckCards/UserDeckCards';
import CardInfo from '../../../components/User/CardInfo/CardInfo';
import withErrorHandler from '../../../hoc/withErrorHandler';
import * as actions from '../../../store/actions/index';
import './UserDeckDetail.css';

class UserDeckDetail extends Component {
  UNSAFE_componentWillMount() {
    this.backUrl = this.props.location.state?.backUrl || '/';
  }

  componentDidMount() {
    const { match, onGetUserDeck } = this.props;
    onGetUserDeck(match.params.userId, match.params.deckId);
  }

  componentWillUnmount() {
    this.props.onResetStateInUserDeckDetailReducer();
  }

  handleCloseCard = () => {
    this.props.onUnselectCard();
  }

  render() {
    const { deck, selectedCard } = this.props;

    return (
      <div className="user-deck-detail">
        <section className="left-section">
          <div className="back-feature">
            <Link to={this.backUrl}>
              <span className="back-feature-icon">
                <Icon icon={arrowLeftIcon} />
              </span>
              <span className="back-feature-label"> Back</span>
            </Link>
          </div>
          <UserDeckInfo deck={deck} showLess={!!selectedCard} />
          {selectedCard && (
            <CardInfo card={selectedCard} closed={this.handleCloseCard} />
          )}
        </section>
        <section className="right-section">
          <UserDeckCards />
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    deck: state.userDeckDetail.deck,
    selectedCard: state.userDeckDetail.selectedCard
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetUserDeck: (userId, deckId) => dispatch(actions.getUserDeck(userId, deckId)),
    onUnselectCard: () => dispatch(actions.unselectUserDeckCard()),
    onResetStateInUserDeckDetailReducer: () => dispatch(actions.resetStateInUserDeckDetailReducer())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(UserDeckDetail));